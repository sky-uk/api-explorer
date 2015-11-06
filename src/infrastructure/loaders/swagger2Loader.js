export default function swagger2Loader (config, { onLoadProgress, onNewAPI, onNewOperation, onLoadCompleted, onLoadError }) {
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
                    .filter(key => key !== 'parameters')
                    .forEach(httpMethod => {
                      const operation = apiSpec.paths[url][httpMethod]
                      const urlClean = url.replace(/\//g, '-').replace(/\{|\}/g, '_')
                      const id = `${apiname}-${httpMethod}-${urlClean}`
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
    })
}
