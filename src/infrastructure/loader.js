import fetch from 'isomorphic-fetch'

export const specType = {
  'SWAGGER1': 'Swagger1.0',
  'SWAGGER2': 'Swagger2.0'
}

function parseSwagger1 (json) {
  return 'Swagger 1.0'
}

function parseSwagger2 (json) {
  return 'Swagger 2.0'
}

function parseResponse (sType, json) {
  switch (sType) {
    case specType.SWAGGER1:
      return parseSwagger1(json)
    default:
      return parseSwagger2(json)
  }
}

export function loader (loaderState) {
  loaderState.updateProgress(`Loading Api Spec from ${loaderState.url}`)

  return fetch(loaderState.url)
      .then(response => {
        loaderState.updateProgress('Converting Response')
        return response.json()
      })
      .then(json => {
        loaderState.updateProgress('Parsing Api Spec Response')
        loaderState.loadComplete(parseResponse(loaderState.specType, json))
      })
}
