import './Application.css'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as TodoActions from '../actions/todos'
import { Link } from 'react-router'
import { ExplorerHeader } from '../components'

class Application extends Component {
  render () {
    return (
      <div id='content'>
        <div id='sidebar'>
          <div className='api-explorer-logo'>
            <Link to='/' >
            <img src='https://dev.int.skystore.com/api/explorer/public/images/logo_transparent.png' />
            </Link>
          </div>
          <ul className='nav' id='side-menu'>
            <li>
              <Link to='/' >
              <i className='fa fa-fw fa-home'></i><span>Home</span>
              </Link>
            </li>
          </ul>
          <div id='lateral-menu'>
            LATERAL MENU
          </div>
        </div>
        <div id='main-content'>
          <div className='container-fluid'>
            <div className='row' id='top'>
              <div className='col-lg-12'>
                <ExplorerHeader api={{ apiName: 'Sample API', apiVersion: '1.0.0', productVersion: 'asdasd12' }} />
                {this.props.children}
                <div>FOOTER</div>
                  Copyright &copy; API Explorer 2015
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Application.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  addTodo: PropTypes.func.isRequired,
  children: PropTypes.element
}

export default connect(
  state => ({ todos: state.todos }),
  dispatch => ({
    addTodo: (...args) => dispatch(TodoActions.addTodo(...args)),
    actions: bindActionCreators(TodoActions, dispatch)
  })
)(Application)
