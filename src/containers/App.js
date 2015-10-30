import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class App extends Component {
  render () {
    return (
      <div>
      </div>
    )
  }
}

App.propTypes = {
}

export default connect(
  state => ({ })
  /*dispatch => ({
    addTodo: (...args) => dispatch(TodoActions.addTodo(...args)),
    actions: bindActionCreators(TodoActions, dispatch)
  })*/
)(App)
