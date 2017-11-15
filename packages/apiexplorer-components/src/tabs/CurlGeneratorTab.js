import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
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
    return (
      <Segment attached='bottom'>
        <h4>CURL</h4>
        {this.renderInternal()}
      </Segment>
    )
  }

  renderInternal () {
    if (!this.props.operationResponse || !this.props.operationResponse.request) {
      return <span>You need to issue a request first.</span>
    }


    const curlCommand = this.buildCurlCommand(this.props.operationResponse.request)
    return (
        <pre>{curlCommand}</pre>
    )
  }
}
