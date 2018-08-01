import { Map } from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = Map({ url: '', headers: [] })

export default function configsReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.CONFIG_URL:
      return state.set('url', action.url)
    case types.CONFIG_HEADERS:
      return state.set('headers', action.headers)
    case types.CONFIG_CUSTOMIZABLE_HEADERS:
      return state.set('customizableHeaders', action.customizableHeaders)
    case types.CONFIG_ORIGINAL_CUSTOMIZABLE_HEADERS:
      return state.set('originalCustomizableHeaders', action.originalCustomizableHeaders)
  }
  return state
}
