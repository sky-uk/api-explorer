import React, { Component, PropTypes } from 'react'

class TryOutWidgetTab extends Component {
  render () {
    return (
       <div className='tab-content' >
        Try It
      </div>
    )
  }
}

TryOutWidgetTab.propTypes = {
  operation: PropTypes.object.isRequired
}

export default TryOutWidgetTab
