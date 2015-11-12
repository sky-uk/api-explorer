class HttpRequest {
  constructor (callback) {
    this.callback = callback
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

    return false
  }

  doRequest (params) {
    debugger
    const callback = this.callback
    let currentUrl = params.url

    params.spec.parameters
      .filter(param => param.in === 'path')
      .forEach(param => {
        const value = params.parameters[param.name]
        if (value || param.default) {
          currentUrl = currentUrl.replace('{' + param.name + '}', value || param.default)
        }
      })

    console.log('Path: ' + currentUrl)

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

    console.log('Query String: ' + querystring)

    const body = params.spec.parameters
            .filter(param => param.in === 'body')
            .map(param => params.parameters[param.name] || param.default)[0]

    console.log('Body: ' + body)

    currentUrl += `currentUrl?${querystring}`

    /* fetch(params.currentPath, {
      method: 'post',
      headers: {
        'Accept': params.requestFormat,
        'Content-Type': params.requestFormat
      },
      body: body
    })
    .then(response => callback(response))*/
    setTimeout(() => callback({url: currentUrl, data: 'dummy response'}), 1500)
  }
}

export default HttpRequest
