import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ExplorerHeader } from 'components'
import marked from 'marked'

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
      </div>
    )
  }

  getHtmlDescription (description) {
    return { __html: marked(description || '') }
  }
}

Welcome.propTypes = {
  children: PropTypes.element,
  apis: PropTypes.object.isRequired
}

export default connect(
  state => {
    return {
      apis: state.apis
    }
  }
)(Welcome)
