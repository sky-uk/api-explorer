import React, { Component } from 'react'
import { Segment, Card, Table } from 'semantic-ui-react'

const contentTypeJson = 'application/json'

class ResponseSchemaWidgetTab extends Component {
  getDefinitions (responseSchema) {
    function getModelFor (schemaReference, deep = 0) {
      if (deep === 5) {
        return schemaReference
      }

      if (schemaReference.type === 'object') {
        let model = {}
        Object.keys(schemaReference.properties || {}).forEach(p => {
          const propDescriptor = schemaReference.properties[p]

          // check if the type is an array
          if (propDescriptor.hasOwnProperty('type') && propDescriptor.type === 'array') {
            model[p] = [ getModelFor(propDescriptor.items, deep + 1) ]
          } else {
            model[p] = propDescriptor.type
          }
        })
        return model
      }

      if (schemaReference.type === 'array') {
        return [getModelFor(schemaReference.items, deep + 1)]
      }
    }

    if (responseSchema.hasOwnProperty('type')) {
      if (responseSchema.type === 'array' || responseSchema.type === 'object') {
        return JSON.stringify(getModelFor(responseSchema), null, 2)
      }
      return responseSchema.type
    }

    return 'void'
  }

  getResponseSchemas () {
    const responses = this.props.operation.spec.responses
    let responseSchemas = []
    Object.keys(responses || {}).forEach(statusCode => {
      const response = responses[statusCode]
      if (response && response.content && response.content[contentTypeJson] && response.content[contentTypeJson].schema) {
        responseSchemas.push({ returnType: getSchemaName(response), statusCode, description: response.description, schema: response.content[contentTypeJson].schema })
      } else {
        responseSchemas.push({ returnType: '', statusCode, description: response.description, schema: {} })
      }
    })

    function getSchemaName (response) {
      const schema = response.content[contentTypeJson].schema
      if (schema.hasOwnProperty('type')) {
        if (schema.type === 'array') {
          return `[${schema.items.type}]`
        }
        return schema.type
      }
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
