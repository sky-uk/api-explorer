import { connect } from 'react-redux'

export default function widgetWrapper (widgetTab) {
  return connect(
          state => {
            const operation = state.operations.filter(op => op.get('id') === state.router.params.id).first()
            return {
              operation: operation.size > 0 ? operation.toJS() : null
            }
          }
        )(widgetTab)
}
