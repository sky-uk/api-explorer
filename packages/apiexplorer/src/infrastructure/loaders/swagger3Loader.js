import URI from 'urijs'
import SwaggerParser from 'swagger-parser'

export function swagger3Loader (config, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError }) {
  const url = config.url.getUrl()
  onLoadProgress(`Loading API Spec from ${url}`)

  return SwaggerParser.validate(url)
    .then(function(api) {
      let newApi = api
      let defaultHost = window.location.origin

      newApi = config.interceptor({ friendlyName: config.friendlyName, url: config.url }, api)
      swagger3JsonLoader(newApi, config.friendlyName, config.slug, defaultHost, { onLoadProgress, onNewAPI, onNewOperation, onLoadCompleted, onLoadError })
    })
    .catch(function(err){
      //some error handling
      console.error(err)
    })
}

export function swagger3JsonLoader (apiSpec, friendlyName, slug, defaultHost, { onLoadProgress, onNewAPI, onNewOperation, onLoadCompleted, onLoadError }) {
  onLoadProgress(`API Spec received with success`)
  onLoadProgress(`Starting API parsing`)

  // defaults
  apiSpec = Object.assign({
    definitions: [],
    basePath: '/',
    host: apiSpec.servers ? apiSpec.servers[0].url || defaultHost : defaultHost 
  }, apiSpec)

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
