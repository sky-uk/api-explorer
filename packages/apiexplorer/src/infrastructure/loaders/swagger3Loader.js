import URI from 'urijs'
import SwaggerParser from 'swagger-parser'

export function swagger3Loader (config, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError }) {
  const url = config.url.getUrl()
  onLoadProgress(`Loading API Spec from ${url}`)



  SwaggerParser.validate(url, function(err, api) {
    if (err) {
      console.error(err);
    }
    else {
      console.log("API name: %s, Version: %s", api.info.title, api.info.version);
    }
  });
  

  return fetch(url, { credentials: 'include' })
    .then(response => response.json())
    .then(apiSpec => {
      let newApiSpec =  apiSpec
      let defaultHost = new URI(config.url.url).host()

      newApiSpec = config.interceptor({ friendlyName: config.friendlyName, url: config.url }, apiSpec)

      swagger3JsonLoader(newApiSpec, config.friendlyName, config.slug, defaultHost, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError })
    })
}

export function swagger3JsonLoader (apiSpec, friendlyName, slug, defaultHost, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError }) {
  onLoadProgress(`API Spec received with success`)
  onLoadProgress(`Starting API parsing`)

  // defaults
  apiSpec = Object.assign({
    definitions: [],
    basePath: '/',
    host: defaultHost
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

  Object.keys(apiSpec.definitions)
    .forEach(definitionName => {
      const definition = apiSpec.components.schemas[definitionName]
      const id = `${slug}-${definitionName.toLocaleLowerCase()}`
      const definitionSpec = {key: `#/definitions/${definitionName}`, name: `${definitionName}`, definition}
      onLoadProgress(`Processing definition ${id}`)
      onNewDefinition(definitionSpec)
    })

  onLoadProgress(`Loading completed`)
  onLoadCompleted(apiSpec)
}
