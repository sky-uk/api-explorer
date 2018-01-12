import * as types from '../constants/ActionTypes'
import { toastr } from 'react-redux-toastr'

export function apiConfigurations (apiConfigurations) {
  return { type: types.API_CONFIGURATIONS, payload: apiConfigurations }
}

export function headers (headers) {
  return { type: types.CONFIG_HEADERS, headers }
}

export function load (config) {
  return dispatch => {
    const onLoadProgress = status => dispatch(progress(config, `[${config.friendlyName}] ${status}`))
    const onLoadCompleted = apiSpec => dispatch(loadCompleted(config, apiSpec, true))
    const onLoadFailure = () => dispatch(loadCompleted(config, null, false))
    const onLoadError = errorMessage => dispatch(progress(config, `[${config.friendlyName}] ${errorMessage}`))
    const onNewAPI = api => dispatch(newAPI(config, api))
    const onNewOperation = operation => dispatch(newOperation(config, operation))
    const onNewDefinition = definition => dispatch(newDefinition(config, definition))

    dispatch({ type: types.LOAD_START, config })
    dispatch({ type: types.CONFIG_URL, url: config.url })

    config
      .loader(config, { onLoadProgress, onNewAPI, onNewOperation, onNewDefinition, onLoadCompleted, onLoadError })
      .catch(error => {
        onLoadError(`Error fetching spec at ${config.url.toString()} (${error.message})`)
        console.warn(error)

        toastr.warning(`Error loading ${config.friendlyName}`, error.toString())
        onLoadFailure()
      })
  }
}

function progress (config, currentStep) {
  return { type: types.UPDATE_PROGRESS, config, currentStep }
}

function loadCompleted (config, apis, success) {
  return { type: types.LOAD_COMPLETE, config, apis, success }
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

export function newParameters (operationName, parameters) {
  return { type: types.NEW_PARAMETERS, operationName, parameters }
}

export function localParameters (operationName, parameters) {
  return { type: types.LOCAL_PARAMETERS, operationName, parameters }
}

export function sendRequest (operation, request) {
  return { type: types.SEND_REQUEST, operation, request }
}

export function responseReceived (operation, response, request, error) {
  return { type: types.RESPONSE_RECEIVED, operation, response, request, error }
}
