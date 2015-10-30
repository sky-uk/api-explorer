import * as types from '../constants/ActionTypes'
import { loader } from '../infrastructure/loader'

export function progress (currentStep) {
  return { type: types.UPDATE_PROGRESS, currentStep }
}

export function loadComplete (apis) {
  return { type: types.LOAD_COMPLETE, apis }
}

export function load (url, specType) {
  return dispatch => {
    const loadState = {
      url,
      specType,
      updateProgress (status) {
        dispatch(progress(status))
      },
      error (errorMessage) {
        dispatch(progress(errorMessage))
      },
      loadComplete (apis) {
        dispatch(loadComplete(apis))
      }
    }

    loader(loadState)
  }
}
