import React, { Component, PropTypes } from 'react'
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
        <div className='panel-heading' id={this.props.operation.id}>
          <div className='pull-right'>
            {(this.props.operation.spec.tags || []).map((tag, i) => <span key={i}><span key={tag} className='badge'>{tag}</span>&nbsp;</span>)}
          </div>
          <strong >{this.props.operation.spec.httpMethod.toUpperCase()}</strong>
          <span >&nbsp;</span>
          <samp >{this.props.operation.spec.url}</samp>
          <span className='doc-w-secured' ></span>
          { this.props.config.useProxy && <i className='fa fa-globe' title='Using Proxy'></i>}
        </div>
        <div className='panel-body' >
          <ul className='nav nav-tabs' >
            {APIExplorer.widgetTabs.map((widgetTab, i) => {
              const url = `/operation/${ this.props.operation.id}/${widgetTab.slug}`
              return (<li key={i} className={this.props.history.isActive(url) ? 'active' : ''}>
                <Link key={i} to={`/operation/${this.props.operation.id}/${widgetTab.slug}`} className='operation-container' >{widgetTab.name}</Link>
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
  history: PropTypes.object,
  config: PropTypes.object
}

export default OperationWidget
