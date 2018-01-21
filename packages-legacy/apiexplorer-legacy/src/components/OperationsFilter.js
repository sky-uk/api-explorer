import React, { Component, PropTypes } from 'react'

class OperationsFilter extends Component {
  constructor (props) {
    super()
    this.state = {
      text: props.initialText || '',
      handleFilterUpdateTimer: 0
    }

    this.handlerFilterChange = this.handlerFilterChange.bind(this)
    this.handleFilterUpdate = this.handleFilterUpdate.bind(this)
  }

  handlerFilterChange (e) {
    var timer = this.state.handleFilterUpdateTimer
    if (timer) clearTimeout(this.state.handleFilterUpdateTimer)
    timer = setTimeout(this.handleFilterUpdate, this.props.autoUpdateTimeout)

    this.setState({text: e.target.value, handleFilterUpdateTimer: timer})
  }

  handleFilterUpdate (e) {
    if (e) e.preventDefault()
    this.props.onFilter(this.state.text)
    if (this.state.handleFilterUpdateTimer) clearTimeout(this.state.handleFilterUpdateTimer)
    this.setState({handleFilterUpdateTimer: 0})
  }

  render () {
    return (
      <div id='filter-by-operation'>
        <form onSubmit={this.handleFilterUpdate}>
          <div className='form-group'>
            <div className='input-group'>
              <input
                type='text'
                ref='filterText'
                className='form-control'
                value={this.state.text}
                onChange={this.handlerFilterChange}
                placeholder={this.props.placeholder} />
              <div className='input-group-addon'>
                <i className='fa fa-filter' />
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

OperationsFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  initialText: PropTypes.string,
  autoUpdateTimeout: PropTypes.number
}

OperationsFilter.defaultProps = {
  autoUpdateTimeout: 400
}

export default OperationsFilter
