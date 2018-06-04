/* global Request */
/* global fetch */

function getMediaType (headerValue) {
  return headerValue ? headerValue.split(';')[0] : ''
}

class HttpRequest {
  constructor (preRequestCallback, postResponseCallback, useProxy) {
    this.preRequestCallback = preRequestCallback
    this.postResponseCallback = postResponseCallback
    this.useProxy = useProxy
  }

  validateParameters (operationParametersSpec, operationParameters) {
    if (!operationParametersSpec || operationParametersSpec.length === 0) {
      return true
    }

    if (operationParametersSpec) {
      let valid = true
      operationParametersSpec
        .filter(param => param.required)
        .forEach(param => {
          const value = operationParameters[param.name]
          if (!value) {
            valid = false
          }
        })
      return valid
    }

    return false
  }

  getRequestQueryString (params) {
    const parameters = params.spec.parameters || []

    // Query string parameters that come in the spec
    let queryString = parameters
      .filter(param => param.in === 'query')
      .filter(param => params.parameters[param.name] || params.parameters[param.name] !== '' || param.default || param.default !== '')
      .map(param => {
        let value = params.parameters[param.name]
        if (!value || value === '') {
          value = param['x-defaultValue']
        }
        if (value) {
          return param.name + '=' + encodeURIComponent(value)
        }
      })
      .filter(param => param && param !== '')
      .join('&')

    if (queryString && queryString !== '') {
      if (params.queryString && queryString !== '') {
        // add the default query string parameters
        return `${queryString}&${params.queryString}`
      }
      return queryString
    } else {
      if (params.queryString) {
        // Because the spec does not have parameters, return the default query string
        return params.queryString
      }
    }
    return ''
  }

  getRequestInformation (params) {
    let result = {
      url: params.url
    }

    const parameters = params.spec.parameters || []

    parameters
      .filter(param => param.in === 'path')
      .forEach(param => {
        const value = params.parameters[param.name]
        if (value || param['x-defaultValue']) {
          result.url = result.url.replace('{' + param.name + '}', encodeURIComponent(value || param['x-defaultValue']))
        }
      })

    const queryString = this.getRequestQueryString(params)
    if (queryString !== '') {
      result.url += '?' + queryString
    }

    result.url = result.url

    result.body = parameters
      .filter(param => param.in === 'body')
      .map(param => params.parameters[param.name] || param.default)[0]

    result.headers = {}
    parameters
      .filter(param => param.in === 'header' && params.parameters.hasOwnProperty(param.name))
      .forEach(param => {
        let value = params.parameters[param.name]

        if (!value && !param.default) {
          return
        }

        result.headers[param.name] = value || param.default
      })

    result.httpMethod = params.spec.httpMethod
    result.requestFormat = params.requestFormat

    return result
  }

  timeoutPromise (timeout, err, promise) {
    return new Promise(function (resolve, reject) {
      promise.then(resolve, reject)
      setTimeout(reject.bind(null, err), timeout)
    })
  }

  doRequest (params, GlobalHttpClientConfigurator, ApiHttpClientConfigurator) {
    const postResponseCallback = this.postResponseCallback
    const preRequestCallback = this.preRequestCallback

    const requestInformation = this.getRequestInformation(params)

    let finalUrl = requestInformation.url
    if (params.useProxy) {
      finalUrl = `/proxy/?url=${encodeURIComponent(requestInformation.url)}`
    }

    let requestTimeoutInMiliseconds = 0
    if (params.requestTimeoutInMiliseconds) {
      requestTimeoutInMiliseconds = params.requestTimeoutInMiliseconds
    }

    let headers = {
      'Accept': requestInformation.requestFormat,
      'Content-Type': requestInformation.requestFormat
    }

    params.headers.forEach(h => { headers[h.name] = h.value })
    requestInformation.headers = Object.assign({}, headers, requestInformation.headers)

    let requestConfig = {
      method: requestInformation.httpMethod,
      headers: requestInformation.headers,
      body: requestInformation.body
    }

    GlobalHttpClientConfigurator(requestConfig)
    ApiHttpClientConfigurator(requestConfig)

    var req = new Request(finalUrl, requestConfig)

    preRequestCallback(Object.assign({ inProgress: true }, requestInformation))

    this.timeoutPromise(requestTimeoutInMiliseconds, new Error('Request timed out'),
      fetch(req, { credentials: 'include' }))
      .then(response => {
        let resp = {
          url: requestInformation.url,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          requestFormat: requestInformation.requestFormat,
          contentType: getMediaType(response.headers.get('Content-Type'))
        }

        return response.text()
          .then(responseText => {
            resp.data = responseText
            postResponseCallback(Object.assign({}, requestInformation), resp)
          })
      })
      .catch(error => {
        console.warn('Fetch returned error, request failed', error)
        postResponseCallback(Object.assign({ inProgress: false }, requestInformation), {
          url: requestInformation.url,
          status: '',
          statusText: 'Request Failed'
        }, error)
      })
  }
}

export default HttpRequest
