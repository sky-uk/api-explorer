import React from 'react'
import { render } from 'react-dom'

import Root from './containers/Root'
import URI from 'urijs'

import { load as loadSpec, apiConfigurations, headers } from './actions/loadActionCreators'
import * as Loaders from './infrastructure/loaders'
import widgetWrapper from './infrastructure/WidgetWrapper'
import { Url } from 'apiexplorer-core'

import { TryOutWidgetTab, SpecWidgetTab, ResponseSchemaWidgetTab } from './components'

import settingsPaneWrapper from './infrastructure/SettingsPaneWrapper'
import { GeneralSettings, CustomHeadersSettings } from './components/settings'

import APIExplorerPluginConfigurator from './APIExplorerPluginConfigurator'
import APIExplorerAPIConfigurator from './APIExplorerAPIConfigurator'
import LinkGenerator from './LinkGenerator'

class APIExplorer {
  constructor () {
    this.SupportedLoaders = {
      Swagger1Loader: 'Swagger1Loader',
      Swagger2Loader: 'Swagger2Loader'
    }

    this.LoaderFriendlyNames = {
      'swagger1': this.SupportedLoaders.Swagger1Loader,
      'swagger2': this.SupportedLoaders.Swagger2Loader
    }

    this.Loaders = {
      [this.SupportedLoaders.Swagger1Loader]: Loaders.Swagger1Loader,
      [this.SupportedLoaders.Swagger2Loader]: Loaders.Swagger2Loader
    }

    this.apiConfigurations = [] // This will store all the configured API in APIExplorer
    this.widgetTabs = [] // This will store all the api operations configured for ApiExplorer
    this.settingsPanes = [] // This will hold all the settings components
    this.headers = [] // This will store all the headers needed
    this.plugins = [] // This will store all the plugins needed
    this.queryStringLoadEnabled = true
    this.HttpClientConfigurator = c => {}

    this.addWidgetTab('Try It', TryOutWidgetTab)
    this.addWidgetTab('Spec', SpecWidgetTab)
    this.addWidgetTab('Response Schema', ResponseSchemaWidgetTab)

    this.addSettingsPane('General', GeneralSettings)
    this.addSettingsPane('Custom Headers', CustomHeadersSettings)

    this.LinkGenerator = new LinkGenerator(this)

    this.basePath = ''
  }

  /**
   * Method of the fluent API used to configure APIExplorer with API Specifications
   * @param  {[function]} configurator    A function used to configure API Explorer
   * @return {[APIExplorer]}              APIExplorer instance to provide a fluent interface
   */
  addAPI (friendlyName, specFormat, url, configuratorFunc) {
    let loaderType = this.getLoaderTypeBySpecFormat(specFormat)
    const loader = this.Loaders[loaderType]

    const slug = friendlyName.replace(/([^a-zA-Z0-9]+)/g, '-').toLowerCase()

    const conf = new APIExplorerAPIConfigurator(friendlyName, loaderType, loader, slug, new Url(url + window.location.search), this)

    configuratorFunc && configuratorFunc(conf)
    this.apiConfigurations.push(conf)
    return this
  }

  getAPI (name) {
    let config = this.apiConfigurations.find(config => {
      return config.friendlyName === name
    })

    return config
  }

  /**
   * Adds a new Header
   * @param {[type]} name  Name of the Header
   * @param {[type]} value Value of the Header
   * @return {APIExplorer} the APIExplorer instance
   */
  addHeader (name, value) {
    this.headers.push({ name, value })
    return this
  }

  /**
   * Method of the fluent API used to configure APIExplorer plugins
   * @param  {[object]} pluginSpec    An object describing the plugin
   * @return {[APIExplorer]}          APIExplorer instance to provide a fluent interface
   */
  addPlugin (pluginSpec) {
    const configurator = new APIExplorerPluginConfigurator(this)
    configurator.addPlugin(pluginSpec)
    return this
  }

  /**
   * Adds a new Settings Pane
   * @param {[type]} name      friendly name of the Settings pane
   * @param {[type]} component Object that represents the component do add to the settings pane
   * @return {APIExplorer} the APIExplorer instance
   */
  addSettingsPane (name, component) {
    const slug = name.replace(/([^a-zA-Z0-9]+)/g, '-').toLowerCase()
    this.settingsPanes.push({ name, component: settingsPaneWrapper(component), slug: slug })
    return this
  }

  /**
   * Adds a new Widget
   * @param {[type]} name      friendly name of the Widget (to appear in the wodgets tab)
   * @param {[type]} component Object that represents the component do add to the widgets tab
   * @return {APIExplorer} the APIExplorer instance
   */
  addWidgetTab (name, component) {
    const slug = name.replace(/([^a-zA-Z0-9]+)/g, '-').toLowerCase()
    this.widgetTabs.push({ name, component: widgetWrapper(component), slug: slug })
    return this
  }

  /**
   * Configure global CORS settings
   * @param {object} config      The current HTTP Client Configuration
   * @return {APIExplorer} the APIExplorer instance
   */
  configCORS (config) {
    this.configHttpClient(c => {
      c.credentials = config.credentials
    })

    return this
  }

  configHttpClient (configurator) {
    let currentConfigurator = this.HttpClientConfigurator

    this.HttpClientConfigurator = c => {
      currentConfigurator(c)
      configurator(c)
    }

    return this
  }

  /**
   * Setter method to set API basePath
   * @param  {String} basePath to set as API basePath
   * @return {APIExplorer} the APIExplorer instance
   */
  setBasePath (basePath) {
    this.basePath = basePath
    return this
  }

  /**
   * Getter method to retrieve API basePath
   * @return {String} API basePath
   */
  getBasePath () {
    return this.basePath
  }

  /**
   * Method used to append API base path to relative links.
   * If *what* starts with '/' (forward slash), '/' is removed.
   *
   * Will append the API base path to the beginning of whatever url passed into *what*, while ensuring this url is normalized.
   * @param  {String} what to append to the end of API base path
   * @return {String} API basePath appended to *what* and normalized
   */
  buildAppLink (what) {
    const appendTo = what.startsWith('/') ? what.substring(1) : what
    const concatenatedUrl = `${this.basePath}/${appendTo}`
    return new URI(concatenatedUrl)
      .normalizePath()
      .toString()
  }

  getLoaderTypeBySpecFormat (specFormat) {
    let loaderType = this.LoaderFriendlyNames[specFormat]

    if (!loaderType) {
      console.warn(
        'Unsupported API specification format: ' + specFormat,
        'Available formats:', Object.keys(this.LoaderFriendlyNames)
      )

      throw Error('Unsupported API specification format: ' + specFormat)
    }

    return loaderType
  }

  /**
   * Method of the fluent API used to start APIExplorer.
   * Will dispach actions to process the configurations, and render the UI
   * @param  {String} domAnchor   Alternative DOM anchor point if 'root' cannot be used
   * @return {APIExplorer}        APIExplorer instance to provide a fluent interface
   */
  start (domAnchor = 'root') {
    const configureStore = require('./store/configureStore')
    const store = configureStore.default()
    store.dispatch(apiConfigurations(this.apiConfigurations))

    // Dispatch actions to load configurations
    for (const config of this.apiConfigurations) {
      store.dispatch(loadSpec(config))
    }

    store.dispatch(headers(this.headers))

    render(<Root store={store} />, document.getElementById(domAnchor))
    return this
  }
}

const explorer = new APIExplorer()
export default explorer
window.APIExplorer = explorer
