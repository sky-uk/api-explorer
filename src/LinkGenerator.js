import URI from 'urijs'

export default class LinkGenerator {
  constructor (apiExplorer) {
    this.apiExplorer = apiExplorer
  }

  toOperation (operationSpec, params = {}) {
    const baseUri = `/operation/${operationSpec.id}/try-it`
    const queryParams = {}
    Object.keys(params).forEach(key => { queryParams[`param-${key}`] = params[key] })
    const newUrl = new URI(baseUri).query(queryParams).toString()
    return newUrl
  }
}
