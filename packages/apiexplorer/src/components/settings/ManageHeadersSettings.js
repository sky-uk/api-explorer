import React, { Component } from 'react'
/* import { setHeaderConfigs } from '../../actions/loadActionCreators' */
import { Input, Tab, Button, Popup, Table, Icon, List, Label } from 'semantic-ui-react'

class ManageHeadersSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      headers: [
        {
          name: 'Sky-OTT-Country',
          values: [
            {value: 'GB', description: 'United Kingdom'},
            {value: 'DE', description: 'Germany'},
            {value: 'IE', description: 'Ireland'},
            {value: 'AT', description: 'Austria'}
          ]
        },
        {
          name: 'Sky-OTT-Proposition',
          values: [
            {value: 'STORE', description: 'Sky Store'},
            {value: 'NOWTV', description: 'Now TV'}
          ]
        }
      ],
      isCreatingNewHeaderValue: false
    }

    this.handleStartCreatingNewHeaderValue = this.handleStartCreatingNewHeaderValue.bind(this)
    this.handleCancelCreatingNewHeaderValue = this.handleCancelCreatingNewHeaderValue.bind(this)
    this.handleResetNewHeaderValue = this.handleResetNewHeaderValue.bind(this)
    this.handleCreateNewHeaderValue = this.handleCreateNewHeaderValue.bind(this)
  }

  componentDidMount () { /* DevicesStore.addChangeListener(this.handleStoreUpdate) */ }
  componentWillUnmount () { /* DevicesStore.removeChangeListener(this.handleStoreUpdate) */ }

  handleStartCreatingNewHeaderValue (evt) { this.setState({isCreatingNewHeaderValue: true}/*, () => React.findDOMNode(this.refs.headervalue).focus() */); evt.preventDefault() }
  handleCancelCreatingNewHeaderValue (evt) { this.setState({isCreatingNewHeaderValue: false}); evt.preventDefault() }
  handleResetNewHeaderValue (evt) { /* DevicesStore.reset(); */ evt.preventDefault() }
  handleCreateNewHeaderValue (evt) {
    // let value = React.findDOMNode(this.refs.headervalue).value
    // let value = React.findDOMNode(this.refs.headerdescription).value
    /* DevicesStore.addHeaderValue(value) */
    evt.preventDefault()
  }

  renderHeader (header) {
    return (
      <div>
        <h4>Header {header.name}
          {!this.state.isCreatingNewHeaderValue &&
            <small> (
              <a href='#' onClick={this.handleStartCreatingNewHeaderValue}>add</a> | &nbsp;
              <a href='#' onClick={this.handleResetNewHeaderValue}>reset to default</a>
            )</small>}
        </h4>
        <p>Here you can manage the {header.name} available values:</p>

        <List id='header-x-list'>
          {(header.values).map(headerItem =>
            <List.Item key={headerItem.value}>
              <Label>{headerItem.value}</Label>&nbsp;
              <code>{headerItem.description}</code>
              <List.Content floated='right'>
                <Popup trigger={<Button><Icon style={{ margin: 0 }} name='remove' onClick={(evt) => /* DevicesStore.removeDevice(header.key) */ evt.preventDefault()} /></Button>} content='Remove this header value' />
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
              <Table.Cell><Input ref='headervalue' placeholder='Value' style={{width: '100%'}} /></Table.Cell>
              <Table.Cell><Input ref='headerDescription' placeholder='Description' style={{width: '100%'}} /></Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='2'>
                <Button onClick={this.handleCreateNewHeaderValue} floated='right' icon labelPosition='left' primary size='small'>
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
    this.state.headers.map(header => headerPanes.push({ menuItem: header.name, render: () => <Tab.Pane>{this.renderHeader(header)}</Tab.Pane> }))
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
