import URI from 'urijs'

export function swagger2Loader (config, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError }) {
  const url = config.url.getUrl()
  onLoadProgress(`Loading API Spec from ${url}`)

  fetch(url)
    .then(response => response.json())
    .then(apiSpec => {
      let newApiSpec = apiSpec
      let defaultHost = new URI(url).host()

      if (config.interceptor) {
        newApiSpec = config.interceptor({ friendlyName: config.friendlyName, url: config.url }, apiSpec)
      }

      swagger2JsonLoader(newApiSpec, config.friendlyName, defaultHost, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError })
    })
}

export function swagger2JsonLoader (apiSpec, friendlyName, defaultHost, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError }) {
  onLoadProgress(`API Spec received with success`)
  onLoadProgress(`Starting API parsing`)
  onNewAPI(apiSpec)
  const apiname = friendlyName

  // defaults
  apiSpec = Object.assign({
    definitions: [],
    basePath: '',
    host: defaultHost
  }, apiSpec)

  Object.keys(apiSpec.paths)
        .forEach(url => {
          Object.keys(apiSpec.paths[url])
                .filter(key => key !== 'parameters')
                .forEach(httpMethod => {
                  const operation = apiSpec.paths[url][httpMethod]
                  const urlClean = url.replace(/^\//g, '')
                                      .replace(/\//g, '-')
                                      .replace(/\{|\}/g, '_')
                  const id = `${apiname}-${httpMethod}-${urlClean}`
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
          const definition = apiSpec.definitions[definitionName]
          const id = `${apiname}-${definitionName.toLocaleLowerCase()}`
          const definitionSpec = {key: `#/definitions/${definitionName}`, name: `${definitionName}`, definition}
          onLoadProgress(`Processing definition ${id}`)
          onNewDefinition(definitionSpec)
        })

  onLoadProgress(`Loading completed`)
  onLoadCompleted(apiSpec)
}
