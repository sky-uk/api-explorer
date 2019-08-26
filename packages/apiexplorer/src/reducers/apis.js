import { List, Map } from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = Map({
  byOrder: List([]),
  bySlug: Map({}),
  byName: Map({})
})

export default function apisReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.API_CONFIGURATIONS:
      return state.set('byOrder', List(action.payload.map(config => config.friendlyName)))
    case types.NEW_API:
      return state
        .set('byName', state.get('byName').set(action.config.friendlyName, action.api))
        .set('bySlug', state.get('bySlug').set(action.config.slug, action.config.friendlyName))
  }
  return state
}
