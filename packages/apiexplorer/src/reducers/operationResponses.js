import { Map } from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = Map()

export default function apisReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.RESPONSE_RECEIVED:
      return state.set(action.operation.id, {
        response: action.response,
        request: action.request,
        error: action.error
      })
  }
  return state
}
