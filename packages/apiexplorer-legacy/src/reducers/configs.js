import { Map } from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = Map({ url: '', headers: [] })

export default function configsReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.CONFIG_URL:
      return state.set('url', action.url)
    case types.CONFIG_HEADERS:
      return state.set('headers', action.headers)
  }
  return state
}
