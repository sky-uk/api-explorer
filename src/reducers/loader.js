import {List, Map} from 'immutable'
import * as types from '../constants/ActionTypes'

let INITIAL_STATE = Map({ 'loaded': false, 'progress': List([]), 'currentStep': '' })

export default function loaderReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_PROGRESS:
      return state
              .set('currentStep', action.currentStep)
              .set('progress',
                state.get('progress').push(action.currentStep)
              )
    case types.LOAD_COMPLETE:
      return state.set('apis', action.apis)
                  .set('loaded', true)
  }
  return state
}
