import React, { Component } from 'react'
import { Segment, Card, Table } from 'semantic-ui-react'

class ResponseSchemaWidgetTab extends Component {
  getDefinitions (responseSchema) {
    const definitions = this.props.definitions
    function getModelFor (schemaReference, deep = 0) {
      if (deep === 5) {
        return schemaReference
      }

      // const definition = definitions[schemaReference]
      // if (!definition || !definition.schema) {
      //   return schemaReference
      // }

      if (responseSchema.type === 'object') {
        let model = {}
        Object.keys(responseSchema.properties || {}).forEach(p => {
          const propDescriptor = responseSchema.properties[p]

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

      if (responseSchema.type === 'array') {
        let model = []
        let items = responseSchema.items
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

      if (responseSchema.type === 'object') {
        return JSON.stringify([getModelFor(responseSchema)], null, 2)
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
    // const definitions = this.props.definitions
    let responseSchemas = []
    Object.keys(responses || {}).forEach(statusCode => {
      const response = responses[statusCode]
      if (response && response.content && response.content['application/json'] && response.content['application/json'].schema) {
        responseSchemas.push({ returnType: getSchemaName(response), statusCode, description: response.description, schema: response.content['application/json'].schema })
      } else {
        responseSchemas.push({ returnType: '', statusCode, description: response.description, schema: {} })
      }
    })

    function getSchemaName (response) {
      // if (response.hasOwnProperty('schema')) {
        const schema = response.content['application/json'].schema
        if (schema.hasOwnProperty('type')) {
          if (schema.type === 'array') {
            if (schema.items.hasOwnProperty('$ref')) {
              return `[${definitions[schema.items.$ref].name}]`
            }
            return `[${schema.items.type}]`
          }
          return schema.type
        }
        if (schema.hasOwnProperty('$ref')) {
          return definitions[schema.$ref].name
        }
      // }
      return 'void'
    }

    return responseSchemas
  }

  renderResponseSchema (responseSchema) {
    return (
      <Segment key={responseSchema.statusCode} >
        <Card fluid>
          <Card.Content>
            <strong>{responseSchema.statusCode}</strong> {responseSchema.description ? '- ' + responseSchema.description : ''}
            &nbsp;
            <strong><code>{responseSchema.returnType}</code></strong>
          </Card.Content>
          <Card.Content>
            <Table style={{ width: '100%' }} className='table' >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell content='Sample' />
                  <Table.HeaderCell content='Schema' />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row verticalAlign='top'>
                  <Table.Cell style={{ width: '50%' }}><pre style={{ border: 'none' }}>{this.getDefinitions(responseSchema.schema)}</pre></Table.Cell>
                  <Table.Cell><pre style={{ border: 'none', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{JSON.stringify(responseSchema.schema, null, 2)}</pre></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>
      </Segment>
    )
  }

  render () {
    const responseSchemas = this.getResponseSchemas()
    return (
      <Segment attached='bottom'>
        <h4>Http Status Codes</h4>
        {responseSchemas.map(responseSchema => this.renderResponseSchema(responseSchema))}
      </Segment>
    )
  }
}

// ResponseSchemaWidgetTab.propTypes = {
//   operation: PropTypes.object.isRequired,
//   definitions: PropTypes.object.isRequired
// }

export default ResponseSchemaWidgetTab
