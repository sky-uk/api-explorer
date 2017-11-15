import React, { Component, PropTypes } from 'react'
import { headers } from '../../actions/loadActionCreators'
import Immutable from 'immutable'
import { Segment } from 'semantic-ui-react'

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
      name: { classNames: 'column' },
      value: { classNames: 'column' }
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
      <Segment attached='bottom' >
        
        {/* <Form schema={schema}
          uiSchema={uiSchema}
          formData={this.state}
          onChange={this.handleOnChange}
          onSubmit={this.handleFormSave} >
          <div>
            <button type='submit' className='ui button primary'>Save</button>
          </div>
        </Form> */}
        <br />
        {this.state.showSuccess && <div>Settings updated with success.</div>}
      </Segment>
    )
  }
}

// CustomHeadersSettings.propTypes = {
//   config: PropTypes.object,
//   dispatch: PropTypes.func
// }

export default CustomHeadersSettings
