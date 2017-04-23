import React, { Component, PropTypes } from 'react'

const requestDefaultFormats = [
  'application/json',
  'application/xml'
]

class TryOutWidgetTabExecuter extends Component {
  constructor () {
    super()
    this.state = { isValid: true, requestDefaultFormats }
  }

  handleRequestFormatChange (e) {
    this.setState({ requestFormat: e.currentTarget.value })
  }

  executeRequest () {
    if (this.props.onValidateParameters()) {
      this.setState({ isValid: true })
      this.props.onExecuteRequest(this.state.requestFormat)
    } else {
      this.setState({ isValid: false })
    }
  }

  setRequestFormats (props) {
    let requestFormats = requestDefaultFormats
    if (this.props.requestFormats && this.props.requestFormats.length > 0) {
      requestFormats = this.props.requestFormats
    }

    this.setState({ requestFormat: this.props.requestFormat || requestFormats[0], requestFormats: requestFormats })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ isValid: true, requestDefaultFormats })
    this.setRequestFormats(nextProps)
  }

  componentWillMount () {
    this.setRequestFormats(this.props)
  }

  renderRequestFormats () {
    return (
      <select value={this.state.requestFormat || this.state.requestFormats[0]}
        onChange={(e) => this.handleRequestFormatChange(e)} >
        {this.state.requestFormats.map((format, i) =>
          <option key={i} value={format}>{format}</option>
        )}
      </select>
    )
  }

  render () {
    return (
      <span>
        <span>Accept </span>
        {this.renderRequestFormats()}
        &nbsp;
        <button className='ui button primary mini executeRequest' onClick={() => this.executeRequest()} >
          Execute request
          &nbsp;&nbsp;
          <i className='fa fa-angle-double-right' />
          &nbsp;
        </button>
        {this.props.requestInProgress && <span>&nbsp;<i className='fa fa-spinner fa-spin' /></span>}
        {!this.state.isValid &&
          <strong>
            &nbsp;<i className='fa fa-exclamation' />&nbsp;
            <span>Required fields (*) missing</span>
          </strong>}
      </span>
    )
  }
}

TryOutWidgetTabExecuter.propTypes = {
  requestFormat: PropTypes.string,
  requestFormats: PropTypes.array,
  requestInProgress: PropTypes.bool.isRequired,
  onExecuteRequest: PropTypes.func.isRequired,
  onValidateParameters: PropTypes.func.isRequired
}

export default TryOutWidgetTabExecuter
