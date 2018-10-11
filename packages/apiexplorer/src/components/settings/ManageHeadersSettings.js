import React, { Component } from 'react'
/* import { setHeaderConfigs } from '../../actions/loadActionCreators' */
import { Input, Tab, Button, Popup, Table, Icon, List, Label } from 'semantic-ui-react'

class ManageHeadersSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      originalCustomizableHeaders: this.props.config.originalCustomizableHeaders,
      customizableHeaders: this.props.config.customizableHeaders,

      isCreatingNewHeaderValue: false,
      inputValue: '',
      inputDescription: ''
    }

    this.handleStartCreatingNewHeaderValue = this.handleStartCreatingNewHeaderValue.bind(this)
    this.handleCancelCreatingNewHeaderValue = this.handleCancelCreatingNewHeaderValue.bind(this)
    this.handleResetNewHeaderValue = this.handleResetNewHeaderValue.bind(this)
    this.handleCreateNewHeaderValue = this.handleCreateNewHeaderValue.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
  }

  componentDidMount () { }
  componentWillUnmount () { }

  handleStartCreatingNewHeaderValue (evt) { this.setState({isCreatingNewHeaderValue: true}) }
  handleCancelCreatingNewHeaderValue (evt) { this.setState({isCreatingNewHeaderValue: false, inputValue: '', inputDescription: ''}) }
  handleResetNewHeaderValue (evt, header) {
    const originalHeader = this.getCopyOfOriginalHeaderByName(header.name)
    header.values = originalHeader.values
    this.setState({
      isCreatingNewHeaderValue: false,
      inputValue: '',
      inputDescription: ''
    })
    evt.preventDefault()
  }

  handleCreateNewHeaderValue (evt, headerName) {
    let value = this.state.inputValue
    let description = this.state.inputDescription
    if (value && description) {
      this.getHeaderByName(headerName).values.push({ value, description })
      this.setState({isCreatingNewHeaderValue: false, inputValue: '', inputDescription: ''})
    }
  }

  removeValue (headerName, headerValue) {
    var header = this.getHeaderByName(headerName)
    var index = header.values.map(function (h) { return h.value }).indexOf(headerValue)
    if (index > -1) {
      header.values.splice(index, 1)
    }

    this.setState({
      customizableHeaders: this.state.customizableHeaders
    })
  }

  handleValueChange (event) {
    this.setState({inputValue: event.target.value})
  }

  handleDescriptionChange (event) {
    this.setState({inputDescription: event.target.value})
  }

  getHeaderByName (name) {
    var header = null
    var index = this.state.customizableHeaders.map(function (h) { return h.name }).indexOf(name)
    if (index > -1) {
      header = this.state.customizableHeaders[index]
    }
    return header
  }

  getCopyOfOriginalHeaderByName (name) {
    var header = null
    var index = this.state.originalCustomizableHeaders.map(function (h) { return h.name }).indexOf(name)
    if (index > -1) {
      header = this.state.originalCustomizableHeaders[index]
    }
    return JSON.parse(JSON.stringify(header))
  }

  renderHeader (header) {
    return (
      <div>
        <h4>Header {header.name}
          {!this.state.isCreatingNewHeaderValue && (
            <small>
              <a href='#' onClick={this.handleStartCreatingNewHeaderValue}>add</a> | &nbsp;
              <a href='#' onClick={(e) => this.handleResetNewHeaderValue(e, header)}>reset to default</a>
            </small>)}
        </h4>
        <p>Here you can manage the {header.name} available values:</p>

        <List id='header-x-list'>
          {(header.values).map(headerItem =>
            <List.Item key={headerItem.value}>
              <Label>{headerItem.value}</Label>&nbsp;
              <code>{headerItem.description}</code>
              <List.Content floated='right'>
                <Popup trigger={<Button onClick={(e) => this.removeValue(header.name, headerItem.value)}><Icon style={{ margin: 0 }} name='remove' /></Button>} content='Remove this header value' />
              </List.Content>
            </List.Item>)}
        </List>

        {this.state.isCreatingNewHeaderValue && <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='2'>Add new value</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell><Input autoFocus type='text' placeholder='Value' value={this.state.inputValue} onChange={this.handleValueChange} error={!this.state.inputValue} style={{width: '100%'}} /></Table.Cell>
              <Table.Cell><Input type='text' placeholder='Description' value={this.state.inputDescription} onChange={this.handleDescriptionChange} error={!this.state.inputDescription} style={{width: '100%'}} /></Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='2'>
                <Button onClick={() => this.handleCreateNewHeaderValue(this, header.name)} floated='right' icon labelPosition='left' primary size='small'>
                  <Icon name='save' /> Save
                </Button>
                <Button onClick={this.handleCancelCreatingNewHeaderValue} floated='right' icon labelPosition='left' primary size='small'>
                  <Icon name='cancel' /> Cancel
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>}
      </div>
    )
  }

  getHeaderPanes () {
    const headerPanes = []
    this.state.customizableHeaders.map(header => headerPanes.push({ menuItem: header.name, render: () => <Tab.Pane>{this.renderHeader(header)}</Tab.Pane> }))
    return headerPanes
  }

  render () {
    const headerPanes = this.getHeaderPanes()
    return (
      <div style={{ marginTop: '10px' }}>
        <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={headerPanes} />
      </div>
    )
  }
}

export default ManageHeadersSettings
