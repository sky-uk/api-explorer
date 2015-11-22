import React, { Component, PropTypes } from 'react'
import Enumerable from 'linq'

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
        <textarea className='col-md-12' rows={ value ? Math.max(4, value.split('\n').length + 1) : 4 }
                  style={style} required={param.required} value={value}
                  onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value)
                }
        />
      )
    }
    return (
        <input type='text' className='col-md-12' style={style} required={param.required}
               value={value}
               onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value) }
        />
    )
  }

  editorForSelect (param, value) {
    const handleParametersOnChange = this.props.onHandleParametersChange
    return (
        <select className='col-md-12'
                value={value}
                onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value)} >
            {param.enum.map((text, i) => <option key={i}>{text}</option>)}
        </select>
    )
  }

  editorForMultipleSelect (param, value) {
    const handleParametersOnChange = this.props.onHandleParametersChange
    return (
        <select multiple='multiple'
                className='col-md-12'
                defaultValue={value}
                onChange={(evt) => {
                  const selectedValues = Enumerable.from(evt.currentTarget.selectedOptions).select(o => o.value).toArray().join(',')
                  handleParametersOnChange(param.name, selectedValues)
                }
                } >
            {param.items.enum.map((text, i) => <option key={i} selected={value && value.indexOf(text) > 0}>{text}</option>)}
        </select>
    )
  }

// ###############################################################################################################
// Renders
// ###############################################################################################################

  renderEditorFor (param) {
    const value = this.props.operationParameters[param.name]

    if (param.enum) {
      return this.editorForSelect(param, value)
    }

    if (param.type === 'array' && param.items && param.items.enum) {
      return this.editorForMultipleSelect(param, value)
    }

    return this.editorForInput(param, value)
  }

  renderParameters (parameters) {
    return parameters.map((parameter, i) => {
      return (
        <tr key={i}>
          <td><span className='label label-default'>{parameter.in}</span></td>
          <td className='col-md-2'>
              <span>{parameter.name}</span>
              <span title='Required field'>{parameter.required ? '*' : ''}</span>
              <i className='fa fa-info-circle pull-right' data-toggle='tooltip' data-placement='top' title={parameter.description}></i>
          </td>
          <td className='col-md-8'>
              <div>{this.renderEditorFor(parameter)}</div>
          </td>
          <td className='col-md-2'><span>{parameter.type}</span></td>
        </tr>
      )
    })
  }

  render () {
    const parameters = this.props.operation.spec.parameters
    if (parameters && parameters.length > 0) {
      return (
        <div>
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
          <br/>
        </div>
      )
    }
  }
}

TryOutWidgetTabParameters.propTypes = {
  operation: PropTypes.object.isRequired,
  operationParameters: PropTypes.object,
  onHandleParametersChange: PropTypes.func.isRequired
}

export default TryOutWidgetTabParameters
