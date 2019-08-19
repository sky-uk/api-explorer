import React, { Component } from 'react'
import moment from 'moment'
import { Segment, Table, Label, Input, TextArea, Dropdown, Popup } from 'semantic-ui-react'
import { getSampleSchema } from './../../ObjectSamples'

import { Controlled as CodeMirror } from 'react-codemirror2'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

import 'codemirror/addon/display/fullscreen'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'
import 'codemirror/addon/mode/overlay'
import 'codemirror/addon/display/fullscreen.css'

import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/comment-fold'

import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'

class TryOutWidgetTabParameters extends Component {
  componentWillReceiveProps () {
    this.setState({})
  }

  componentWillMount () {
  }
  // ###############################################################################################################
  // Editors renders
  // ###############################################################################################################

  editorForInput = (param, value) => {
    const handleParametersOnChange = this.props.onHandleParametersChange
    
    if (param.in === 'body') {
      let options = {
        mode: 'application/json',
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true,
        lineWrapping: false,
        foldGutter: true,
        theme: 'material',
        readOnly: false,
        extraKeys: {
          // Fullscreen
          'F11': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
          'Ctrl-M': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
          'Cmd-M': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
          'Esc': cm => cm.getOption('fullScreen') && cm.setOption('fullScreen', false),
          // Code Folding
          'Ctrl-Y': cm => cm.foldAll(),
          'Cmd-Y': cm => cm.foldAll(),
          'Ctrl-Alt-Y': cm => cm.unfoldAll(),
          'Shift-Ctrl-Y': cm => cm.unfoldAll(),
          'Cmd-Shift-Y': cm => cm.unFoldAll(),
          'Ctrl-U': cm => cm.foldCode(cm.getCursor()),
          'Cmd-U': cm => cm.foldCode(cm.getCursor())
        }
      }

      return (
        <CodeMirror
          value={value}
          options={options}
          onBeforeChange={(editor, data, newValue) => handleParametersOnChange(param, newValue)}
          onChange={(editor, data, newValue) => handleParametersOnChange(param, newValue)}
        />
      )
    }
    return (
      <Input fluid required={param.required}
        value={value} onChange={(evt) => handleParametersOnChange(param, evt.currentTarget.value)} />
    )
  }

  editorForFile = (param, value) => {
    const handleParametersOnChange = this.props.onHandleParametersChange
    return (<Input type='file' fluid required={param.required}
      onChange={(evt) => handleParametersOnChange(param, evt.currentTarget.files[0])} />)
  }

  editorForSelect = (param, value) => {
    const handleParametersOnChange = this.props.onHandleParametersChange
    const options = param.enum.map(option => ({ key: option, text: option, value: option }))
    return (
      <Dropdown fluid selection options={options} defaultValue={value}
        onChange={(event, data) => handleParametersOnChange(param, data.value)} />
    )
  }

  editorForMultipleSelect = (param, value) => {
    const handleParametersOnChange = this.props.onHandleParametersChange
    if (!Array.isArray(value)) value = [ value || param.items.default ]
    const options = param.items.enum.map(option => ({ key: option, text: option, value: option }))
    return (
      <Dropdown fluid multiple selection options={options} value={value}
        onChange={(event, data) => handleParametersOnChange(param, data.value)} />
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
    this.props.onHandleParametersChange(param, example)
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
      let example = 'Sorry, cannot get the example for this object'
      try {
        example = getSampleSchema(parameter.schema, this.props.definitions, 'json')
      } catch (e) {
        console.log(e)
      }

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
          trigger={<abbr style={{ borderBottom: 'dashed gray 1px ' }}>Schema</abbr>}
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
