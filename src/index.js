import 'babel-core/polyfill'
import React from 'react'
import { render } from 'react-dom'
import Root from 'containers/Root'
import { load as loadSpec, apiConfigurations, headers } from 'actions/loadActionCreators'
import * as Loaders from 'infrastructure/loaders'
import widgetWrapper from 'infrastructure/WidgetWrapper'
import Url from 'infrastructure/Url'

import { TryOutWidgetTab, SpecWidgetTab, ResponseSchemaWidgetTab } from 'components'

import settingsPaneWrapper from 'infrastructure/SettingsPaneWrapper'
import { GeneralSettings, CustomHeadersSettings } from 'components/settings'

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

    this.Loaders = {}
    this.Loaders[this.SupportedLoaders.Swagger1Loader] = Loaders.Swagger1Loader
    this.Loaders[this.SupportedLoaders.Swagger2Loader] = Loaders.Swagger2Loader

    this.apiConfigurations = [] // This will store all the configured API in APIExplorer
    this.widgetTabs = [] // This will store all the api operations configured for ApiExplorer
    this.settingsPanes = [] // This will hold all the settings components
    this.headers = [] // This will store all the headers needed
    this.queryStringLoadEnabled = false
    this.HttpClientConfigurator = c => {}

    this.addWidgetTab('Try It', TryOutWidgetTab)
    this.addWidgetTab('Spec', SpecWidgetTab)
    this.addWidgetTab('Response Schema', ResponseSchemaWidgetTab)

    this.addSettingsPane('General', GeneralSettings)
    this.addSettingsPane('Custom Headers', CustomHeadersSettings)

    this.LinkGenerator = new LinkGenerator()
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
    const conf = new APIExplorerAPIConfigurator(friendlyName, loaderType, loader, slug, new Url(url), this)

    configuratorFunc(conf)
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
   */
  addHeader (name, value) {
    this.headers.push({ name, value })
    return this
  }

  /*
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
   */
  addWidgetTab (name, component) {
    const slug = name.replace(/([^a-zA-Z0-9]+)/g, '-').toLowerCase()
    this.widgetTabs.push({ name, component: widgetWrapper(component), slug: slug })
    return this
  }

  /**
   * Configure global CORS settings
   * @param {object} config      The current HTTP Client Configuration
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
   * Enables the API configuration through QueryString parameters 'swaggerSpec', 'swaggerLoader' and 'swaggerUseProxy'
   *  - swaggerSpec is the URL for a swagger specification
   *  - swaggerLoader is the loaded to use for the given specification (Swagger1Loader or Swagger2Loader)
   *  - swaggerUseProxy indicate if we should proxy calls (because CORS) - it is actived with value 'on'
   * @param  {String} friendlyName [description]
   * @return {[type]}              [description]
   */
  enableQueryStringConfig (friendlyName = 'url') {
    const queryString = { }
    document.location.search.substr(1)
          .split('&')
          .map(_ => _.split('='))
          .forEach(a => { queryString[decodeURIComponent(a[0]).replace('[]', '')] = decodeURIComponent(a[1]) })

    // If a specification exists in the query string
    if (queryString.hasOwnProperty('swaggerSpec')) {
      const specLoader = queryString.swaggerLoader || 'Swagger2Loader'
      const swaggerUseProxy = queryString.swaggerUseProxy === 'on'
      this.addConfiguration(
        friendlyName,
        specLoader,
        new Url(queryString.swaggerSpec).setProxy(swaggerUseProxy)
      )
    }

    return this
  }

  /**
   * Method of the fluent API used to start APIExplorer.
   * Will dispach actions to process the configurations, and render the UI
   * @param  {String} domAnchor   Alternative DOM anchor point if 'root' cannot be used
   * @return {[APIExplorer]}      APIExplorer instance to provide a fluent interface
   */
  start (domAnchor = 'root') {
    const configureStore = require('store/configureStore')
    const store = configureStore()

    store.dispatch(apiConfigurations(this.apiConfigurations))

    // Dispatch actions to load configurations
    for (const config of this.apiConfigurations) {
      store.dispatch(loadSpec(config))
    }

    store.dispatch(headers(this.headers))

    // Render UI
    render(<Root store={store} />, document.getElementById(domAnchor))
    return this
  }

  getLoaderTypeBySpecFormat (specFormat) {
    let loaderType = this.LoaderFriendlyNames[specFormat]

    if (!loaderType) {
      console.warn('Unsupported API specification format: ' + specFormat,
                   'Available formats:', Object.keys(this.LoaderFriendlyNames))

      throw Error('Unsupported API specification format: ' + specFormat)
    }

    return loaderType
  }
}

const explorer = new APIExplorer()
module.exports = window.APIExplorer = explorer
