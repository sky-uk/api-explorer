import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class OtherPage extends Component {
  render () {
    const { todos } = this.props
    return (
      <div>
        There are a total number of <strong>{todos.length}</strong> todos!
        <br/>
        <br/>
        <Link to='/'>Go Back!</Link>
      </div>
    )
  }
}

OtherPage.propTypes = {
  todos: PropTypes.array.isRequired
}

export default connect(
  state => ({ todos: state.todos })
)(OtherPage)
