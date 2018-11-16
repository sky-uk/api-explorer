import SwaggerParser from 'swagger-parser'

export function swagger2Loader (config, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError }) {
  const url = config.url.getUrl()
  onLoadProgress(`Loading API Spec from ${url}`)

  return SwaggerParser.validate(url)
    .then(function (api) {
      let newApi = api
      let defaultHost = window.location.origin

      newApi = config.interceptor({ friendlyName: config.friendlyName, url: config.url }, api)
      swagger2JsonLoader(newApi, config.friendlyName, config.slug, defaultHost, { onLoadProgress, onNewAPI, onNewOperation, onLoadCompleted, onLoadError })
    })
    .catch(function (err) {
      onLoadError(err)
    })
}

export function swagger2JsonLoader (apiSpec, friendlyName, slug, defaultHost, { onLoadProgress, onNewAPI, onNewOperation, onLoadCompleted, onLoadError }) {
  onLoadProgress(`API Spec received with success`)
  onLoadProgress(`Starting API parsing`)

  // defaults
  apiSpec = Object.assign({
    definitions: [],
    basePath: '/'
  }, apiSpec)
  apiSpec.host = apiSpec.schemes[0] + '://' + apiSpec.host ||  defaultHost

  onNewAPI(apiSpec)

  Object.keys(apiSpec.paths)
    .forEach(url => {
      Object.keys(apiSpec.paths[url])
        .filter(key => key !== 'parameters')
        .forEach(httpMethod => {
          const operation = apiSpec.paths[url][httpMethod]
          const urlClean = url
            .replace(/^\//g, '')
            .replace(/\//g, '-')
            .replace(/\{|\}/g, '_')

          const id = `${slug}-${httpMethod}-${urlClean}`
          if (!operation.tags || operation.tags.length === 0) {
            operation.tags = ['']
          }
          const operationSpec = { id, url, httpMethod, ...operation }
          onLoadProgress(`Processing operation ${id}`)
          onNewOperation(operationSpec)
        })
    })

  onLoadProgress(`Loading completed`)
  onLoadCompleted(apiSpec)
}
