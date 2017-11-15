import React, { Component, PropTypes } from 'react'
import { Segment, Label } from 'semantic-ui-react'

class SpecWidgetTab extends Component {

  renderParameterDescription (description) {
    return description.startsWith('http')
      ? (<a href={description} target='_blank'>Go to external docs <i className='fa fa-external-link' /></a>)
      : (<div>{description}</div>)
  }

  renderParameter (parameter) {
    return (
      <tr key={parameter.name}>
        <td className='col-md-4'>
          <Label size='tiny'>{parameter.in}</Label>
          <span> {parameter.name}</span></td>
        <td className='col-md-6' >
          <span className='doc-w-param-value'>{this.renderParameterDescription(parameter.description)}</span>
          {parameter.example && (
            <code>{JSON.stringify(parameter.example)}</code>
          )}
        </td>
        <td className='col-md-2' >
          <span className='doc-w-param-datatype' >{this.renderType(parameter)}
          </span>
        </td>
      </tr>
    )
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
            <h4>Parameters</h4>
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
