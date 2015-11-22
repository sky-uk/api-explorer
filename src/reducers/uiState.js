import { Map } from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = Map({ selectedOperationId: '' })

export default function uiStateReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SELECTED_OPERATION:
      debugger
      return state.set('selectedOperationId', action.operationId)
  }
  return state
}
