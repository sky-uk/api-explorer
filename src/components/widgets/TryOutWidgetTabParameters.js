import React, { Component, PropTypes } from 'react'

class TryOutWidgetTabParameters extends Component {

// ###############################################################################################################
// Editors renders
// ###############################################################################################################

  editorForInput (param) {
    const handleParametersOnChange = this.props.handleParametersOnChange
    const style = { border: 'solid 1px #AAA', padding: '2px' }

    if (param.paramType === 'body') {
      const value = param.value === undefined ? param.defaultValue : param. value
      return (
        <textarea className='col-md-12' rows={Math.max(4, value.split('\n').length + 1)}
                  style={style} required={param.required} value={value}
                  onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value)
                }
        />
      )
    }
    return (
        <input type='text' className='col-md-12' style={style} required={param.required}
               value={param.value === undefined ? param.defaultValue : param.value}
               onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value) }
        />
    )
  }

  editorForSelect (param) {
    const handleParametersOnChange = this.props.handleParametersOnChange
    return (
        <select className='col-md-12'
                value={param.value || param.defaultValue}
                onChange={(evt) => handleParametersOnChange(param.name, evt.currentTarget.value)} >
            {param.enum.map((text, i) => <option key={i}>{text}</option>)}
        </select>
    )
  }

// ###############################################################################################################
// Renders
// ###############################################################################################################

  renderEditorFor (param) {
    if (param.enum) {
      return this.editorForSelect(param)
    }
    return this.editorForInput(param)
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
    if (parameters) {
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
      return 'This operation does not have any parameters.'
    }
  }
}

TryOutWidgetTabParameters.propTypes = {
  operation: PropTypes.object.isRequired,
  handleParametersOnChange: PropTypes.func.isRequired
}

export default TryOutWidgetTabParameters
