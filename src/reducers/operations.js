import { List, Map } from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = List([])

export default function apisReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.NEW_OPERATION:
      return state.push(Map({ id: action.operation.id, apiname: action.config.friendlyName, spec: action.operation }))
  }
  return state
}
