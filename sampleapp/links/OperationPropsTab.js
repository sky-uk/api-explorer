import React, { Component } from 'react'

export default class OperationPropsTab extends Component {
  render () {
    return (
      <div className='tab-content'>
        <h4>Operations Tab</h4>
        <p>This tab allow to see the props received by a WidgetTab.</p>
        {Object.keys(this.props).map(key => (
          <div key={key}>
            <h5>{key}</h5>
            <pre>
            {JSON.stringify(this.props[key], null, 2)}
            </pre>
          </div>
        ))}
      </div>
    )
  }
}
