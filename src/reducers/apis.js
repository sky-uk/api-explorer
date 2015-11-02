import {List, Map} from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = Map({
  byOrder: List([]),
  byName: Map({
  })
})

export default function apisReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.NEW_API:
      return state.set('byOrder', List([action.config.friendlyName]))
                  .set('byName', Map({ [action.config.friendlyName]: action.api }))
  }
  return state
}
