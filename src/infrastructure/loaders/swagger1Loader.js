import Enumerable from 'linq'
import { swagger2JsonLoader } from './swagger2Loader'

require('swagger-converter')

function executeFetch (req, callback) {
  fetch(req.url)
    .then(response => response.json())
    .then(apiSpec => callback(null, {path: req.path, result: apiSpec}))
}

export default function swagger1Loader (config, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError }) {
  onLoadProgress(`Loading API Swagger 1.0 Spec from ${config.url.getUrl()}`)

  const async = require('async')
  fetch(config.url.getUrl())
    .then(response => response.json())
    .then(apiSpec => {
      const apis = Enumerable
                      .from(apiSpec.apis)
                      .select(api => {
                        return { path: api.path, url: config.url.resolveChildUrl(`${apiSpec.basePath}${api.path}`) }
                      })
                      .toArray()
      async.map(apis, executeFetch, (err, result) => {
        if (err) throw err
        let apiDeclarations = {}
        result.forEach(element => apiDeclarations [element.path] = element.result)
        const swagger2Document = SwaggerConverter.convert(apiSpec, apiDeclarations)
        swagger2JsonLoader(swagger2Document, config.friendlyName, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError })
      })
    })
}
