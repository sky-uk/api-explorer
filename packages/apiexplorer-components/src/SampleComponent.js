import React, { Component } from 'react'

export default class extends Component {
  render () {
    return <div>
      <h2>This is an example component!</h2>
      <div>[{this.props.text}]</div>
    </div>
  }
}
