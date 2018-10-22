import { Map } from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = Map({})

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOCAL_PARAMETERS:
      return state.set(action.operationName, action.parameters)
  }
  return state
}
