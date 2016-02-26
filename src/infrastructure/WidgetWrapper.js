import { connect } from 'react-redux'

export default function widgetWrapper (widgetTab) {
  return connect(
          (state) => {
            let operation = state.operations.filter(op => op.get('id') === state.router.params.id).first()
            operation = operation.size > 0 ? operation.toJS() : null
            return {
              operation: operation,
              operations: state.operations,
              definitions: state.definitions.size > 0 ? state.definitions.toJS() : {},
              apis: state.apis.get('byName').get(operation.apiname),
              config: {
                defaultScheme: state.configs.get('url').protocol,
                useProxy: state.configs.get('url').useProxy,
                headers: state.configs.get('headers'),
                queryString: state.configs.get('url').getQueryString()
              }
            }
          }
        )(widgetTab)
}
