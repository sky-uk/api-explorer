import React, { Component, PropTypes } from 'react'

class TryOutWidgetTabHttpHeadersPanel extends Component {
  constructor () {
    super()
    this.state = { ...this.state }
  }

  renderRequestHeaders (requestHeaders) {
    if (requestHeaders && requestHeaders.lenght > 0) {
      this.props.requestHeaders.map(header => <tr><td>{header.name}</td><td>{header.value}</td></tr>)
    }

    return (<tr><td colSpan={2}>No Headers were found</td></tr>)
  }

  renderResponseHeaders (responseHeaders) {
    /* if ( responseHeaders && responseHeaders.lenght > 0) {

    }*/

    return (<tr><td colSpan={2}>No Headers were found</td></tr>)
  }

  render () {
    const tableClass = 'table table-condensed table-hover table-striped table-bordered col-md-10'
    return (
      <div>
        <div className='pull-left' style={{ width: '47%' }}>
          <h5 ><strong>Request Headers</strong></h5>
          <table ref='tableRequestHeaders' className={tableClass} style={{fontSize: '12px'}}>
            <tbody>
            </tbody>
          </table>
        </div>
        <div className='pull-right' style={{ width: '47%' }}>
          <h5 ><strong>Response Headers</strong></h5>
          <table ref='tableResponseHeaders' className={tableClass} style={{fontSize: '12px'}}>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

TryOutWidgetTabHttpHeadersPanel.propTypes = {
  requestHeaders: PropTypes.array,
  responseHeaders: PropTypes.object
}

export default TryOutWidgetTabHttpHeadersPanel
