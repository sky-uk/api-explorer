import { combineReducers } from 'redux'
import { routerStateReducer } from 'redux-router'

const rootReducer = combineReducers({
  router: routerStateReducer,
  loader: require('./loader'),
  apis: require('./apis'),
  operations: require('./operations'),
  operationResponses: require('./operationResponses'),
  definitions: require('./definitions'),
  configs: require('./configs'),
  uiState: require('./uiState'),
  plugins: require('./plugins'),
  operationLastParameters: require('./operationLastParameters'),
  operationLocalParameters: require('./operationLocalParameters')
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
