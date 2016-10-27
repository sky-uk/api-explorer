import URI from 'urijs'

/**
 * Utility type to generate Links, both for API and for the API Explorer SPA app.
 */
export default class LinkGenerator {
  constructor (apiExplorer) {
    this.apiExplorer = apiExplorer
  }

  /**
   * Generate an API link for a given spec and with the specifyed parameters (params) in the query string
   * @param api            target API
   * @param operationSpec  operation for wich we want to generate the link
   * @param params         hash with parameters that we want to marshall into the query string
   *
   * @return String
   */
  makeHref (api, operationSpec, params) {
    const {host, basePath} = api
    const scheme = api.schemes[0]
    const path = operationSpec.url
    let href = `${scheme}://${host}${basePath}${path}`

    Object.keys(params).forEach(key => {
      const rex = new RegExp(`\{${key}\}`)
      if (rex.test(href)) {
        href = href.replace(rex, params[key])
        delete params[key]
      }
    })

    let uri = new URI(href).query(params)
    uri.normalizePath()

    return uri.toString()
  }

  /**
   * Generate a link to API Explorer home page
   *
   * @return String
   */
  toHome () {
    return this.apiExplorer.buildAppLink('')
  }

  /**
   * Generate a link to operation, marshaling the given parameters into the url (usefull for deep linking).
   * The link will be generated for the `try-it` tab.
   *
   * @param operationSpec spec we are targeting
   * @param params        optional hash with parameters to marshall into the link
   * @return String
   */
  toOperation (operationSpec, params = {}) {
    const operationUrl = `/operation/${operationSpec.id}/try-it`
    const baseUri = this.apiExplorer.buildAppLink(operationUrl)
    const queryParams = {}

    Object.keys(params).forEach(key => { queryParams[`param-${key}`] = params[key] })

    const newUrl = new URI(baseUri)
      .query(queryParams)
      .normalizePath()
      .toString()

    return newUrl
  }

  /**
   * Generate a link to a specific operation tag
   *
   * @param operationSpec spec we are targeting
   * @param tab           tab object we are targeting
   * @return String
   */
  toTabOperation (operationSpec, tab) {
    const tabUrl = `/operation/${operationSpec.id}/${tab.slug}`
    return this.apiExplorer.buildAppLink(tabUrl)
  }

  /**
   * Generate a link to the settings, optionally targeting a specific panel
   *
   * @return String
   */
  toSettings (paneSlug = '') {
    const settingsUrl = `/settings/${paneSlug}`
    return this.apiExplorer.buildAppLink(settingsUrl)
  }
}
