import './BaseStyles.css'
import './Application.css'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { ExplorerHeader, ApplicationLoading, LateralMenu } from 'components'

class Application extends Component {
  render () {
    const loaded = this.props.loader.get('loaded')
    return loaded ? this.renderApplication() : this.renderLoadingScreen()
  }

  renderLoadingScreen () {
    const { currentStep, progress } = this.props.loader.toJS()
    return (
      <ApplicationLoading currentStep={currentStep} progressMessages={progress} />
    )
  }

  renderApplication () {
    const api = this.props.apis.get('byName').toJSON()['petshop']
    const { title, description, version } = api.info
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
          <LateralMenu operations={this.props.operations.toJS()} />
        </div>
        <div id='main-content'>
          <div className='container-fluid'>
            <div className='row' id='top'>
              <div className='col-lg-12'>
                <ExplorerHeader api={{ apiName: title, apiVersion: version, productVersion: version }} />
                <p>{ description }</p>

                {this.props.children}

                <div id='fixed-footer'>
                  Copyright &copy; API Explorer 2015
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Application.propTypes = {
  children: PropTypes.element
}

export default connect(
  state => {
    return {
      loader: state.loader,
      apis: state.apis,
      operations: state.operations
    }
  }
)(Application)
