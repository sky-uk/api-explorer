import {Map, List, fromJS} from 'immutable';
import {expect} from 'chai';
import loaderReducer from '../../src/reducers';

describe('reducers', () => {

  it('handles UPDATE_PROGRESS', () => {
    const action = {'type': 'UPDATE_PROGRESS', 'currentStep' : 'Current Step' }
    const nextState = loaderReducer(undefined, action)

    expect(nextState.loader).to.equal(
      fromJS({
          'progress' : [ 'Current Step' ],
          'currentStep' : 'Current Step'
      })
    )
  })

  it('handles LOAD_COMPLETE', () => {
    const action = {'type': 'LOAD_COMPLETE', 'apis' : 'something' }
    const nextState = loaderReducer(undefined, action)

    expect(nextState.loader).to.equal(
      fromJS({
          'progress' : [],
          'apis' : 'something'
      })
    )
  })

})
