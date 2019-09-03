import React from 'react'
import { render } from 'react-dom'

import Root from './containers/Root'
import URI from 'urijs'

import { load as loadSpec, apiConfigurations, headers, customizableHeaders, originalCustomizableHeaders } from './actions/loadActionCreators'
import * as Loaders from './infrastructure/loaders'
import widgetWrapper from './infrastructure/WidgetWrapper'
import { Url } from './infrastructure/core'

import { TryOutWidgetTab, SpecWidgetTab, ResponseSchemaWidgetTab } from './components'

import settingsPaneWrapper from './infrastructure/SettingsPaneWrapper'
import { GeneralSettings, ManageHeadersSettings } from './components/settings'

import APIExplorerPluginConfigurator from './APIExplorerPluginConfigurator'
import APIExplorerAPIConfigurator from './APIExplorerAPIConfigurator'
import LinkGenerator from './LinkGenerator'

import configureStore, { history } from './store/configureStore'

// editor imports
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

import 'codemirror/addon/display/fullscreen'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'
import 'codemirror/addon/mode/overlay'
import 'codemirror/addon/display/fullscreen.css'

import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/comment-fold'

import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
// end editor imports

class APIExplorer {
  constructor () {
    this.SupportedLoaders = {
      Swagger1Loader: 'Swagger1Loader',
      Swagger2Loader: 'Swagger2Loader',
      OpenAPI3Loader: 'OpenAPI3Loader'
    }

    this.LoaderFriendlyNames = {
      'swagger1': this.SupportedLoaders.Swagger1Loader,
      'swagger2': this.SupportedLoaders.Swagger2Loader,
      'openapi3': this.SupportedLoaders.OpenAPI3Loader
    }

    this.Loaders = {
      [this.SupportedLoaders.Swagger1Loader]: Loaders.Swagger1Loader,
      [this.SupportedLoaders.Swagger2Loader]: Loaders.Swagger2Loader,
      [this.SupportedLoaders.OpenAPI3Loader]: Loaders.OpenAPI3Loader
    }

    this.apiConfigurations = [] // This will store all the configured API in APIExplorer
    this.widgetTabs = [] // This will store all the api operations configured for ApiExplorer
    this.settingsPanes = [] // This will hold all the settings components
    this.headers = [] // This will store all the headers needed
    this.customizableHeaders = []
    this.originalCustomizableHeaders = []
    this.plugins = [] // This will store all the plugins needed
    this.queryStringLoadEnabled = true
    this.HttpClientConfigurator = c => {}

    this.addWidgetTab('Try It', TryOutWidgetTab)
    this.addWidgetTab('Spec', SpecWidgetTab)
    this.addWidgetTab('Response Schema', ResponseSchemaWidgetTab)

    this.addSettingsPane('General', GeneralSettings)
    this.addSettingsPane('Manage Headers', ManageHeadersSettings)

    this.LinkGenerator = new LinkGenerator(this)

    this.basePath = ''

    // this could eventually be overriden by the global configuration, we just need a DSL
    this.editor = { type: 'CodeMirror', options: {} }
    this.editor.options = {
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      lineWrapping: true,
      foldGutter: true,
      theme: 'material',
      extraKeys: {
        // Fullscreen
        'F11': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
        'Ctrl-M': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
        'Cmd-M': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
        'Esc': cm => cm.getOption('fullScreen') && cm.setOption('fullScreen', false),
        // Code Folding
        'Ctrl-Y': cm => cm.foldAll(),
        'Cmd-Y': cm => cm.foldAll(),
        'Ctrl-Alt-Y': cm => cm.unfoldAll(),
        'Shift-Ctrl-Y': cm => cm.unfoldAll(),
        'Cmd-Shift-Y': cm => cm.unFoldAll(),
        'Ctrl-U': cm => cm.foldCode(cm.getCursor()),
        'Cmd-U': cm => cm.foldCode(cm.getCursor())
      }
    }
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
   * Adds a new Customizable Header Header
   * @param {[type]} name  Name of the Header
   * @param {[type]} values An array of objects that represents the header value (value/description)
   * @return {APIExplorer} the APIExplorer instance
   */
  addCustomizableHeader (name, values) {
    const header = { name, values }
    this.customizableHeaders.push(header)
    const originalHeader = JSON.parse(JSON.stringify(header))
    this.originalCustomizableHeaders.push(originalHeader)
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
    const store = configureStore()

    store.dispatch(apiConfigurations(this.apiConfigurations))
    store.dispatch(headers(this.headers))
    store.dispatch(originalCustomizableHeaders(this.originalCustomizableHeaders))
    store.dispatch(customizableHeaders(this.customizableHeaders))

    render(<Root store={store} history={history} />, document.getElementById(domAnchor))

    // give some time so that the css loads properly.
    // this can be improved by waiting for a dom load event.
    setTimeout(() => {
      // Dispatch actions to load configurations
      for (const config of this.apiConfigurations) {
        store.dispatch(loadSpec(config))
      }
    }, 1000)

    return this
  }
}

const explorer = new APIExplorer()
export default explorer
window.APIExplorer = explorer
