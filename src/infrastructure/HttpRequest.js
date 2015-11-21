class HttpRequest {
  constructor (callback, useProxy) {
    this.callback = callback
    this.useProxy = useProxy
  }

  validateParameters (operationParametersSpec, operationParameters) {
    if (operationParametersSpec && Object.getOwnPropertyNames(operationParameters).length > 0) {
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
          result.url = result.url.replace('{' + param.name + '}', value || param['x-defaultValue'])
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

    result.httpMethod = params.spec.httpMethod
    result.requestFormat = params.requestFormat

    return result
  }

  doRequest (params) {
    const callback = this.callback

    const requestInformation = this.getRequestInformation(params)

    let finalUrl = requestInformation.url
    if (params.useProxy) {
      finalUrl = `/proxy/?url=${encodeURIComponent(requestInformation.url)}`
    }

    let headers = {
      'Accept': requestInformation.requestFormat,
      'Content-Type': requestInformation.requestFormat
    }

    params.headers.forEach(h => headers[h.name] = h.value)

    fetch(finalUrl, {
      method: requestInformation.httpMethod,
      headers: headers,
      body: requestInformation.body,
      credentials: 'include'
    })
    .then(response => {
      let resp = {
        url: requestInformation.url,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        requestFormat: requestInformation.requestFormat
      }
      response.text()
              .then(data => {
                resp.data = data
                callback(resp)
              })
    })
  }
}

export default HttpRequest
