/* global fetch */

import { swagger2SpecLoader } from './swagger2Loader'
import SwaggerParser from 'swagger-parser'
import Converter from 'api-spec-converter/dist/api-spec-converter'

export default function swagger1Loader (config, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError }) {
  const url = config.url.getUrl()
  onLoadProgress(`Loading API Swagger 1.0 Spec from ${url}`)

  return Converter.convert({
    from: 'swagger_1',
    to: 'swagger_2',
    source: url
  }).then(function(converted) {
    SwaggerParser.validate(converted.spec).then(function (api) {
      let newApi = api
      let defaultHost = window.location.origin
      newApi = config.interceptor({ friendlyName: config.friendlyName, url: config.url }, api)
      swagger2SpecLoader(newApi, config.friendlyName, config.slug, defaultHost, { onLoadProgress, onNewAPI, onNewOperation, onLoadCompleted, onLoadError })
    }).catch(function (err) {
      onLoadError(err)
    })
  }).catch(function(err) {
    onLoadError(err)
  })
}
