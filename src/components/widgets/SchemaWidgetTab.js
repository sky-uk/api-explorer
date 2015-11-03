import React, { Component, PropTypes } from 'react'

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
  operation: PropTypes.object.isRequired
}

export default SchemaWidgetTab
