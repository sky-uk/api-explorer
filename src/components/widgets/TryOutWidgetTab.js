import React, { Component, PropTypes } from 'react'

import TryOutWidgetTabParameters from './TryOutWidgetTabParameters'
import TryOutWidgetTabExecuter from './TryOutWidgetTabExecuter'
import TryOutWidgetTabResponsePanel from './TryOutWidgetTabResponsePanel'
import TryOutWidgetTabHttpHeadersPanel from './TryOutWidgetTabHttpHeadersPanel'

import { Map } from 'immutable'
import { HttpRequest } from 'infrastructure'

class TryOutWidgetTab extends Component {
  constructor () {
    super()
    this.state = this.getState()

    this.httpRequest = new HttpRequest((resp) => this.requestCallback(resp))
  }

  componentWillReceiveProps () {
    this.setState(this.getState())
  }

  getState () {
    return {
      ...this.state,
      requestInProgress: false,
      operationParameters: Map({}),
      response: {},
      requestPanelClassName: 'panel panel-http-response panel-default'
    }
  }

  getUrl (path) {
    return `${this.props.apis.schemes[0]}://${this.props.apis.host}${this.props.apis.basePath}${path}`
  }

// ###############################################################################################################
// Events
// ###############################################################################################################

  onHandleParametersChange (name, value) {
    const newParameters = this.state.operationParameters.set(name, value)

    this.setState({operationParameters: newParameters})
    console.log(`ParametersChange: ${name} - ${value} `)
  }

  onValidateParameters () {
    return this.httpRequest.validateParameters(
      this.props.operation.spec.parameters,
      this.state.operationParameters.toObject()
    )
  }

  onExecuteRequest (requestFormat) {
    this.setState({requestInProgress: true, requestFormat: requestFormat})
    this.httpRequest.doRequest({
      url: this.getUrl(this.props.operation.spec.url),
      useProxy: this.props.config.useProxy,
      headers: this.props.config.headers,
      queryString: this.props.config.queryString,
      requestFormat: requestFormat && requestFormat !== '' ? requestFormat : this.props.operation.spec.produces[0],
      spec: this.props.operation.spec,
      parameters: this.state.operationParameters.toObject()
    })
  }

  requestCallback (response) {
    this.setState({requestInProgress: false, response: response})

    if (response.status >= 200 && response.status < 300) {
      this.setState({ requestPanelClassName: 'panel panel-http-response panel-success' })
    } else {
      this.setState({ requestPanelClassName: 'panel panel-http-response panel-danger' })
    }
  }

  hideResponse (e) {
    e.preventDefault()
    this.setState({response: null, requestPanelClassName: 'panel panel-http-response panel-default'})
  }

// ###############################################################################################################
// Renderes
// ###############################################################################################################

  render () {
    const textCropStyles = {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      display: 'inline-block',
      width: '100%',
      overflow: 'hidden'
    }

    const showResponse = !this.state.requestInProgress && this.state.response && this.state.response.data && this.state.response.data !== ''

    return (
      <div className='tab-content'>
        <TryOutWidgetTabParameters
          operation={this.props.operation}
          onHandleParametersChange={ (name, value) => this.onHandleParametersChange(name, value) }
        />
        <div className={ this.state.requestPanelClassName }>
          <div className='panel-heading'>
            <TryOutWidgetTabExecuter
              requestFormat={this.state.requestFormat}
              requestFormats={this.props.operation.spec.produces}
              requestInProgress={this.state.requestInProgress}
              onValidateParameters={ () => this.onValidateParameters() }
              onExecuteRequest={ requestFormat => this.onExecuteRequest(requestFormat) }
            />
            {showResponse && <small>&nbsp;&nbsp;<a href='about:black' onClick={ e => this.hideResponse(e) }>Hide Response</a></small>}
            {showResponse && <div className='pull-right'>
              <strong>
                <span>{this.state.response.status}</span>
                &nbsp;
                <span>{this.state.response.statusText}</span>
              </strong>
            </div>}
          </div>
          {showResponse && <div className='panel-body'>
            <a href={this.state.response.url} target='_blank' title={this.state.response.url} style={textCropStyles}>{this.state.response.url}</a>
            <TryOutWidgetTabResponsePanel response={this.state.response} />
            <TryOutWidgetTabHttpHeadersPanel requestHeaders={this.props.config.headers} responseHeaders={this.state.response.headers} />
          </div>}
        </div>
      </div>
    )
  }
}

TryOutWidgetTab.propTypes = {
  operation: PropTypes.object.isRequired,
  definitions: PropTypes.object.isRequired,
  apis: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired
}

export default TryOutWidgetTab
