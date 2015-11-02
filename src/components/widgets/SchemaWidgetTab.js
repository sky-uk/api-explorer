import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class SchemaWidgetTab extends Component {
  render () {
    return (
      <div className='tab-content' >
        Schema
      </div>
    )
  }
}

SchemaWidgetTab.propTypes = {
  children: PropTypes.element,
  operation: PropTypes.object
}

export default connect(
  state => {
    const operation = state.operations.filter(op => op.get('id') === state.router.params.id).first()
    return {
      operation: operation.size > 0 ? operation.toJS() : null
    }
  }
)(SchemaWidgetTab)
