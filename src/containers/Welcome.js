import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Welcome extends Component {
  render () {
    return (
      <div>
        &lt;- To start choose an API from the menu in the left.
      </div>
    )
  }
}

Welcome.propTypes = {
  children: PropTypes.element
}

export default connect(
  state => {
    return {
      apis: state.apis
    }
  }
)(Welcome)
