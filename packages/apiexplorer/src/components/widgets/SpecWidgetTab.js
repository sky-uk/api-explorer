import React, { Component, PropTypes } from 'react'
import { Segment, Label } from 'semantic-ui-react'
import Enumerable from 'linq'

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
      console.log(parameter.schema, )
      let definition = this.props.definitions[parameter.schema.$ref]
      if (definition) {
        return (
          <div>
            <abbr>{parameter.schema.$ref}</abbr>
          </div>  
        )
      } else {
        return <abbr>{parameter.schema.$ref}</abbr>
      }
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

  renderDefinitions () {
    if (!this.props.operation.spec.parameters) return null

    const definitions = Enumerable.from(this.props.operation.spec.parameters)
      .where(parameter => parameter.schema && parameter.schema.$ref)
      .select(parameter => parameter.schema.$ref)
      .distinct()
      .select($ref => ({ $ref: $ref, schema: this.props.definitions[$ref] }))
      .toArray()

    return (<Segment>
      {definitions.map(definition => (
        <div key={definition.$ref}>
          <h5>{definition.$ref}</h5>
          <pre>{JSON.stringify(definition.schema, null, 2)}</pre>
        </div>
      ))}
      </Segment>)
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
          {this.renderDefinitions()}
        </div>
      </Segment>
    )
  }
}

// SpecWidgetTab.propTypes = {
//   operation: PropTypes.object.isRequired
// }

export default SpecWidgetTab
