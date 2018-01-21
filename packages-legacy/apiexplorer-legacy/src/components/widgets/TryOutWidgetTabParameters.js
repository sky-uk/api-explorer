import React, { Component, PropTypes } from 'react'
import Enumerable from 'linq'
import moment from 'moment'

class TryOutWidgetTabParameters extends Component {
  componentWillReceiveProps () {
    this.setState({})
  }

  // ###############################################################################################################
  // Editors renders
  // ###############################################################################################################

  editorForInput (param, value) {
    const handleParametersOnChange = this.props.onHandleParametersChange
    const style = { border: 'solid 1px #AAA', padding: '2px' }
    if (param.in === 'body') {
      return (
        <textarea className='col-md-12' rows={value ? Math.max(4, value.split('\n').length + 1) : 4}
          style={style} required={param.required} value={value}
          onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value)}
        />
      )
    }
    return (
      <input type='text' className='col-md-12' style={style} required={param.required}
        value={value} onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value)} />
    )
  }

  editorForFile (param, value) {
    return <input type='file' />
  }

  editorForSelect (param, value) {
    const handleParametersOnChange = this.props.onHandleParametersChange
    return (
      <select className='col-md-12' value={value}
        onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value)} >
        {param.enum.map((text, i) => <option key={i}>{text}</option>)}
      </select>
    )
  }

  editorForMultipleSelect (param, value) {
    const handleParametersOnChange = this.props.onHandleParametersChange
    value = [ value || param.items.default ]
    return (
      <select multiple='multiple' className='col-md-12' value={value}
        onChange={(evt) => {
          const selectedValues = Enumerable.from(evt.currentTarget.selectedOptions).select(o => o.value).toArray().join(',')
          handleParametersOnChange(param.name, selectedValues)
        }} >
        {param.items.enum.map((text, i) => <option key={i} value={text}>{text}</option>)}
      </select>
    )
  }

  // ###############################################################################################################
  // Renders
  // ###############################################################################################################

  renderLastParametersList () {
    if (this.props.operationLastParameters.size > 0) {
      const style = { float: 'right' }
      return (
        <div style={style}>
          <span>Last Parameters Used: </span>
          <select onChange={(e) => this.props.onHandleLastParametersChange(e)} >
            <option value='{"values": "default"}'>Default Parameters</option>
            {this.props.operationLastParameters.map((parameter, i) =>
              <option key={i} value={JSON.stringify(parameter.values)}>{moment(parameter.moment).fromNow()}</option>
            )}
          </select>
        </div>
      )
    }
    return ''
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
        <span title={JSON.stringify(definition, null, 2)}>
          <abbr style={{ borderBottom: 'dashed gray 1px ' }}>{definition.name}</abbr>
        </span>
      )
    }

    console.log('UNKNOWN TYPE', parameter.name, JSON.stringify(parameter, null, 2))
    return <div>-</div>
  }

  renderParameters (parameters) {
    return parameters.map((parameter, i) => {
      return (
        <tr key={i}>
          <td><span className='label label-default'>{parameter.in}</span></td>
          <td className='col-md-3'>
            <span>{parameter.name}</span>
            <span title='Required field'>{parameter.required ? '*' : ''}</span>
            {parameter.description && <div><small><small>{parameter.description}</small></small></div>}
          </td>
          <td className='col-md-6'>
            <div>{this.renderEditorFor(parameter)}</div>
          </td>
          <td className='col-md-3'><span>{this.renderParameterType(parameter)}</span></td>
        </tr>
      )
    })
  }

  render () {
    const parameters = this.props.operation.spec.parameters
    if (parameters && parameters.length > 0) {
      return (
        <div>
          {this.renderLastParametersList()}
          <h4>Parameters</h4>
          <table className='table table-striped' >
            <tbody className='operation-params' >
              {this.renderParameters(parameters)}
            </tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div>
          <h4>Parameters</h4>
          <div>This operation does not have any parameters.</div>
          <br />
        </div>
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
