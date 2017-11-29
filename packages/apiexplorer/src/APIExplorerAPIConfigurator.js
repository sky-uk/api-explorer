export default class APIExplorerAPIConfigurator {
  constructor (friendlyName, loaderType, loader, slug, url, apiExplorer) {
    this.apiExplorer = apiExplorer

    this.friendlyName = friendlyName
    this.loaderType = loaderType
    this.loader = loader
    this.slug = slug
    this.url = url

    // Welcome page options
    this.welcome = {
      displaySummary: true,
      listOperations: false
    }

    this.headers = []
    this.interceptor = (config, apiSpec) => { return apiSpec }
    this.HttpClientConfigurator = c => {}
  }

  addHeader (name, value) {
    this.headers.push({ name, value })
    return this
  }

  addInterceptor (newInterceptor) {
    let currrentInterceptor = this.interceptor

    this.interceptor = (config, apiSpec) => {
      apiSpec = currrentInterceptor(config, apiSpec)
      return newInterceptor(config, apiSpec)
    }

    return this
  }

  useProxy (isProxied) {
    this.url.setProxy(isProxied)
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

  // Welcome page options ---

  displaySummaryAtWelcome (active) {
    this.welcome.displaySummary = active === undefined || active === true
    return this
  }
  listOperationsAtWelcome (active) {
    this.welcome.listOperations = active === undefined || active === true
    return this
  }


}
