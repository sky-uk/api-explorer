import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as toastrReducer } from 'react-redux-toastr'

const rootReducer = combineReducers({
  router: routerReducer,
  toastr: toastrReducer,
  loader: require('./loader').default,
  apis: require('./apis').default,
  operations: require('./operations').default,
  operationResponses: require('./operationResponses').default,
  definitions: require('./definitions').default,
  configs: require('./configs').default,
  uiState: require('./uiState').default,
  plugins: require('./plugins').default,
  operationLastParameters: require('./operationLastParameters').default,
  operationLocalParameters: require('./operationLocalParameters').default
})

export default rootReducer

/*
  Anatomy of our global REDUX state
  ------------------------------------------------------------------

  {
    router: { ... custom state for redux-router },

    loader: { // State related with API Explorer loading
      loaded:       BOOL,       // True when all APIs are loaded
      steps:        [STRING]
      currentStep:  STRING,
    },

    // All the configured APIs (multiple for "micro-services" configuration)
    apis: MAP {
      order: [ 'petshop', 'uber', ... ],
      byName: {
        'petshop': { ... API Specification },
        'uber':    { ... API Specification },
        ...
      }
    },

    // All operations
    operations: [
      { id: 'unique-operation-id', apiname: 'petshop', spec: { ... operation data ... } },
      ...
    ],

    currentOperation: { // Copy of the selected operation
      description: { },
      response: { }
    }
  }
*/
