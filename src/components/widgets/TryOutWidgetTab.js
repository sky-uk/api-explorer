import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import URI from 'urijs'

import { newParameters, localParameters, newResponse } from '../../actions/loadActionCreators'
import TryOutWidgetTabParameters from './TryOutWidgetTabParameters'
import TryOutWidgetTabExecuter from './TryOutWidgetTabExecuter'
import TryOutWidgetTabResponsePanel from './TryOutWidgetTabResponsePanel'
import TryOutWidgetTabHttpHeadersPanel from './TryOutWidgetTabHttpHeadersPanel'

// import { Map } from 'immutable'
import { HttpRequest } from 'infrastructure'

class TryOutWidgetTab extends Component {
  constructor () {
    super()
    this.state = this.getState()

    this.httpRequest = new HttpRequest((resp) => this.requestCallback(resp))
  }

  setDefaultOperationParameters (props) {
    let newParameters = {}

    props.operation.spec.parameters && props.operation.spec.parameters.forEach(param => {
      let value
      if (param.type === 'array') {
        value = param.items.default
      } else {
        value = param.default
      }
      if (value) {
        newParameters[param.name] = value
      }
    })

    this.setState({operationParameters: newParameters})
  }

  setOperationParameters (props) {
    this.setDefaultOperationParameters(props)

    let newParameters = {}

    // Override default parameters with the ones in global storage
    props.operationLocalParameters && Object.keys(props.operationLocalParameters).length && Object.keys(props.operationLocalParameters).forEach(key => {
      newParameters[key] = props.operationLocalParameters[key]
    })

    // Override newParameters with `param-*` query string overrides
    Object.keys(props.location.query)
          .filter(key => key.startsWith('param-'))
          .map(key => key.replace(/^param-/, ''))
          .forEach(key => { newParameters[key] = props.location.query[`param-${key}`] })

    this.setState({operationParameters: newParameters})
  }

  componentWillMount () {
    this.setOperationParameters(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.state = this.getState()
    this.setOperationParameters(nextProps)
  }

  getState () {
    return {
      requestInProgress: false,
      operationParameters: {},
      response: {},
      showLastResponse: false,
      requestPanelClassName: 'panel panel-http-response panel-default'
    }
  }

  getUrl (path) {
    let scheme = this.props.apis.schemes ? this.props.apis.schemes[0] : this.props.config.defaultScheme
    let uri = new URI(`${scheme}://${this.props.apis.host}${this.props.apis.basePath}${path}`)

    uri.normalizePath()

    return uri.toString()
  }

// ###############################################################################################################
// Events
// ###############################################################################################################

  onHandleParametersChange (name, value) {
    let newParameters = this.state.operationParameters
    newParameters[name] = value
    this.setState({operationParameters: newParameters})
  }

  onValidateParameters () {
    return this.httpRequest.validateParameters(
      this.props.operation.spec.parameters,
      this.state.operationParameters
    )
  }

  onHandleLastParametersChange (optionValues) {
    if (optionValues['values'] === 'default') {
      this.setDefaultOperationParameters(this.props)
    } else {
      let newParameters = {}

      Object.keys(optionValues).forEach(key => {
        newParameters[key] = optionValues[key]
      })

      this.setState({operationParameters: newParameters})
    }
  }

  onExecuteRequest (requestFormat) {
    this.props.dispatch(
      newParameters(
        this.props.operation.id,
        {
          values: this.state.operationParameters,
          moment: moment().format()
        }
      )
    )

    this.props.dispatch(localParameters(this.props.operation.id, this.state.operationParameters))

    this.setState({requestInProgress: true, requestFormat: requestFormat})
    this.httpRequest.doRequest({
      url: this.getUrl(this.props.operation.spec.url),
      useProxy: this.props.config.useProxy,
      headers: this.props.config.headers.concat(this.props.apiConfig.headers),
      queryString: this.props.config.queryString,
      requestFormat: requestFormat && requestFormat !== '' ? requestFormat : this.props.operation.spec.produces[0],
      spec: this.props.operation.spec,
      parameters: this.state.operationParameters
    }, this.props.config.HttpClientConfigurator, this.props.apiConfig.HttpClientConfigurator)
  }

  requestCallback (response) {
    this.props.dispatch(newResponse(this.props.operation, response))

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
// Renderers
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
    const showLastResponse = !showResponse && this.props.operationResponse
    const response = !showResponse && this.props.operationResponse ? this.props.operationResponse : this.state.response
    const url = response && response.url
    return (
      <div className='tab-content'>
        <TryOutWidgetTabParameters
          operation={this.props.operation}
          operationParameters={this.state.operationParameters}
          operationLastParameters={this.props.operationLastParameters}
          onHandleParametersChange={ (name, value) => this.onHandleParametersChange(name, value) }
          onHandleLastParametersChange={ (e) => this.onHandleLastParametersChange(JSON.parse(e.target.selectedOptions[0].value)) }
        />
        <div className={ this.state.requestPanelClassName }>
          <div className='panel-heading'>
            <TryOutWidgetTabExecuter
              requestFormat={this.state.requestFormat}
              requestFormats={this.props.operation.spec.consumes}
              requestInProgress={this.state.requestInProgress}
              onValidateParameters={ () => this.onValidateParameters() }
              onExecuteRequest={ requestFormat => this.onExecuteRequest(requestFormat) }
            />
            {showResponse && <span>&nbsp;&nbsp;<a href='about:blank' onClick={ e => this.hideResponse(e) }>Hide Response</a></span>}

            {(showResponse || showLastResponse) && <div className='pull-right'>
              <strong>
                <span>{response.status}</span>
                &nbsp;
                <span>{response.statusText}</span>
              </strong>
            </div>}
          </div>
          {(showResponse || showLastResponse) && <div className='panel-body'>
            <a href={url} target='_blank' title={url} style={textCropStyles}>{url}</a>
            <TryOutWidgetTabResponsePanel response={response} operations={this.props.operations} apis={this.props.apis} />
            <TryOutWidgetTabHttpHeadersPanel requestHeaders={this.props.config.headers.concat(this.props.apiConfig.headers)} responseHeaders={response.headers} />
          </div>}
        </div>
      </div>
    )
  }
}

TryOutWidgetTab.propTypes = {
  operation: PropTypes.object.isRequired,
  operations: PropTypes.object.isRequired,
  operationResponse: PropTypes.object,
  definitions: PropTypes.object.isRequired,
  apis: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  apiConfig: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  operationLastParameters: PropTypes.object.isRequired,
  operationLocalParameters: PropTypes.object.isRequired
}

export default TryOutWidgetTab
