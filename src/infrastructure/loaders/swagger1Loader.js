import Enumerable from 'linq'
import { swagger2JsonLoader } from './swagger2Loader'
import SwaggerConverter from 'swagger-converter'

// hack to suport default values
function setDefaultValues (apiSpec) {
  apiSpec.apis.forEach(api => {
    api.operations.forEach(operation => {
      operation.parameters.forEach(parameter => {
        if (parameter.defaultValue) {
          const value = parameter.defaultValue
          delete parameter.defaultValue
          parameter['x-defaultValue'] = value
        }
      })
    })
  })
  return apiSpec
}

function executeFetch (req, callback) {
  req.onLoadProgress(`Starting getting new api path from '${req.url}'`)
  fetch(req.url)
    .then(response => response.json())
    .then(apiSpec => {
      const changedApiSpec = setDefaultValues(apiSpec)
      req.onLoadProgress(`New api definition from path '${decodeURIComponent(req.url)}' completed`)
      callback(null, {path: req.path, result: changedApiSpec})
    }).catch(ex => callback(`Error loading url ${req.url}: ${ex}`))
}

export default function swagger1Loader (config, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError }) {
  const url = config.url.getUrl()
  onLoadProgress(`Loading API Swagger 1.0 Spec from ${url}`)

  const async = require('async')
  fetch(url)
    .then(response => response.json())
    .then(apiSpec => {
      onLoadProgress(`Loading content from '${url}' completed`)
      const apis = Enumerable
                      .from(apiSpec.apis)
                      .select(api => {
                        return { path: api.path, url: config.url.resolveChildUrl(`${apiSpec.basePath}${api.path}`), onLoadProgress: onLoadProgress }
                      })
                      .toArray()
      async.map(apis, executeFetch, (err, result) => {
        if (err) {
          onLoadError(`Error loading Swagger 1.x apis: ${err}`)
        } else {
          onLoadProgress(`Loading of Swagger spec 1.x completed.`)

          let apiDeclarations = {}
          result.forEach(element => apiDeclarations [element.path] = element.result)

          onLoadProgress('Started to convert Swagger 1.x to Swagger 2.0....')
          const swagger2Document = SwaggerConverter.convert(apiSpec, apiDeclarations)
          onLoadProgress('Convertion from Swagger 1.x to Swagger 2.0 completed!')
          swagger2Document.info.title = swagger2Document.info.title === 'Title was not specified' ? 'API' : swagger2Document.info.title
          swagger2JsonLoader(swagger2Document, config.friendlyName, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError })
        }
      })
    })
}
