import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Controlled as CodeMirror } from 'react-codemirror2'
import Styled from 'styled-components'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

import 'codemirror/addon/display/fullscreen'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'
import 'codemirror/addon/mode/overlay'
import 'codemirror/addon/display/fullscreen.css'

import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/comment-fold'

import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'

class SpecViewer extends Component {
  render () {
    let options = {
      mode: 'application/json',
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      lineWrapping: true,
      foldGutter: true,
      theme: 'material',
      readOnly: true,
      extraKeys: {
        // Fullscreen
        'F11': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
        'Ctrl-M': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
        'Cmd-M': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
        'Esc': cm => cm.getOption('fullScreen') && cm.setOption('fullScreen', false),
        // Code Folding
        'Ctrl-Y': cm => cm.foldAll(),
        'Cmd-Y': cm => cm.foldAll(),
        'Ctrl-Alt-Y': cm => cm.unfoldAll(),
        'Shift-Ctrl-Y': cm => cm.unfoldAll(),
        'Cmd-Shift-Y': cm => cm.unFoldAll(),
        'Ctrl-U': cm => cm.foldCode(cm.getCursor()),
        'Cmd-U': cm => cm.foldCode(cm.getCursor())
      }
    }

    const apiSlug = this.props.match.params.apiSlug
    const apiName = this.props.apis.get('bySlug').get(apiSlug)

    const apiInfo = this.props.apis.get('byName').get(apiName)
    const apiSpec = JSON.stringify(apiInfo, null, 2)

    return (
      <SpecViewerContainer>
        <h2>Spec Viewer</h2>
        <h3>{ apiName }</h3>
        <p>View the original spec as seen by API Explorer</p>
        <CodeMirror value={apiSpec} options={options} className="specViewer" />
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
