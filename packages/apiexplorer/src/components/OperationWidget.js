/* global APIExplorer */

import React, { Component } from 'react'
import cx from 'classnames'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import { selectedOperation } from '../actions/loadActionCreators'
import { Card, Label, Menu, Icon } from 'semantic-ui-react'
import Styled from 'styled-components'
import httpMethods from './HttpMethods'

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
    const { operation } = this.props
    if (this.props.operation === null) {
      return <div>No operation was found.</div>
    }

    const spec = operation.spec
    const className = cx('api-operation', `http-${spec.httpMethod.toLowerCase()}`, {
      'api-deprecated': spec.deprecated
    })

    const httpMethodInfo = httpMethods.values.find(v => v.value === spec.httpMethod.toUpperCase())

    return (
      <StyledWidget>
        <Card fluid className={className}>
          <Card.Content className='api-header'>
            <Card.Header>
              {(spec.tags || []).map((tag, i) => <Label color='black' size='small' className='right' key={i}>{tag}</Label>)}
              <strong className='api-http-method'>
                <abbr title={httpMethodInfo.details[0].description}>{spec.httpMethod.toUpperCase()}</abbr>
              </strong>
              <span>{spec.url}&nbsp;</span>
              {spec.security && <Icon name='lock' size='tiny' color='yellow' style={{ opacity: 1 }} circular inverted title='Secure' />}
              {this.props.config.useProxy && <Icon size='tiny' name='world' color='white' title='Using Proxy' circular inverted />}
              {spec.deprecated && <Label size='mini' color='black'>deprecated</Label>}
              <div><small style={{ opacity: 0.7 }}>{spec.summary}</small></div>
            </Card.Header>
          </Card.Content>
          <Card.Content className='api-tabs'>
            <Menu attached='top' tabular>
              {APIExplorer.widgetTabs.map((widgetTab, i) => {
                const url = APIExplorer.LinkGenerator.toTabOperation(this.props.operation, widgetTab)
                const routePath = `${this.props.match.path}/${widgetTab.slug}`
                return <Route key={widgetTab.slug} path={routePath} children={({ match }) => (
                  <Menu.Item key={i} active={match !== null} name='' as={Link} to={url} className='operation-container' >{widgetTab.name}</Menu.Item>
                  )} />
              })}
            </Menu>
            <Switch>
              {APIExplorer.widgetTabs.map(widgetTab => {
                const routePath = `${this.props.match.path}/${widgetTab.slug}`
                return (
                  <Route key={widgetTab.slug} path={routePath} component={widgetTab.component} />
                )
              })}
            </Switch>
          </Card.Content>
        </Card>
      </StyledWidget>
    )
  }
}

// OperationWidget.propTypes = {
//   children: PropTypes.element,
//   dispatch: PropTypes.func.isRequired,
//   operation: PropTypes.object.isRequired,
//   history: PropTypes.object.isRequired,
//   config: PropTypes.object.isRequired
// }

export default OperationWidget

const StyledWidget = Styled.div`
  .ui.card>.content>.header {
    color: white !important;
  }

  .card.api-operation .api-http-method {
    margin-right: 10px;
    font-weight: 900;
  }

  .card.api-operation .ui.label.right {
    float: right;
  }

  abbr[title] {
    text-decoration: none
  }

  ${httpMethodStylesCard('head',    '#5bc0de', '#9bd8eb')}
  ${httpMethodStylesCard('get',     '#428bca', '#7eb0db', '#fff')}
  ${httpMethodStylesCard('delete',  '#d9534f', '#e7908e')}
  ${httpMethodStylesCard('put',     '#EB961E', '#f1b764')}
  ${httpMethodStylesCard('patch',   '#F2C769', '#f8e1af')}
  ${httpMethodStylesCard('post',    '#5cb85c', '#91cf91')}
  ${httpMethodStylesCard('options', '#dddddd', '#f7f7f7', '#000')}
  ${httpMethodStylesCard('trace',   '#aaaaaa', '#d0d0d0', '#000')}
`

function httpMethodStylesCard (method, color, lightColor, textColor = '#fff') {
  return `
  .card.api-operation.http-${method}.api-deprecated .content.api-header {
    color: ${textColor},
    background: repeating-linear-gradient(
      45deg,
      ${color} 0px,
      ${color} 10px,
      ${lightColor} 10px,
      ${lightColor} 20px
    );
  }

  .card.api-operation.http-${method}                        { box-shadow: 0 1px 3px 0 ${color}, 0 0 0 1px ${color}; }
  .card.api-operation.http-${method} .content.api-header    {       background-color: ${color}; color: ${textColor}; }`
}
