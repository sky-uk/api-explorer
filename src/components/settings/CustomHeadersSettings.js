import React, { Component, PropTypes } from 'react'
import './CustomHeadersSettings.css'
import Form from 'react-jsonschema-form'
import { headers } from 'actions/loadActionCreators'
import Immutable from 'immutable'

const schema = {
  type: 'object',
  properties: {
    headers: {
      title: 'Headers',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name' },
          value: { type: 'string', title: 'Value' },
          disabledBtn: {type: 'boolean', title: 'Disable'}
        }
      }
    },
    disabledHeaders: {
      title: 'Disabled Headers',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name' },
          value: { type: 'string', title: 'Value' },
          disabledBtn: {type: 'boolean', title: 'Disable'}
        }
      }
    }
  }
}

const uiSchema = {
  headers: {
    items: {
      name: { classNames: 'col-xs-5' },
      value: { classNames: 'col-xs-5' },
      disabledBtn: { classNames: 'col-xs-2, disabledButtonRadio', id: 'disabledButton', 'ui:widget': 'radio' }
    }
  },
  disabledHeaders: {
    items: {
      name: { classNames: 'col-xs-5', 'ui:readonly': 'true' },
      value: { classNames: 'col-xs-5', 'ui:readonly': 'true' },
      disabledBtn: {classNames: 'col-xs-2, disabledButtonRadio', id: 'disabledButton', 'ui:widget': 'radio'}
    }
  }
}

class CustomHeadersSettings extends Component {

  constructor (props) {
    super(props)
    this.state = {
      ...Immutable.fromJS(props.config).toJS(),
      showSuccess: false
    }
    this.handleFormSave = this.handleFormSave.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  handleFormSave (evt) {
    this.props.dispatch(headers(evt.formData.headers, evt.formData.newFormDataDisabled))
    this.setState({
      ...evt.formData,
      showSuccess: true
    })
  }

  handleOnChange (evt) {
    if (evt.formData.disabledHeaders === undefined) {
      const headers = evt.formData.headers.filter((hd) => hd.disabledBtn === undefined || hd.disabledBtn === false)
      const disabledHeaders = evt.formData.headers.filter((hd) => hd.disabledBtn === true)

      var newFormDataHeader = Object.assign({}, { headers })
      var newFormDataDisabled = Object.assign({}, { disabledHeaders })
    } else {
      var oldHeaders = evt.formData.headers.filter((hd) => hd.disabledBtn === undefined || hd.disabledBtn === false)
      var oldDisabledHeaders = evt.formData.headers.filter((hd) => hd.disabledBtn === true)
      var filterHeaders = evt.formData.disabledHeaders.filter((hd) => hd.disabledBtn === false)
      var filterDisabledHeaders = evt.formData.disabledHeaders.filter((hd) => hd.disabledBtn === true)
      var headers = oldHeaders.concat(filterHeaders)
      var disabledHeaders = oldDisabledHeaders.concat(filterDisabledHeaders)
      /* jshint ignore:start */
      /* eslint-disable */
      var newFormDataHeader = Object.assign({}, { headers })
      var newFormDataDisabled = Object.assign({}, { disabledHeaders })
      /* eslint-enable */
      /* jshint ignore:end */
    }

    this.setState({
      ...newFormDataHeader,
      ...newFormDataDisabled,
      showSuccess: false
    })
  }

  render () {
    return (
      <div className='tab-content' >

        <Form schema={schema}
          uiSchema={uiSchema}
          formData={this.state}
          onChange={this.handleOnChange}
          onSubmit={this.handleFormSave} >
          <div>
            <button type='submit' className='btn btn-primary'>Save</button>
          </div>
        </Form>
        {this.state.showSuccess && <div className='alert alert-success' role='alert'>Settings updated with success.</div>}
      </div>
    )
  }
}

CustomHeadersSettings.propTypes = {
  config: PropTypes.object,
  dispatch: PropTypes.func
}

export default CustomHeadersSettings
