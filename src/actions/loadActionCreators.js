import * as types from 'constants/ActionTypes'

export function apiConfigurations (apiConfigurations) {
  return { type: types.API_CONFIGURATIONS, payload: apiConfigurations }
}

export function headers (headers) {
  return { type: types.CONFIG_HEADERS, headers }
}

export function load (config) {
  return dispatch => {
    const onLoadProgress = status => dispatch(progress(config, `[${config.friendlyName}] ${status}`))
    const onLoadCompleted = apis => dispatch(loadCompleted(config, apis))
    const onLoadError = errorMessage => dispatch(progress(config, `[${config.friendlyName}] ${errorMessage}`))
    const onNewAPI = api => dispatch(newAPI(config, api))
    const onNewOperation = operation => dispatch(newOperation(config, operation))
    const onNewDefinition = definition => dispatch(newDefinition(config, definition))

    dispatch({ type: types.LOAD_START, config })
    dispatch({ type: types.CONFIG_URL, url: config.url })

    config.loader(config, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError })
  }
}

function progress (config, currentStep) {
  return { type: types.UPDATE_PROGRESS, config, currentStep }
}

function loadCompleted (config, apis) {
  return { type: types.LOAD_COMPLETE, config, apis }
}

function newAPI (config, api) {
  return { type: types.NEW_API, config, api }
}

function newOperation (config, operation) {
  return { type: types.NEW_OPERATION, config, operation }
}

function newDefinition (config, definition) {
  return { type: types.NEW_DEFINITION, config, definition }
}

export function selectedOperation (operationId) {
  return { type: types.SELECTED_OPERATION, operationId }
}
