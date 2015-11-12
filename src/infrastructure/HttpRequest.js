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

    if ( querystring && querystring !== '') {
      currentUrl += `?${querystring}`
    }

    /* fetch(params.currentPath, {
      method: 'post',
      headers: {
        'Accept': params.requestFormat,
        'Content-Type': params.requestFormat
      },
      body: body
    })
    .then(response => callback(response))*/

    setTimeout(() => callback({url: currentUrl, data: this.getDummyResponse()}), 1500)
  }

  getDummyResponse () {
    return `[
    {
      "id": 1446833771076,
      "category": {
        "id": 0,
        "name": "really-happy"
      },
      "name": "programmer",
      "photoUrls": [
        "http://foo.bar.com/1",
        "http://foo.bar.com/2"
      ],
      "status": "available"
    },
    {
      "id": 1446833772232,
      "category": {
        "id": 0,
        "name": "really-happy"
      },
      "name": "gorilla",
      "photoUrls": [
        "http://foo.bar.com/1",
        "http://foo.bar.com/2"
      ],
      "status": "available"
    },
    {
      "id": 1446833772864,
      "category": {
        "id": 0,
        "name": "really-happy"
      },
      "name": "furt",
      "photoUrls": [
        "http://foo.bar.com/1",
        "http://foo.bar.com/2"
      ],
      "status": "available"
    }]`
  }
}

export default HttpRequest
