import React, { Component } from 'react'

export default class CurlGeneratorTab extends Component {
  buildCurlCommand (request) {
    const { httpMethod, headers, url, body } = request

    let curlBuilder = []

    curlBuilder.push('curl')
    curlBuilder.push('-X', httpMethod.toUpperCase())
    curlBuilder.push(`"${url}"`)

    for (var headerName in headers) {
      curlBuilder.push('-H')
      curlBuilder.push(`'${headerName}: ${headers[headerName]}'`)
    }

    if (body) {
      curlBuilder.push('-d')
      curlBuilder.push(JSON.stringify(body).replace(/\\n/g, ''))
    }

    return curlBuilder.join(' ')
  }

  render () {
    const curlCommand = this.props.operationResponse && this.props.operationResponse.request && this.buildCurlCommand(this.props.operationResponse.request)

    return (
      <div className='tab-content'>
        <h4>CURL</h4>
        <pre>
          {curlCommand}
        </pre>
      </div>
    )
  }
}
