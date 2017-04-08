import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import { selectedOperation } from '../actions/loadActionCreators'
import Styled from 'styled-components'

function HTTPMethod ({ method = '' }) {
  return <strong>{method.toUpperCase()}</strong>
}

class OperationWidget extends Component {

  componentDidMount () {
    this.props.dispatch(selectedOperation(this.props.operation.id))
  }

  componentDidUpdate (prevProps) {
    if (this.props.operation.id !== prevProps.operation.id) {
      this.props.dispatch(selectedOperation(this.props.operation.id))
    }
  }

  render () {
    if (this.props.operation === null) {
      return <div>No operation was found.</div>
    }

    const httpMethod = this.props.operation.spec.httpMethod
    const panelCx = cx(`documentation-widget panel panel-default panel-http-method panel-http-method-${httpMethod}`, {
      'panel-deprecated': this.props.operation.spec.deprecated
    })
    const hasSecurity = this.props.operation.spec.security !== undefined
    return (
      <div className={panelCx} >
        <div className='panel-heading' id={this.props.operation.id}>
          <div className='pull-right'>
            {(this.props.operation.spec.tags || []).map((tag, i) => <span key={i}><span key={tag} className='badge'>{tag}</span>&nbsp;</span>)}
          </div>
          <HTTPMethod method={this.props.operation.spec.httpMethod} />
          &nbsp;<samp>{this.props.operation.spec.url}</samp>&nbsp;
          { hasSecurity && (<span style={{width: '1em', display: 'inline-block', opacity: '0.5', color: 'Yellow'}}><i className='fa fa-lock' title='Secured' /></span>) }
          { this.props.config.useProxy && <i className='fa fa-globe' title='Using Proxy' />}
          &nbsp; { this.props.operation.spec.deprecated && <span className='badge'>deprecated</span>}
          <div><small style={{marginLeft: '1ch', opacity: 0.7}}>{this.props.operation.spec.summary}</small></div>
        </div>
        <div className='panel-body' >
          <ul className='nav nav-tabs'>
            {APIExplorer.widgetTabs.map((widgetTab, i) => {
              const url = APIExplorer.LinkGenerator.toTabOperation(this.props.operation, widgetTab)
              const routePath = `${this.props.match.path}/${widgetTab.slug}`
              return <Route key={widgetTab.slug} path={routePath} children={({ match }) => (
                <li key={i} className={match ? 'active' : ''}>
                  <Link key={i} to={url} className='operation-container' >{widgetTab.name}</Link>
                </li>)} />
              })}
          </ul>
          <Switch>
            {APIExplorer.widgetTabs.map(widgetTab => {
              const routePath = `${this.props.match.path}/${widgetTab.slug}`
              return <Route key={widgetTab.slug} path={routePath} component={widgetTab.component} />
            })}
          </Switch>
        </div>
      </div>
    )
  }
}

OperationWidget.propTypes = {
  children: PropTypes.element,
  dispatch: PropTypes.func.isRequired,
  operation: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired
}

export default OperationWidget

const HTTPMethodx = Styled(HTTPMethod)`
  color: red;
`
