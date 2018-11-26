/* global fetch */

import Enumerable from 'linq'
import { swagger2SpecLoader } from './swagger2Loader'
import SwaggerConverter from 'swagger-converter'
import URI from 'urijs'
import Converter from 'api-spec-converter/dist/api-spec-converter'

function executeInterceptor (config, apiSpec) {
  if (config.interceptor) {
    return config.interceptor({ friendlyName: config.friendlyName, url: config.url }, apiSpec)
  }
  return apiSpec
}

function executeFetch (req, callback) {
  req.onLoadProgress(`Starting getting new api path from '${req.url}'`)

  fetch(req.url, { credentials: 'include' })
    .then(response => response.json())
    .then(apiSpec => {
      req.onLoadProgress(`New api definition from path '${decodeURIComponent(req.url)}' completed`)
      callback(null, {path: req.path, result: executeInterceptor(req.config, apiSpec)})
    })
    .catch(ex => callback(new Error(`Error loading url ${req.url}: ${ex}`)))
}

export default function swagger1Loader (config, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError }) {
  const url = config.url.getUrl()
  onLoadProgress(`Loading API Swagger 1.0 Spec from ${url}`)

  const async = require('async')

  var conversor = Converter.convert({
    from: 'swagger_1',
    to: 'swagger_2',
    source: url,
  }, function(err, converted) {
    console.log(converted.stringify());
    // For yaml and/or OpenApi field order output replace above line
    // with an options object like below
    //   var  options = {syntax: 'yaml', order: 'openapi'}
    //   console.log(converted.stringify(options));
  })

  return fetch(url, { credentials: 'include' })
    .then(response => response.json())
    .then(apiSpec => {
      let newApiSpec = executeInterceptor(config, apiSpec)
      let defaultHost = new URI(config.url.url).host()

      onLoadProgress(`Loading content from '${url}' completed`)
      const apis = Enumerable
        .from(newApiSpec.apis)
        .select(api => {
          return { path: api.path, url: config.url.resolveChildUrl(`${apiSpec.basePath}${api.path}`), onLoadProgress: onLoadProgress, config }
        })
        .toArray()
      
      let apiDeclarations = {}
      apis.map(api => {
        apiDeclarations[api.path] = api.operation
      })
      
      onLoadProgress('Started to convert Swagger 1.x to Swagger 2.0....')
      const swagger2Document = SwaggerConverter.convert(apiSpec, apiDeclarations)
      onLoadProgress('Convertion from Swagger 1.x to Swagger 2.0 completed!')
      swagger2Document.info.title = swagger2Document.info.title === 'Title was not specified' ? 'API' : swagger2Document.info.title

      SwaggerParser.validate(swagger2Document)
        .then(function (api) {
          let newApi = api
          let defaultHost = window.location.origin
  
          newApi = config.interceptor({ friendlyName: config.friendlyName, url: config.url }, api)
          swagger2SpecLoader(newApi, config.friendlyName, config.slug, defaultHost, { onLoadProgress, onNewAPI, onNewOperation, onLoadCompleted, onLoadError })
        })
          .catch(function (err) {
            onLoadError(err)
        })

    })
}
