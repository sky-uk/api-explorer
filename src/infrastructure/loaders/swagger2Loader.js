export default function swagger2Loader (config, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError }) {
  onLoadProgress(`Loading API Spec from ${config.props.url}`)

  fetch(config.props.url)
    .then(response => response.json())
    .then(apiSpec => {
      onLoadProgress(`API Spec received with success`)
      onLoadProgress(`Starting API parsing`)
      onNewAPI(apiSpec)

      const apiname = config.friendlyName
      Object.keys(apiSpec.paths)
            .forEach(url => {
              Object.keys(apiSpec.paths[url])
                    .forEach(httpMethod => {
                      const operation = apiSpec.paths[url][httpMethod]
                      const urlClean = url.replace(/^\//g, '')
                                          .replace(/\//g, '-')
                                          .replace(/\{|\}/g, '_')
                      const id = `${apiname}-${httpMethod}-${urlClean}`
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
    })
}
