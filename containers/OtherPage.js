import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router'

@connect(state => ({ todos: state.todos }))
export default class OtherPage extends Component {
  render() {
    const { todos } = this.props;
    return (
      <div>
        There are a total number of <strong>{todos.length}</strong> todos!
        <br/>
        <br/>
        <Link to='/'>Go Back!</Link>
      </div>
    );
  }
}
