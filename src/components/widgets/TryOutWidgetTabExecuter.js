import React, { Component, PropTypes } from 'react'
import Display from '../Display'

class TryOutWidgetTabExecuter extends Component {
  constructor () {
    super()
    this.state = {requestFormat: '', isValid: true}
  }

  handleRequestFormatChange (e) {
    this.setState({...this.state, requestFormat: e.currentTarget.value})
  }

  executeRequest () {
    if (this.props.validateParameters()) {
      this.setState({...this.state, isValid: true})
      this.props.executeRequest(this.state.requestFormat)
    } else {
      this.setState({...this.state, isValid: false})
    }
  }

  renderRequestFormats () {
    if (this.props.requestFormats.length > 0) {
      return (
        <select onChange={ (e) => this.handleRequestFormatOnChange(e)} >
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
            onClick={() => this.executeRequest() }
          >
            Execute request
            &nbsp;&nbsp;
            <i className='fa fa-angle-double-right' />
            &nbsp;
          </button>
          <Display when={this.props.requestInProgress} inline>
            <span>&nbsp;<i className='fa fa-spinner fa-spin'></i></span>
          </Display>
          <Display when={!this.state.isValid} inline>
            <strong>
              &nbsp;<i className='fa fa-exclamation'></i>&nbsp;
              <span>Required fields (*) missing</span>
            </strong>
          </Display>
        </div>
    )
  }
}

TryOutWidgetTabExecuter.propTypes = {
  requestFormats: PropTypes.array.isRequired,
  executeRequest: PropTypes.func.isRequired,
  validateParameters: PropTypes.func.isRequired,
  requestInProgress: PropTypes.bool.isRequired
}

export default TryOutWidgetTabExecuter
