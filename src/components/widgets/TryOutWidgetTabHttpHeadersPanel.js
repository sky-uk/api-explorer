import React, { Component, PropTypes } from 'react'
import {Map} from 'immutable'

class TryOutWidgetTabHttpHeadersPanel extends Component {
  constructor () {
    super()
    this.state = { ...this.state }
  }

  renderHeaders (headers) {
    var headerMap = Map(headers)

    if (headerMap && headerMap.size > 0) {
      return headerMap.map((value, key) => {
        return (
          <tr>
            <td style={{textTransform: 'capitalize'}}>{key}</td>
            <td>{value}</td>
          </tr>
        )
      })
    }

    return (<tr><td colSpan={2}>No headers were found</td></tr>)
  }

  render () {
    const tableClass = 'table table-condensed table-hover table-striped table-bordered col-md-10'
    const responseHeaders = this.props.responseHeaders
    const requestHeaders = this.props.requestHeaders

    return (
      <div>
        <div className='pull-left' style={{ width: '47%' }}>
          <h5 ><strong>Request Headers</strong></h5>
          <table ref='tableRequestHeaders' className={tableClass} style={{fontSize: '12px'}}>
            <tbody>
              {this.renderHeaders(requestHeaders)}
            </tbody>
          </table>
        </div>
        <div className='pull-right' style={{ width: '47%' }}>
          <h5 ><strong>Response Headers</strong></h5>
          <table ref='tableResponseHeaders' className={tableClass} style={{fontSize: '12px'}}>
            <tbody>
              {this.renderHeaders(responseHeaders)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

TryOutWidgetTabHttpHeadersPanel.propTypes = {
  requestHeaders: PropTypes.object,
  responseHeaders: PropTypes.object
}

export default TryOutWidgetTabHttpHeadersPanel
