import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import marked from 'marked'
import { ExplorerHeader } from '../components'
import { Segment, Table } from 'semantic-ui-react'
import Enumerable from 'linq'

const mapStateToProps = state => {
  return {
    apis: state.apis,
    operations: state.operations
  }
}
class Welcome extends Component {
  render () {
    const apisArray = this.props.apis.get('byOrder').map(name => ({
      apiname: name,
      spec: this.props.apis.get('byName').get(name)
    })).toArray()
    return (
      <div>
        {apisArray.map(this.renderSingleAPIContent)}
      </div>
    )
  }

  renderSingleAPIContent = (apiInfo) => {
    if (!apiInfo) return
    const apiConfiguration = APIExplorer.apiConfigurations.find(c => c.friendlyName === apiInfo.apiname)
    return (
      <div key={apiInfo.apiname}>
        {this.renderTitle(apiInfo)}
        {apiConfiguration.welcome.displaySummary && this.renderDescription(apiInfo)}
        {apiConfiguration.welcome.listOperations && this.renderSummary(apiInfo)}
      </div>
    )
  }

  renderTitle = (apiInfo) => {
    const { title, version } = apiInfo.spec.info
    return <ExplorerHeader api={{ apiName: title, apiVersion: version, productVersion: version }} />
  }

  renderDescription = (apiInfo) => {
    return <p dangerouslySetInnerHTML={this.getHtmlDescription(apiInfo.spec.info.description)} />
  }

  renderSummary = (apiInfo) => {
    const apiOperations = this.props.operations.filter(o => o.get('apiname') === apiInfo.apiname).map(o => o.get('spec')).toArray()
    let pathsByTags = Enumerable.from(apiOperations).groupBy(o => o.tags ? o.tags[0] : '')

    return pathsByTags.select(g => {
      let key = g.key()
      const api = this.props.apis.get('byName').get(apiInfo.apiname)
      const tagDescription = api.hasOwnProperty('tags') ? api.tags.find(t => t.name === key).description : key

      return <Segment key={key}>
        <h4>{tagDescription}</h4>
        <Table compact striped columns='three'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell content='Operation' />
              <Table.HeaderCell content='HTTP Request' />
              <Table.HeaderCell content='Description' />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {g.select(this.renderSummaryRow).toArray()}
          </Table.Body>
        </Table>
        <br />
      </Segment>
    }).toArray()
  }

  renderSummaryRow = (operation) => {
    const url = APIExplorer.LinkGenerator.toOperation(operation)
    return (
      <Table.Row key={operation.httpMethod + operation.url}>
        <Table.Cell>
          <Link to={url} >{operation.httpMethod}</Link>
        </Table.Cell>
        <Table.Cell><code>{`${operation.httpMethod.toUpperCase()} ${operation.url}`}</code></Table.Cell>
        <Table.Cell content={operation.summary} />
      </Table.Row>
    )
  }

  getHtmlDescription = (description) => {
    return { __html: marked(description || '') }
  }
}

export default connect(mapStateToProps)(Welcome)
