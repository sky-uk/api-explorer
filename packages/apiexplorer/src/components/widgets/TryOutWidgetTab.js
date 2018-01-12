import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import URI from 'urijs'

import { Segment, Label } from 'semantic-ui-react'

import { HttpStatus, HttpRequest } from 'apiexplorer-core'

import { newParameters, localParameters, responseReceived } from '../../actions/loadActionCreators'
import TryOutWidgetTabParameters from './TryOutWidgetTabParameters'
import TryOutWidgetTabExecuter from './TryOutWidgetTabExecuter'
import TryOutWidgetTabResponsePanel from './TryOutWidgetTabResponsePanel'
import TryOutWidgetTabHttpHeadersPanel from './TryOutWidgetTabHttpHeadersPanel'

class TryOutWidgetTab extends Component {

  state = this.makeState()
  httpRequest = new HttpRequest(this.requestCallback.bind(this))

  setDefaultOperationParameters (props) {
    let newParameters = this.getDefaultOperationParameters(props)
    this.setState({operationParameters: newParameters})
  }

  getDefaultOperationParameters (props) {
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

    return newParameters
  }

  setOperationParameters (props) {
    let newParameters = this.getDefaultOperationParameters(props)

    // Override default parameters with the ones in global storage
    props.operationLocalParameters && Object.keys(props.operationLocalParameters).length && Object.keys(props.operationLocalParameters).forEach(key => {
      newParameters[key] = props.operationLocalParameters[key]
    })

    // Override newParameters with `param-*` query string overrides
    // TODO: fix location.query ----------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------
    // Object.keys(props.location.query)
    //       .filter(key => key.startsWith('param-'))
    //       .map(key => key.replace(/^param-/, ''))
    //       .forEach(key => { newParameters[key] = props.location.query[`param-${key}`] })
    // -----------------------------------------------------------------------------------------------------

    let newState = Object.assign({}, this.makeState(), { operationParameters: newParameters })
    this.setState(newState)
    if(props.operationResponse && props.operationResponse.response && props.operationResponse.response.status)
    {
      this.setState({showLastResponse: true})
      this.changeResponseStatusColor(props.operationResponse.response);
    }
  }

  componentWillMount () {
    this.setOperationParameters(this.props)
  }
  
  componentWillReceiveProps (nextProps) {
    this.setOperationParameters(nextProps)
  }

  makeState () {
    return {
      requestInProgress: false,
      operationParameters: {},
      response: {},
      request: {},
      showLastResponse: false,
      requestPanelColor: 'grey'
    }
  }

  getUrl (path) {
    let scheme = this.props.apis.schemes ? this.props.apis.schemes[0] : this.props.config.defaultScheme
    let uri = new URI(`${scheme}://${this.props.apis.host}${this.props.apis.basePath}${path}`)

    uri.normalizePath()
    uri = URI.decode(uri)

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

  requestCallback (request, response, error) {
    this.props.dispatch(responseReceived(this.props.operation, response, request, error))
    this.setState({requestInProgress: false, response: response, request: request, error: error})
    this.changeResponseStatusColor(response);
  }

  changeResponseStatusColor(response) {
    if (!response) {
      response = { status: '' };
    }

    const statusCategories = {
      '': 'grey',
      '2': 'green',
      '3': 'blue',
      '4': 'orange',
      '5': 'red'
    }

    const statusCategory = ('' + response.status).charAt(0)
    this.setState({ requestPanelColor: `${statusCategories[statusCategory]}` })
  }

  hideResponse (e) {
    e.preventDefault()
    this.props.dispatch(responseReceived(this.props.operation, {}, {}, null))
    this.setState({ response: null, showLastResponse: false, error: null })
    this.changeResponseStatusColor(null)
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

    const requestInProgress = this.state.requestInProgress;
    const showResponse = !requestInProgress && (this.state.response && this.state.response.status)
    const showError = !requestInProgress && this.state.error
    const showLastResponse = this.state.showLastResponse
    const response = !showResponse && this.props.operationResponse ? this.props.operationResponse.response : this.state.response
    const url = response && response.url

    const request = this.state.request
    const requestHeaders = request.headers

    const httpStatusInfo = HttpStatus.values.find(s => s.value == response.status) || { details: [{ description: '' }] }

    return (
      <Segment attached='bottom'>
        <TryOutWidgetTabParameters
          operation={this.props.operation}
          definitions={this.props.definitions}
          operationParameters={this.state.operationParameters}
          operationLastParameters={this.props.operationLastParameters}
          headers={this.props.config.headers.concat(this.props.apiConfig.headers)}
          onHandleParametersChange={(name, value) => this.onHandleParametersChange(name, value)}
          onHandleLastParametersChange={parameters => this.onHandleLastParametersChange(parameters)}
        />
        <div>
          <Segment className='no-border no-padding' attached secondary color={this.state.requestPanelColor}>
            <TryOutWidgetTabExecuter
              requestFormat={this.state.requestFormat}
              requestFormats={this.props.operation.spec.consumes}
              requestInProgress={this.state.requestInProgress}
              onValidateParameters={() => this.onValidateParameters()}
              onExecuteRequest={requestFormat => this.onExecuteRequest(requestFormat)}
            />
            {(showResponse || showLastResponse) && <span>&nbsp;&nbsp;<a href='about:blank' onClick={e => this.hideResponse(e)}>Hide Response</a></span>}

            {(showResponse || showLastResponse) && <span style={{ float: 'right' }}>
              <Label color={this.state.requestPanelColor}>
                <abbr title={httpStatusInfo.details[0].description}>{response.status} {response.statusText}</abbr>
              </Label>
            </span>}
          </Segment>

          {showError && <Segment attached className='no-border no-padding'>
            <a href={url} target='_blank' title={url} style={textCropStyles}>{url}</a>
            <Label color='red'>Error calling API: {this.state.error.toString()}</Label>
          </Segment>}

          {(showResponse || showLastResponse) && <Segment attached className='no-border no-padding'>
            <a href={url} target='_blank' title={url} style={textCropStyles}>{url}</a>
            <TryOutWidgetTabResponsePanel response={response} operations={this.props.operations} apis={this.props.apis} />
            <TryOutWidgetTabHttpHeadersPanel requestHeaders={requestHeaders} responseHeaders={response.headers} />
          </Segment>}
        </div>
      </Segment>
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
