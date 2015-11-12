import React, { Component, PropTypes } from 'react'

import TryOutWidgetTabParameters from './TryOutWidgetTabParameters'
import TryOutWidgetTabExecuter from './TryOutWidgetTabExecuter'
import TryOutWidgetTabExecuterResponsePanel from './TryOutWidgetTabExecuterResponsePanel'
import Display from '../Display'

import { Map } from 'immutable'
import { HttpRequest } from 'infrastructure'

class TryOutWidgetTab extends Component {
  constructor () {
    super()
    this.state = {
      requestInProgress: false,
      operationParameters: Map({}),
      response: {},
      requestPanelClassName: 'panel panel-http-response panel-default'
    }

    this.httpRequest = new HttpRequest((resp) => this.requestCallback(resp))
  }

  getUrl (path) {
    return `${this.props.apis.schemes[0]}://${this.props.apis.host}${path}`
  }

// ###############################################################################################################
// Events
// ###############################################################################################################

  handleParametersOnChange (name, value) {
    const newParameters = this.state.operationParameters.set(name, value)

    this.setState({...this.state, operationParameters: newParameters})
    console.log(`ParametersChange: ${name} - ${value} `)
  }

  validateParameters () {
    return this.httpRequest.validateParameters(
      this.props.operation.spec.parameters,
      this.state.operationParameters.toObject()
    )
  }

  executeRequest (requestFormat) {
    this.setState({...this.state, requestInProgress: true})

    this.httpRequest.doRequest({
      url: this.getUrl(this.props.operation.spec.url),
      requestFormat: requestFormat,
      spec: this.props.operation.spec,
      parameters: this.state.operationParameters.toObject()
    })
  }

  requestCallback (response) {
    this.setState({...this.state, requestInProgress: false, response: response})
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
    return (
      <div className='tab-content'>
        <TryOutWidgetTabParameters
          operation={this.props.operation}
          handleParametersOnChange={ (name, value) => this.handleParametersOnChange(name, value) }
        />
        <div className={ this.state.requestPanelClassName }>
          <TryOutWidgetTabExecuter
            requestFormats={this.props.operation.spec.produces}
            validateParameters={ () => this.validateParameters() }
            executeRequest={ (requestFormat) => this.executeRequest(requestFormat) }
            requestInProgress={this.state.requestInProgress}
          />
          <Display when={!this.state.requestInProgress && this.state.response && this.state.response.data && this.state.response.data !== ''}>
            <div className='panel-body'>
              <a href={this.state.response.url} target='_blank' title={this.state.response.url} style={textCropStyles}>{this.state.response.url}</a>
              <TryOutWidgetTabExecuterResponsePanel response={this.state.response} />
            </div>
          </Display>
        </div>
      </div>
    )
  }
}

TryOutWidgetTab.propTypes = {
  operation: PropTypes.object.isRequired,
  definitions: PropTypes.object.isRequired,
  apis: PropTypes.object.isRequired
}

export default TryOutWidgetTab
