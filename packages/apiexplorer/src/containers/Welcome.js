import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import marked from 'marked'
import { ExplorerHeader } from '../components'
import { Segment, Table } from 'semantic-ui-react'
import Enumerable from 'linq'

class Welcome extends Component {

  render () {
    const apisArray = this.props.apis.get('byOrder').map(a => this.props.apis.get('byName').get(a)).toArray()
    return (
      <div>
        {apisArray.map(api => this.renderSingleAPIContent(api))}
      </div>
    )
  }

  renderSingleAPIContent (api) {
    if (!api) return

    const { title, description, version } = api.info
    return (
      <div key={title}>
        <ExplorerHeader api={{ apiName: title, apiVersion: version, productVersion: version }} />
        <p dangerouslySetInnerHTML={this.getHtmlDescription(description)} />
        {this.renderSummary(api)}
      </div>
    )
  }

  renderSummary (api) {
    let paths = Object.keys(api.paths).map(path => Object.keys(api.paths[path]).map(method => ({
      method: method,
      path: path,
      operation: api.paths[path][method]
    }))).reduce((prev, curr) => prev.concat(curr), [])

    let pathsByTags = Enumerable.from(paths).groupBy(p => p.operation.tags ? p.operation.tags[0] : '')

    return pathsByTags.select(g => {
      let key = g.key()
      let tag = api.tags.find(t => t.name === key) || { }

      return <Segment key={key}>
        <h4>{tag.description}</h4>
        <Table tableData={g} basic compact striped>
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
      </Segment>
      }
    ).toArray()
  }

  renderSummaryRow (resource, idx) {
    return (
      <Table.Row key={idx}>
        <Table.Cell content={resource.method} />
        <Table.Cell content={`${resource.method.toUpperCase()} ${resource.path}`} />
        <Table.Cell content={resource.operation.summary} />
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
      apis: state.apis
    }
  }
)(Welcome)
