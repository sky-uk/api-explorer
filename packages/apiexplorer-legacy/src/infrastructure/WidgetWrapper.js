import { connect } from 'react-redux'
import { List } from 'immutable'

export default function widgetWrapper (widgetTab) {
  return connect(
          (state) => {
            let operation = state.operations.filter(op => op.get('id') === state.router.params.id).first()
            operation = operation.size > 0 ? operation.toJS() : null

            let operationResponse = state.operationResponses.get(state.router.params.id)

            return {
              operation: operation,
              operationResponse: operationResponse,
              operations: state.operations,
              definitions: state.definitions.size > 0 ? state.definitions.toJS() : {},
              apis: state.apis.get('byName').get(operation.apiname),
              apiConfig: APIExplorer.getAPI(operation.apiname),
              config: {
                defaultScheme: state.configs.get('url').protocol,
                useProxy: state.configs.get('url').useProxy,
                headers: state.configs.get('headers'),
                queryString: state.configs.get('url').getQueryString(),
                HttpClientConfigurator: APIExplorer.HttpClientConfigurator
              },
              operationLocalParameters: state.operationLocalParameters.get(operation.id) || {},
              operationLastParameters: state.operationLastParameters.get(operation.id) || List([])
            }
          }
        )(widgetTab)
}
