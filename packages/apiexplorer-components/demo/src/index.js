import React, { Component } from 'react'
import { render } from 'react-dom'

import { SampleComponent } from '../../src'

class Demo extends Component {
  render () {
    return <div>
      <h1>react-component-a Demo</h1>
      <SampleComponent />
    </div>
  }
}

render(<Demo />, document.querySelector('#demo'))
