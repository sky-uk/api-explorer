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
        <Dock isVisible={this.state.dockIsVisible} onSizeChange={size => this.handleDockResize(size)} fluid={false} defaultSize={350} size={this.state.dockSize} dimMode='none' dockStyle={{ backgroundColor: '#263238' }} >
          <div style={{ textAlign: 'center', color: 'white', backgroundColor: '#11171A', padding: '10px', boxShadow: 'inset 0 -10px 10px -10px rgba(0,0,0,0.7)' }}>
            <Icon name='delete' size='large' style={{ position: 'absolute', top: '15px', right: '25px', color: 'rgba(255, 255, 255, 0.5)', 'cursor': 'pointer' }} onClick={this.handleCloseDock} />
            <h1 style={{ margin: 0 }}>API Explorer</h1>
          </div>
          <LateralMenu
            operations={this.props.operations.toJS()}
            apis={this.props.apis}
            selectedOperationId={this.props.selectedOperationId}
            dispatch={this.props.dispatch}
          />
          <br />
          <br />
          <br />
        </Dock>
        <div style={{ marginLeft: this.state.dockSize, padding: 10 }}>
          <div className='container-fluid'>
            {this.renderAPIExplorerOrSelectedAPI()}
            <Switch>
              <Route exact path={`${this.props.match.url}`} component={Welcome} />
              <Route path={`${this.joinUrl(this.props.match.url, 'operation/:id')}`} component={OperationWidgetContainer} />
              <Route path={`${this.joinUrl(this.props.match.url, 'settings/')}`} component={Settings} />
            </Switch>
          </div>
        </div>

        <div className='sidebar-footer'>
          <div style={{ width: '60%' }}>Copyright &copy; API Explorer 2015</div>
          <div style={{ width: '40%', textAlign: 'right' }}>v{packageVersion}</div>
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
  .sidebar-footer {
    font-family: Roboto, sans-serif;
    font-size: 0.8em;
    position: fixed;
    bottom: 0;
    width: 350px;
    z-index: 99999999;
    background-color: #11171A
    color: #fff;
    border-radius: 0
  }

  .sidebar-footer > div {
    display: inline-block;
    padding: 10px;
  }
`
