class HttpRequest {
  constructor (callback, useProxy) {
    this.callback = callback
    this.useProxy = useProxy
  }

  validateParameters (operationParametersSpec, operationParameters) {
    if (Object.getOwnPropertyNames(operationParameters).length > 0) {
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

    return true
  }

  getRequestInformation (params) {
    let result = {
      url: params.url
    }

    params.spec.parameters
      .filter(param => param.in === 'path')
      .forEach(param => {
        const value = params.parameters[param.name]
        if (value || param.default) {
          result.url = result.url.replace('{' + param.name + '}', value || param.default)
        }
      })

    const querystring = params.spec.parameters
            .filter(param => param.in === 'query')
            .filter(param => params.parameters[param.name] || params.parameters[param.name] !== '' || param.default || param.default !== '')
            .map(param => {
              let value = params.parameters[param.name]
              if (!value || value === '') {
                value = param.default
              }
              if (value) {
                return param.name + '=' + encodeURIComponent(value)
              }
            })
            .join('&')

    if (querystring && querystring !== '') {
      result.url += `?${querystring}`
    }

    result.body = params.spec.parameters
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
      finalUrl = `/proxy/?url=${requestInformation.url}`
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
