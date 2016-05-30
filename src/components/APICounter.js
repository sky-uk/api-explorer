import React, { PropTypes, Component } from 'react'

class APICounter extends Component {

  render () {
    const numberOfAPIs = this.props.numberOfAPIs
    return (
      <span className='badge'>{numberOfAPIs} API{numberOfAPIs > 1 ? 's' : ''}</span>
    )
  }
}

APICounter.propTypes = {
  numberOfAPIs: PropTypes.number.isRequired
}

export default APICounter
