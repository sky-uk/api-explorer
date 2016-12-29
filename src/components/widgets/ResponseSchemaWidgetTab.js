import React, { Component, PropTypes } from 'react'
// import Highlight from 'react-highlight'
// import 'highlight.js/styles/tomorrow.css' see issue #26

class ResponseSchemaWidgetTab extends Component {
  getDefinitions (responseSchema) {
    const definitions = this.props.definitions
    function getModelFor (schemaReference, deep = 0) {
      if (deep === 5) {
        return schemaReference
      }

      const definition = definitions[schemaReference]
      if (!definition || !definition.schema) {
        return schemaReference
      }

      if (definition.schema.type === 'object') {
        let model = {}
        Object.keys(definition.schema.properties || {}).forEach(p => {
          const propDescriptor = definition.schema.properties[p]

          // check if the type is an array
          if (propDescriptor.hasOwnProperty('type') && propDescriptor.type === 'array') {
            if (propDescriptor.hasOwnProperty('items') && propDescriptor.items.hasOwnProperty('$ref')) {
              model[p] = [ getModelFor(propDescriptor.items.$ref, deep + 1) ]
            } else {
              model[p] = [ getModelFor(propDescriptor.items.type, deep + 1) ]
            }
          } else {
            // check if instead of a array is a known type
            if (propDescriptor.hasOwnProperty('$ref')) {
              model[p] = getModelFor(propDescriptor.$ref, deep + 1)
            } else {
              model[p] = propDescriptor.type
            }
          }
        })
        return model
      }

      if (definition.schema.type === 'array') {
        let model = []
        let items = definition.schema.items
        // Draw arrays with $ref objects
        if (items.hasOwnProperty('$ref')) {
          model.push(getModelFor(items.$ref, deep + 1))
        }
        // TODO: Accept other types
        return model
      }
    }

    if (responseSchema.hasOwnProperty('type')) {
      if (responseSchema.type === 'array') {
        return JSON.stringify([getModelFor(responseSchema.items.$ref)], null, 2)
      }

      return responseSchema.type
    }

    if (responseSchema.hasOwnProperty('$ref')) {
      return JSON.stringify(getModelFor(responseSchema.$ref), null, 2)
    }

    return 'void'
  }

  getResponseSchemas () {
    const responses = this.props.operation.spec.responses
    const definitions = this.props.definitions
    let responseSchemas = []
    Object.keys(responses || {}).forEach(statusCode => {
      const response = responses[statusCode]
      if (response && response.schema) {
        responseSchemas.push({ returnType: getSchemaName(response), statusCode, description: response.description, schema: response.schema })
      } else {
        responseSchemas.push({ returnType: '', statusCode, description: response.description, schema: {} })
      }
    })

    function getSchemaName (response) {
      if (response.hasOwnProperty('schema')) {
        if (response.schema.hasOwnProperty('type')) {
          if (response.schema.type === 'array') {
            if (response.schema.items.hasOwnProperty('$ref')) {
              return `[${definitions[response.schema.items.$ref].name}]`
            }
            return `[${response.schema.items.type}]`
          }
          return response.schema.type
        }
        if (response.schema.hasOwnProperty('$ref')) {
          return definitions[response.schema.$ref].name
        }
      }
      return 'void'
    }

    return responseSchemas
  }

  renderResponseSchema (responseSchema) {
    return (
    <div key={responseSchema.statusCode} className='panel panel-default' >
        <div className='panel-heading'>
          <strong>{responseSchema.statusCode}</strong> {responseSchema.description ? '- ' + responseSchema.description : ''}
            <code>{responseSchema.returnType}</code>
        </div>
        <div className='panel-body'>
          <table style={{ width: '100%' }} className='table' >
            <thead>
              <tr><th>Sample</th><th>Schema</th></tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: '50%' }}><pre style={{ border: 'none' }}>{this.getDefinitions(responseSchema.schema)}</pre></td>
                <td><pre style={{ border: 'none', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{JSON.stringify(this.props.definitions[responseSchema.schema.$ref], null, 2)}</pre></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  render () {
    const responseSchemas = this.getResponseSchemas()
    return (
      <div className='response-model tab-pane fade in'>
        <h4>Http Status Codes</h4>
        {responseSchemas.map(responseSchema => this.renderResponseSchema(responseSchema))}
      </div>
    )
  }
}

ResponseSchemaWidgetTab.propTypes = {
  operation: PropTypes.object.isRequired,
  definitions: PropTypes.object.isRequired
}

export default ResponseSchemaWidgetTab
