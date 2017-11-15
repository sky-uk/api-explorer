import React, { Component, PropTypes } from 'react'
import { Segment } from 'semantic-ui-react'

class SpecWidgetTab extends Component {
  renderParameter (parameter) {
    return (<tr key={parameter.name}>
      <td >
        <span className='label label-default' >{parameter.in}</span>
      </td>
      <td className='col-md-2' ><span >{parameter.name}</span></td>
      <td className='col-md-8' >
        <span className='doc-w-param-value' >{parameter.description}</span>
      </td>
      <td className='col-md-2' >
        <span className='doc-w-param-datatype' >{this.renderType(parameter)}
        </span>
      </td>
    </tr>)
  }

  renderType (parameter) {
    if (parameter.type) {
      return <abbr>{parameter.type}</abbr>
    }
    if (parameter.schema) {
      return <abbr>{parameter.schema.$ref}</abbr>
    }
    return <span>-</span>
  }

  renderStatusCodes (statusCode, description) {
    return (
      <tr key={statusCode}>
        <td className='col-md-2' >{statusCode}</td>
        <td className='col-md-10' >{description}</td>
      </tr>)
  }

  render () {
    if (!this.props.operation) {
      return (<div>Operation not found</div>)
    }

    return (
      <Segment attached='bottom' >
        <div>
          <p>{this.props.operation.spec.summary}</p>
          <p>{this.props.operation.spec.description}</p>
          <Segment>
            <h4 >Parameters</h4>
            <table className='ui table table-striped' >
              <tbody className='operation-params' >
                {this.props.operation.spec.parameters && this.props.operation.spec.parameters.map(parameter =>
                  this.renderParameter(parameter)
                )}
              </tbody>
            </table>
          </Segment>
          <Segment>
            <h4>Response Status Codes</h4>
            <table className='ui table table-bordered striped' >
              <tbody className='operation-status' >
                {Object.keys(this.props.operation.spec.responses).map(statusCode =>
                  this.renderStatusCodes(
                    statusCode,
                    this.props.operation.spec.responses[statusCode].description
                  )
                )}
              </tbody>
            </table>
          </Segment>
        </div>
      </Segment>
    )
  }
}

// SpecWidgetTab.propTypes = {
//   operation: PropTypes.object.isRequired
// }

export default SpecWidgetTab
