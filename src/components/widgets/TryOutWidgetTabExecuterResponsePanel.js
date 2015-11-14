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

class TryOutWidgetTabExecuterResponsePanel extends Component {
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

  componentDidMount () {
    const elem = this.refs.codemirror
    CodeMirror.fromTextArea(elem)

    CodeMirror.defaults.mode = this.props.response.requestFormat.indexOf('json') > 0 ? 'linksJS' : 'linksXML'

    if (this.props.response && this.props.response.data && this.props.response.data !== '') {
      this.props.response.data = this.props.response.data.replace('\\"', '\"')
    }
  }

  render () {
    return (
      <div>
        <textarea className='col-md-12 codemirror-response' ref='codemirror' defaultValue={this.props.response.data} />
        <small className='text-muted'>
          <strong>Fullscreen: </strong>Press <mark>F11</mark> or <mark>Ctrl-M</mark> to enter fullscreen. Press ESC to exit.&nbsp;
          <strong>Search: </strong>To start search use <mark>Ctrl-F</mark>, and to find next use <mark>Ctrl-G</mark>.&nbsp;
          <strong>Fold: </strong>: To fold all lines press <mark>Ctrl-Y</mark>, and <mark>Ctrl-Alt-Y</mark> to unfold.&nbsp;
          <em>Note that in OSX you should use Cmd instead of Ctrl.</em>
        </small>
        <br/>
      </div>
    )
  }
}

TryOutWidgetTabExecuterResponsePanel.propTypes = {
  response: PropTypes.object
}

export default TryOutWidgetTabExecuterResponsePanel
