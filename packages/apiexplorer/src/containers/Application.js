/* global APIExplorer */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dock from 'react-dock'
import marked from 'marked'

import { ExplorerHeader, ApplicationLoading, HowToConfigureAPIExplorer, LateralMenu } from '../components'
import { selectedOperation } from '../actions/loadActionCreators'

import { Switch, Route } from 'react-router-dom'
import Welcome from '../containers/Welcome'
import OperationWidgetContainer from '../containers/OperationWidgetContainer'
import Settings from '../containers/Settings'
import SpecViewer from '../containers/SpecViewer'
import { Icon } from 'semantic-ui-react'
import Styled from 'styled-components'
import packageJson from '../../package.json'

class Application extends Component {
  constructor () {
    super()
    this.state = { dockSize: 350, dockIsVisible: true }
  }

  render () {
    if (this.props.loader.get('totalApis') === 0) {
      return <HowToConfigureAPIExplorer />
    }
    const loaded = this.props.loader.get('loaded')
    const loadedApis = this.props.loader.get('loadedApis')

    return loaded && loadedApis > 0 ? this.renderApplication() : this.renderLoadingScreen()
  }

  renderLoadingScreen () {
    const { currentStep, progress } = this.props.loader.toJS()
    return (
      <ApplicationLoading currentStep={currentStep} progressMessages={progress} />
    )
  }

  handleDockResize (size) {
    this.setState({ dockSize: size, dockIsVisible: true })
  }

  handleCloseDock () {
    this.setState({ dockSize: 0, dockIsVisible: false })
  }

  joinUrl (base, path) {
    return base.charAt(base.length - 1) === '/'
      ? base + path
      : base + '/' + path
  }

  renderApplication () {
    let packageVersion = packageJson.version

    return (
      <StyledApplication id='content'>
        <Dock className='sidebar' isVisible={this.state.dockIsVisible} onSizeChange={size => this.handleDockResize(size)} fluid={false} defaultSize={350} size={this.state.dockSize} dimMode='none' dockStyle={{ backgroundColor: '#263238' }} >
          <div className='sidebar-header'>
            <Icon name='delete' size='large' onClick={_ => this.handleCloseDock()} />
            <small>{packageVersion}</small>
            <h1>API Explorer</h1>
          </div>

          <LateralMenu
            operations={this.props.operations.toJS()}
            apis={this.props.apis}
            selectedOperationId={this.props.selectedOperationId}
            dispatch={this.props.dispatch}
          />
        </Dock>
        <div style={{ marginLeft: this.state.dockSize, padding: 10 }}>
          <div className='container-fluid'>
            {this.renderAPIExplorerOrSelectedAPI()}
            <Switch>
              <Route exact path={`${this.props.match.url}`} component={Welcome} />
              <Route path={`${this.joinUrl(this.props.match.url, 'operation/:id')}`} component={OperationWidgetContainer} />
              <Route path={`${this.joinUrl(this.props.match.url, 'settings/')}`} component={Settings} />
              <Route path={`${this.joinUrl(this.props.match.url, 'viewspec/:apiSlug')}`} component={SpecViewer} />
            </Switch>
          </div>
        </div>
      </StyledApplication>
    )
  }

  onHomeClick () {
    this.props.dispatch(selectedOperation(''))
  }

  renderAPIExplorerOrSelectedAPI () {
    const selectedOperationId = this.props.selectedOperationId
    const selectedOperation = this.props.operations.filter(op => op.get('id') === selectedOperationId).first()

    if (!selectedOperation) {
      return ''
    }

    const api = this.props.apis.get('byName').get(selectedOperation.get('apiname'))
    const { title, version } = api.info
    return <ExplorerHeader api={{ apiName: title, apiVersion: version, productVersion: version }} />
  }

  renderMultipleAPIContent (apis) {
    const apisArray = this.props.apis.get('byOrder').map(a => this.props.apis.get('byName').get(a)).toArray()
    return (
      <div>
        {apisArray.map(api => this.renderSingleAPIContent(api))}
      </div>
    )
  }

  renderSingleAPIContent (api) {
    const { title, description, version } = api.info
    return (
      <div key={title}>
        <ExplorerHeader api={{ apiName: title, apiVersion: version, productVersion: version }} />
        <p dangerouslySetInnerHTML={this.getHtmlDescription(description)} />
      </div>
    )
  }

  getHtmlDescription (description) {
    return { __html: marked(description || '') }
  }
}

export default connect(
  state => {
    const selectedOperationId = state.uiState ? state.uiState.get('selectedOperationId') : ''
    return {
      loader: state.loader,
      apis: state.apis,
      operations: state.operations,
      selectedOperationId: selectedOperationId
    }
  }
)(Application)

const StyledApplication = Styled.div`
  & .sidebar-header {
    text-align: center;
    color: #fff;
    background-color: #11171A;
    padding: 10px;
    box-shadow: inset 0 -10px 10px -10px rgba(0,0,0,0.7);
  }

  & .sidebar-header h1 {
    margin: 0;
  }

  & .sidebar-header small {
    float: left;
    opacity: 0.5;
    margin: 8px 0 0 10px;
  }

  & .sidebar-header .delete.icon {
    float: right;
    margin: 8px 10px 0 0;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
  }
`
