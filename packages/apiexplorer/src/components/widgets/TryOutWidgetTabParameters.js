import React, { Component, PropTypes } from 'react'
import Enumerable from 'linq'
import moment from 'moment'
import { Grid, Segment, Table, Label, Input, TextArea, Select, Dropdown, Popup } from 'semantic-ui-react'

class TryOutWidgetTabParameters extends Component {

  componentWillReceiveProps () {
    this.setState({})
  }

// ###############################################################################################################
// Editors renders
// ###############################################################################################################

  editorForInput (param, value) {
    const handleParametersOnChange = this.props.onHandleParametersChange
    if (param.in === 'body') {
      return (
        <TextArea rows={value ? Math.max(4, value.split('\n').length + 1) : 4}
          style={{ width: '100%', border: '1px solid rgba(34,36,38,.15)' }} required={param.required} value={value}
          onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value)}
        />
      )
    }
    return (
      <Input fluid required={param.required}
        value={value} onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value)} />
    )
  }

  editorForFile (param, value) {
    return <Input type='file' />
  }

  editorForSelect (param, value) {
    const handleParametersOnChange = this.props.onHandleParametersChange
    const options = param.enum.map(option => ({ key: option, text: option, value: option }))
    // TODO: VERIFY HANDLING OF ONCHANGE
    return (
      <Dropdown fluid selection options={options} defaultValue={value} />
    )
  }

  editorForMultipleSelect (param, value) {
    const handleParametersOnChange = this.props.onHandleParametersChange
    value = [ value || param.items.default ]
    const options = param.items.enum.map(option => ({ key: option, text: option, value: option }))
    // TODO: VERIFY HANDLING OF ONCHANGE
    return (
      <Dropdown fluid multiple selection options={options} defaultValue={value} />
    )
  }

// ###############################################################################################################
// Renders
// ###############################################################################################################
  renderLastParametersList () {
    const defaultValue = JSON.stringify({ values: 'default' })
    const options = [{
      text: 'Default Parameters', value: defaultValue,
    }].concat(this.props.operationLastParameters.toJS().map(parameter => ({
      text: `Parameters ${moment(parameter.moment).fromNow()}`, value: JSON.stringify(parameter.values)
    })))

    return (
      <Dropdown selection options={options} value={defaultValue}
        onChange={(e, data) => this.props.onHandleLastParametersChange(JSON.parse(data.value))}
      />
    )
  }

  renderEditorFor (param) {
    let value = this.props.operationParameters[param.name]

    // for parameters of type header, use default value from headers list
    if (param.in === 'header' && !value && this.props.headers.find(h => h.name === param.name)) {
      value = this.props.headers.find(h => h.name === param.name).value
    }

    if (param.enum) {
      return this.editorForSelect(param, value)
    }

    if (param.type === 'array' && param.items && param.items.enum) {
      return this.editorForMultipleSelect(param, value)
    }

    if (param.type === 'file') {
      return this.editorForFile(param, value)
    }

    return this.editorForInput(param, value)
  }

  renderParameterType (parameter) {
    if (parameter.type === 'string' || parameter.type === 'integer' || parameter.type === 'file') {
      return <span>{parameter.type}</span>
    }

    if (parameter.type === 'array') {
      if (parameter.items && parameter.items.enum) {
        return <span><abbr>{parameter.type}</abbr> of <abbr>({parameter.items.enum.join(',')})</abbr></span>
      }
      return <span><abbr>{parameter.type}</abbr> of <abbr>{parameter.items.type}</abbr></span>
    }

    if (parameter.schema) {
      const definition = this.props.definitions[parameter.schema.$ref]
      return (
        <Popup
          trigger={<abbr style={{ borderBottom: 'dashed gray 1px ' }}>{definition.name}</abbr>}
          content={JSON.stringify(definition, null, 2)}
          basic
        />
      )
    }

    console.log('UNKNOWN TYPE', parameter.name, JSON.stringify(parameter, null, 2))
    return <div>-</div>
  }

  renderParameterRow = (parameter, index) => {
    return (
      <Table.Row key={index}>
        <Table.Cell width={1}><Label size='small' color='grey'>{parameter.in}</Label></Table.Cell>
        <Table.Cell width={3}>
          <span>{parameter.name}</span>
          <span title='Required field'>{parameter.required ? '*' : ''}</span>
          {parameter.description && <div><small><small>{parameter.description}</small></small></div>}
        </Table.Cell>
        <Table.Cell >
          <div>{this.renderEditorFor(parameter)}</div>
        </Table.Cell>
        <Table.Cell width={3}><span>{this.renderParameterType(parameter)}</span></Table.Cell>
      </Table.Row>
    )
  }

  render () {
    const parameters = this.props.operation.spec.parameters
    if (parameters && parameters.length > 0) {
      return (
        <Segment>
          <Grid columns='2' >
            <Grid.Column verticalAlign='bottom'>
              <h4>Parameters</h4>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <span className='pull-right'>{this.renderLastParametersList()}</span>
            </Grid.Column>
          </Grid>
          <Table tableData={parameters} compact size='small' striped renderBodyRow={this.renderParameterRow} />
        </Segment>
      )
    } else {
      return (
        <Segment>
          <h4>Parameters</h4>
          <div>This operation does not have any parameters.</div>
        </Segment>
      )
    }
  }
}

TryOutWidgetTabParameters.propTypes = {
  operation: PropTypes.object.isRequired,
  definitions: PropTypes.object.isRequired,
  headers: PropTypes.array.isRequired,
  operationParameters: PropTypes.object,
  operationLastParameters: PropTypes.object,
  onHandleParametersChange: PropTypes.func.isRequired,
  onHandleLastParametersChange: PropTypes.func.isRequired
}

export default TryOutWidgetTabParameters
