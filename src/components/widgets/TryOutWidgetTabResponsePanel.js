import React, { Component, PropTypes } from 'react'

import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'

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

/* import '../../vendor/codemirror/codemirror-mode-links'
import '../../vendor/codemirror/codemirror-extension-foldall'*/

class TryOutWidgetTabResponsePanel extends Component {
  constructor () {
    super()

    CodeMirror.defaults.lineNumbers = true
    CodeMirror.defaults.matchBrackets = true
    CodeMirror.defaults.styleActiveLine = true
    CodeMirror.defaults.lineWrapping = false
    CodeMirror.defaults.foldGutter = true
    CodeMirror.defaults.readOnly = true

    CodeMirror.defaults.extraKeys = {
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

    CodeMirror.defaults.gutters = ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
  }

  applyPlugins () {
    console.log(this.props)
    APIExplorer.plugins
      .filter(p => p.decorateEditor)
      .forEach(p => p.decorateEditor(
        this.editor,
        {
          operations: this.props.operations.toJS(),
          apis: this.props.apis,
          history: this.context.history
        },
        this.editor.getValue()))
  }

  componentDidMount () {
    const elem = this.refs.codemirror

    this.editor = CodeMirror.fromTextArea(elem, { mode: this.props.response.contentType })
    this.editor.focus()
    this.applyPlugins()
    if (this.props.response && this.props.response.data && this.props.response.data !== '') {
      this.props.response.data = this.props.response.data.replace('\\"', '\"')
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.response.data === this.props.response.data) {
      console.log('skipping did update')
      return
    }
    this.editor.setValue(this.getIndentedJson())
    this.applyPlugins()
    this.editor.refresh()
    console.log('did update')
  }

  getIndentedJson () {
    let data = this.props.response.data
    if (this.props.response.requestFormat.indexOf('json') > 0) {
      try {
        data = JSON.stringify(JSON.parse(data), null, 2)
      } catch (e) {
        console.warn('Invalid json returned in the response')
        data = e.message + '\n' + data
      }
    }

    return data
  }

  render () {
    let data = this.getIndentedJson()
    return (
      <div>
        <textarea className='col-md-12 codemirror-response' ref='codemirror' value={data} readOnly />
        <small className='text-muted'>
          <strong>Fullscreen: </strong>Press <mark>F11</mark> or <mark>Ctrl-M</mark> to enter fullscreen. Press ESC to exit.&nbsp;
          <strong>Search: </strong>To start search use <mark>Ctrl-F</mark>, and to find next use <mark>Ctrl-G</mark>.&nbsp;
          <strong>Fold: </strong>To fold all lines press <mark>Ctrl-Y</mark>, and <mark>Ctrl-Alt-Y</mark> to unfold.&nbsp;
          <em>Note that in OSX you should use Cmd instead of Ctrl.</em>
        </small>
        <br/>
      </div>
    )
  }
}

TryOutWidgetTabResponsePanel.propTypes = {
  response: PropTypes.object,
  operations: PropTypes.object,
  apis: PropTypes.object
}

TryOutWidgetTabResponsePanel.contextTypes = {
  store: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
}

export default TryOutWidgetTabResponsePanel
