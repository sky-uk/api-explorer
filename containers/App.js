import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';
import { Link } from 'react-router'

@connect(
  state => ({ todos: state.todos }),
  dispatch => ({
    addTodo: (...args) => dispatch(TodoActions.addTodo(...args)),
    actions: bindActionCreators(TodoActions, dispatch)
   })
)
export default class App extends Component {
  render() {
    const { todos, actions, addTodo } = this.props;
    return (
      <div>
        <Header addTodo={addTodo} />
        <MainSection todos={todos} actions={actions} />
        <hr />
        <ul>
          <li><Link to='/other'>other page</Link></li>
          <li><Link to='/settings'>Settings</Link></li>
        </ul>
      </div>
    )
  }
}
