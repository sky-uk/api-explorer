import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import marked from 'marked'
import { ExplorerHeader } from '../components'
import { Segment, Table } from 'semantic-ui-react'
import Enumerable from 'linq'

class Welcome extends Component {

  render () {
    const apisArray = this.props.apis.get('byOrder').map(name => ({
      apiname: name,
      spec: this.props.apis.get('byName').get(name),
    })).toArray()
    return (
      <div>
        {apisArray.map(this.renderSingleAPIContent)}
      </div>
    )
  }

  renderSingleAPIContent = (apiInfo) => {
    if (!apiInfo) return
    const { title, description, version } = apiInfo.spec.info
    return (
      <div key={title}>
        <ExplorerHeader api={{ apiName: title, apiVersion: version, productVersion: version }} />
        <p dangerouslySetInnerHTML={this.getHtmlDescription(description)} />
        {this.renderSummary(apiInfo)}
      </div>
    )
  }

  renderSummary (apiInfo) {
    const api = apiInfo.spec
    const apiOperations = this.props.operations.filter(o => o.get('apiname') === apiInfo.apiname).map(o => o.get('spec')).toArray()
    let pathsByTags = Enumerable.from(apiOperations).groupBy(o => o.tags ? o.tags[0] : '')

    return pathsByTags.select(g => {
      let key = g.key()
      const tag = this.props.apis.get('byName').get(apiInfo.apiname).tags.find(t => t.name === key)

      return <Segment key={key}>
        <h4>{tag.description}</h4>
        <Table compact striped columns='three'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell content= 'Operation' />
              <Table.HeaderCell content= 'HTTP Request' />
              <Table.HeaderCell content= 'Description' />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {g.select(this.renderSummaryRow).toArray()}
          </Table.Body>
        </Table>
        <br />
      </Segment>
      }
    ).toArray()
  }

  renderSummaryRow (operation) {
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

  getHtmlDescription (description) {
    return { __html: marked(description || '') }
  }
}

// Welcome.propTypes = {
//   children: PropTypes.element,
//   apis: PropTypes.object.isRequired
// }

export default connect(
  state => {
    return {
      apis: state.apis,
      operations: state.operations
    }
  }
)(Welcome)
