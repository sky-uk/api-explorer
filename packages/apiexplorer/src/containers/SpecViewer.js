import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Controlled as CodeMirror } from 'react-codemirror2'
import Styled from 'styled-components'

class SpecViewer extends Component {
  render () {
    const editorOptions = Object.assign({
      mode: 'application/json',
      readOnly: true
    }, APIExplorer.editor.options)

    const apiSlug = this.props.match.params.apiSlug
    const apiName = this.props.apis.get('bySlug').get(apiSlug)

    const apiInfo = this.props.apis.get('byName').get(apiName)
    const apiSpec = JSON.stringify(apiInfo, null, 2)

    return (
      <SpecViewerContainer>
        <h2>Spec Viewer</h2>
        <h3>{ apiName }</h3>
        <p>View the original spec as seen by API Explorer</p>
        <CodeMirror value={apiSpec} options={editorOptions} className="specViewer" />
      </SpecViewerContainer>
    )
  }
}

const SpecViewerContainer = Styled.div`
  .specViewer .CodeMirror {
    height: 800px;
  }
`

export default connect(
  state => {
    return {
      apis: state.apis
    }
  }
)(SpecViewer)
