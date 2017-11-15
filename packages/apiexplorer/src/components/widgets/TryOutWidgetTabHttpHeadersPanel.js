import React, { Component, PropTypes } from 'react'
import {Map} from 'immutable'
import { Segment, Grid } from 'semantic-ui-react'

class TryOutWidgetTabHttpHeadersPanel extends Component {
  constructor () {
    super()
    this.state = { ...this.state }
  }

  renderHeaders (headers) {
    var headerMap = Map(headers)
    if (headerMap && headerMap.size > 0) {
      return (
        <tbody>
          {headerMap.map((value, key) => (<tr key={key}>
            <td>{key.toUpperCase()}</td>
            <td>{value}</td>
          </tr>)
        ).toList()}
        </tbody>
      )
    }
    return <tbody><tr><td colSpan={2}>No headers were found</td></tr></tbody>
  }

  render () {
    const tableClass = 'ui table'
    const responseHeaders = this.props.responseHeaders
    const requestHeaders = this.props.requestHeaders

    return (
      <Segment>
        <Grid columns='2'>
          <Grid.Column>
            <h5><strong>Request Headers</strong></h5>
            <table className={tableClass} style={{ fontSize: '12px' }}>
              {this.renderHeaders(requestHeaders)}
            </table>
          </Grid.Column>
          <Grid.Column>
            <h5><strong>Response Headers</strong></h5>
            <table className={tableClass} style={{ fontSize: '12px' }}>
              {this.renderHeaders(responseHeaders)}
            </table>
          </Grid.Column>
        </Grid>
      </Segment>
    )
  }
}

// TryOutWidgetTabHttpHeadersPanel.propTypes = {
//   requestHeaders: PropTypes.object,
//   responseHeaders: PropTypes.object
// }

export default TryOutWidgetTabHttpHeadersPanel
