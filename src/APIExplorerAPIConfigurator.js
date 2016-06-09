export default class APIExplorerAPIConfigurator {
  constructor (friendlyName, loaderType, loader, slug, url, apiExplorer) {
    this.apiExplorer = apiExplorer

    this.friendlyName = friendlyName
    this.loaderType = loaderType
    this.loader = loader
    this.slug = slug
    this.url = url

    this.headers = []
    this.interceptors = []
    this.HttpClientConfigurator = c => {}
  }

  addHeader (name, value) {
    this.headers.push({ name, value })
    return this
  }

  addInterceptor (interceptor) {
    let currrentInterceptor = this.interceptors[this.loaderType]

    if (!currrentInterceptor) {
      currrentInterceptor = (config, apiSpec) => {}
    }

    this.interceptors[this.loaderType] = (config, apiSpec) => {
      currrentInterceptor(config, apiSpec)
      interceptor(config, apiSpec)
    }

    return this
  }

  configCORS (config) {
    this.HttpClientConfigurator(c => {
      c.credentials = config.credentials
    })
  }
}
