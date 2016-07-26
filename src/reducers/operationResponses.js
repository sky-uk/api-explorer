import { Map } from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = Map()

export default function apisReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.NEW_RESPONSE:
      return state.set(action.operation.id, action.response, action.request)
  }
  return state
}
