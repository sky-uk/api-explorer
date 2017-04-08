import React, { Component, PropTypes } from 'react'
import './CustomHeadersSettings.css'
import Form from 'react-jsonschema-form'
import { headers } from '../../actions/loadActionCreators'
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
          value: { type: 'string', title: 'Value' }
        }
      }
    }
  }
}

const uiSchema = {
  headers: {
    items: {
      name: { classNames: 'col-xs-6' },
      value: { classNames: 'col-xs-6' }
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
    this.props.dispatch(headers(evt.formData.headers))
    this.setState({
      ...evt.formData,
      showSuccess: true
    })
  }

  handleOnChange (evt) {
    this.setState({
      ...evt.formData,
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
        <br />
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
