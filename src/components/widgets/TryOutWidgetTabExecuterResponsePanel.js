import React, { Component, PropTypes } from 'react'

import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'

import 'codemirror/addon/display/fullScreen'
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

  render () {
    if (this.props.response && this.props.response.data && this.props.response.data !== '') {
      const textCropStyles = {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        width: '100%',
        overflow: 'hidden'
      }

      const url = this.props.response.url

      return (
          <div className='panel-body'>
            <a href={url} target='_blank' title={url} style={textCropStyles}>{url}</a>
            <textarea className='col-md-12 codemirror-response' ref='codemirror' defaultValue={this.props.response.data} />
          </div>
      )
    } else {
      return <div />
    }
  }

  componentDidUpdate () {
    const elem = this.refs.codemirror
    if (elem) {
      CodeMirror.fromTextArea(elem)
    }
  }
}

TryOutWidgetTabExecuterResponsePanel.propTypes = {
  response: PropTypes.object
}

export default TryOutWidgetTabExecuterResponsePanel
