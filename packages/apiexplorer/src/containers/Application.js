// import './BaseStyles.css'
// import './Application.css'
import './HttpMethods.css'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Dock from 'react-dock'
import marked from 'marked'

import { ExplorerHeader, ApplicationLoading, HowToConfigureAPIExplorer, LateralMenu, AppLogo } from '../components'
import { selectedOperation } from '../actions/loadActionCreators'

import { Switch, Route } from 'react-router'
import Welcome from '../containers/Welcome'
import OperationWidgetContainer from '../containers/OperationWidgetContainer'
import Settings from '../containers/Settings'
import { Menu, Icon, Input } from 'semantic-ui-react'

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
    return loaded ? this.renderApplication() : this.renderLoadingScreen()
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

  handleCloseDock = () => {
    this.setState({ dockSize: 0, dockIsVisible: false })
  }

  renderApplication () {
    return (
      <div id='content'>
        <Dock isVisible={this.state.dockIsVisible} onSizeChange={size => this.handleDockResize(size)} fluid={false} defaultSize={350} size={this.state.dockSize} dimMode='none' dockStyle={{backgroundColor: '#222'}} >
          <Icon name='delete' size='large' color='grey' style={{ float: 'right' }} onClick={this.handleCloseDock} />
          <div style={{ textAlign: 'center' }}><AppLogo /></div>
          <LateralMenu
            operations={this.props.operations.toJS()}
            apis={this.props.apis}
            selectedOperationId={this.props.selectedOperationId}
          />
        </Dock>
        <div style={{ marginLeft: this.state.dockSize, padding: 10 }}>
          <div className='container-fluid'>
            <div className='row' id='top'>
              <div className='col-lg-12'>
                {this.renderAPIExplorerOrSelectedAPI()}

                <Switch>
                  <Route exact path={`${this.props.match.url}`} component={Welcome} />
                  <Route path={`${this.props.match.url}operation/:id`} component={OperationWidgetContainer} />
                  <Route path={`${this.props.match.url}settings/`} component={Settings} />
                </Switch>

                <div id='fixed-footer'>
                  Copyright &copy; API Explorer 2015

                  <Link to={APIExplorer.LinkGenerator.toSettings()} className='pull-right'>
                    <i className='fa fa-cog fa-inverse' /> Settings
                  </Link>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  onHomeClick = () => {
    this.props.dispatch(selectedOperation(''))
  }

  renderAPIExplorerOrSelectedAPI () {
    const selectedOperationId = this.props.selectedOperationId
    const selectedOperation = this.props.operations.filter(op => op.get('id') === selectedOperationId).first()

    if (!selectedOperation) {
      return <h1>API Explorer</h1>
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

Application.propTypes = {
  children: PropTypes.element,
  loader: PropTypes.object,
  apis: PropTypes.object,
  operations: PropTypes.object,
  dispatch: PropTypes.func,
  selectedOperationId: PropTypes.string
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
