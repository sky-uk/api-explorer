import { List, Map } from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = Map({})

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.NEW_PARAMETERS:
      var operationLastParameters = state.get(action.operationName)
      if (operationLastParameters) {
        if (operationLastParameters.size >= 5) {
          operationLastParameters = operationLastParameters.delete(0)
        }
        return state.set(action.operationName, operationLastParameters.push(action.parameters))
      } else {
        return state.set(action.operationName, List([action.parameters]))
      }
  }
  return state
}
