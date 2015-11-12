import React, { Component, PropTypes } from 'react'

class Display extends Component {
  render () {
    if (!this.props.when) {
      return false
    }
    if (this.props.inline) {
      return <span>{this.props.children}</span>
    }
    return <div>{this.props.children}</div>
  }
}

Display.propTypes = {
  when: PropTypes.bool.isRequired,
  inline: PropTypes.bool,
  children: PropTypes.element
}

export default Display
