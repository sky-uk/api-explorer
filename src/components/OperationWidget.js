import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import { Link } from 'react-router'

class OperationWidget extends Component {
  render () {
    if (this.props.operation === null) {
      return <div>No operation was found.</div>
    }

    const httpMethod = this.props.operation.spec.httpMethod
    const panelCx = cx('documentation-widget panel panel-default', {
      'panel-primary': httpMethod === 'get',
      'panel-green': httpMethod === 'post',
      'panel-red': httpMethod === 'delete',
      'panel-yellow': httpMethod === 'put'
    })
    return (
      <div className={panelCx} >
        <div className='panel-heading' id='POST-v2-user-session-skyid-ac' >
          <small className='pull-right doc-w-nickname' title='Logins the user with sky id ac token' >Logins the user with sky id ac token
          </small>
          <strong >{this.props.operation.spec.httpMethod.toUpperCase()}
          </strong>
          <span >&nbsp;
          </span>
          <samp >{this.props.operation.spec.url}
          </samp>
          <span className='doc-w-secured' >
          </span>
        </div>
        <div className='panel-body' >
          <ul className='nav nav-tabs' >
            {APIExplorer.widgetTabs.map(widgetTab => {
              const url = `/operation/${ this.props.operation.id}/${widgetTab.slug}`
              return (<li key={widgetTab.slug} className={this.props.history.isActive(url) ? 'active' : ''}>
                <Link to={`/operation/${this.props.operation.id}/${widgetTab.slug}`} className='operation-container' >{widgetTab.name}</Link>
              </li>)
            })}
          </ul>
          {this.props.children}
        </div>
      </div>
    )
  }
}

OperationWidget.propTypes = {
  children: PropTypes.element,
  operation: PropTypes.object,
  history: PropTypes.element
}

export default connect(
  state => {
    const operation = state.operations.filter(op => op.get('id') === state.router.params.id).first()
    return {
      operation: operation.size > 0 ? operation.toJS() : null
    }
  }
)(OperationWidget)
