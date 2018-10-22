import React, { Component } from 'react'

class APICounter extends Component {
  render () {
    const numberOfAPIs = this.props.numberOfAPIs
    return (
      <span className='badge'>{numberOfAPIs} API{numberOfAPIs > 1 ? 's' : ''}</span>
    )
  }
}

export default APICounter
