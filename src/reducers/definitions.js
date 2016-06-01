import { Map } from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = Map({})

export default function definitionsReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.NEW_DEFINITION:
      return state.set(action.definition.key, { name: action.definition.name, schema: action.definition.definition })
  }
  return state
}
