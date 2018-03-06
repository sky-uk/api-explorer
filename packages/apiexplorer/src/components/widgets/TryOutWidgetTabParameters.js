import React, { Component } from 'react'
import moment from 'moment'
import { Segment, Table, Label, Input, TextArea, Dropdown, Popup } from 'semantic-ui-react'
import { getSampleSchema } from './../../ObjectSamples'

class TryOutWidgetTabParameters extends Component {
  componentWillReceiveProps () {
    this.setState({})
  }

  // ###############################################################################################################
  // Editors renders
  // ###############################################################################################################

  editorForInput = (param, value) => {
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
        defaultValue={value} onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value)} />
    )
  }

  editorForFile = (param, value) => {
    return <Input type='file' />
  }

  editorForSelect = (param, value) => {
    const handleParametersOnChange = this.props.onHandleParametersChange
    const options = param.enum.map(option => ({ key: option, text: option, value: option }))
    return (
      <Dropdown fluid selection options={options} defaultValue={value}
        onChange={(event, data) => handleParametersOnChange(param.name, data.value)} />
    )
  }

  editorForMultipleSelect = (param, value) => {
    const handleParametersOnChange = this.props.onHandleParametersChange
    if (!Array.isArray(value)) value = [ value || param.items.default ]
    const options = param.items.enum.map(option => ({ key: option, text: option, value: option }))
    return (
      <Dropdown fluid multiple selection options={options} value={value}
        onChange={(event, data) => handleParametersOnChange(param.name, data.value)} />
    )
  }

  // ###############################################################################################################
  // Renders
  // ###############################################################################################################

  renderLastParametersList = () => {
    const defaultValue = JSON.stringify({ values: 'default' })

    const options = [{
      text: 'Default Parameters',
      value: defaultValue
    }]
      .concat(this.props.operationLastParameters.toJS().map((parameter, idx) => ({
        text: `Parameters ${moment(parameter.moment).fromNow()}`,
        value: JSON.stringify(parameter.values),
        title: JSON.stringify(parameter.values, null, 2),
        key: idx
      })))

    return (
      <Dropdown selection options={options} value={defaultValue}
        onChange={(e, data) => this.props.onHandleLastParametersChange(JSON.parse(data.value))}
      />
    )
  }

  renderEditorFor = (param) => {
    let value = this.props.operationParameters[param.name]

    // for parameters of type header, use default value from headers list
    if (param.in === 'header' && !value && this.props.headers.find(h => h.name === param.name)) {
      value = this.props.headers.find(h => h.name === param.name).value
    }

    if (value === undefined) {
      value = param.default
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

  onClickChangeField = (param, example) => {
    this.props.onHandleParametersChange(param.name, example)
  }

  renderParameterType = (parameter) => {
    if (parameter.type === 'string' || parameter.type === 'integer' || parameter.type === 'file') {
      return <span>{parameter.type}</span>
    }

    if (parameter.type === 'array') {
      if (parameter.items && parameter.items.enum) {
        return <span><abbr>{parameter.type}</abbr> of <abbr>({parameter.items.enum.join(',')})</abbr></span>
      }
      return <span><abbr>{parameter.type}</abbr> of <abbr>{parameter.items.type}</abbr></span>
    }

    if (parameter.schema && parameter.schema.$ref) {
      const definition = this.props.definitions[parameter.schema.$ref]
      const example = getSampleSchema(parameter.schema, this.props.definitions, 'json')
      return (
        <div>
          <Popup
            trigger={
              <div>
                <abbr style={{ borderBottom: 'dashed gray 1px ' }}>{definition.name}</abbr>
                <br />
                <a onClick={this.onClickChangeField.bind(this, parameter, example)}>Copy example to field</a>
              </div>
            }
            content={<pre>{example}</pre>}
            basic
          />
        </div>
      )
    }

    if (parameter.schema && parameter.schema.type) {
      return (
        <Popup
          trigger={<abbr style={{ borderBottom: 'dashed gray 1px ' }}>{parameter.schema}</abbr>}
          content={<pre>{JSON.stringify(parameter.schema.type, null, 2)}</pre>}
          basic
        />
      )
    }

    console.log('UNKNOWN TYPE', parameter.name, JSON.stringify(parameter, null, 2))
    return <div>-</div>
  }

  renderParameterDescription = (description) => {
    return description.startsWith('http')
      ? (<div><small><small><a href={description} target='_blank'>Go to external docs <i className='fa fa-external-link' /></a></small></small></div>)
      : (<div><small><small>{description}</small></small></div>)
  }

  renderParameterRow = (parameter, index) => {
    return (
      <Table.Row key={index}>
        <Table.Cell width={1}><Label size='small' color='grey'>{parameter.in}</Label></Table.Cell>
        <Table.Cell width={3}>
          <span>{parameter.name}</span>
          <span title='Required field'>{parameter.required ? '*' : ''}</span>
          {parameter.description && this.renderParameterDescription(parameter.description)}
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
        <div >
          <h4>Parameters</h4>
          <Table basic='very' selectable compact size='small' tableData={parameters} renderBodyRow={this.renderParameterRow} />
        </div>
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

export default TryOutWidgetTabParameters
