import React, { Component, PropTypes } from 'react'

class TryOutWidgetTabExecuter extends Component {
  constructor () {
    super()
    this.state = { ...this.state, requestFormat: '', isValid: true }
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

  renderRequestFormats () {
    if (this.props.requestFormats.length > 0) {
      return (
        <select onChange={ (e) => this.handleRequestFormatChange(e)} >
          {this.props.requestFormats.map((format, i) =>
            <option key={i} value={format}>{format}</option>
          )}
        </select>
      )
    }
  }

  render () {
    return (
        <div className='panel-heading'>
          <span>Accept </span>
          {this.renderRequestFormats()}
          &nbsp;
          <button
            className='btn btn-primary btn-sm executeRequest'
            onClick={() => this.executeRequest()}
          >
            Execute request
            &nbsp;&nbsp;
            <i className='fa fa-angle-double-right' />
            &nbsp;
          </button>
          {this.props.requestInProgress && <span>&nbsp;<i className='fa fa-spinner fa-spin'></i></span>}
          {!this.state.isValid &&
            <strong>
              &nbsp;<i className='fa fa-exclamation'></i>&nbsp;
              <span>Required fields (*) missing</span>
            </strong>}
        </div>
    )
  }
}

TryOutWidgetTabExecuter.propTypes = {
  requestFormats: PropTypes.array.isRequired,
  requestInProgress: PropTypes.bool.isRequired,
  onExecuteRequest: PropTypes.func.isRequired,
  onValidateParameters: PropTypes.func.isRequired
}

export default TryOutWidgetTabExecuter
