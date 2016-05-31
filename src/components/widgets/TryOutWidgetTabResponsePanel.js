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

import { selectedOperation } from '../../actions/loadActionCreators'

/* import '../../vendor/codemirror/codemirror-mode-links'
import '../../vendor/codemirror/codemirror-extension-foldall'*/

import HATEOASInfoExtractor from './HATEOASInfoExtractor'

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

  componentDidMount () {
    const elem = this.refs.codemirror

    this.editor = CodeMirror.fromTextArea(elem, { mode: this.props.response.requestFormat })
    this.editor.focus()

    this.addHATEOASLinks(this.editor)

    if (this.props.response && this.props.response.data && this.props.response.data !== '') {
      this.props.response.data = this.props.response.data.replace('\\"', '\"')
    }
  }

  componentDidUpdate () {
    this.editor.setValue(this.getIndentedJson())
    this.editor.refresh()
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

  addHATEOASLinks (editor) {
    let tthis = this
    const hateoasLinks = HATEOASInfoExtractor.getLinksFor(editor.getValue(), this.props.operations.toJS())
    hateoasLinks.forEach(addWidgetToEditor)

    function addWidgetToEditor (widgetInfo) {
      const width = widgetInfo.line.match(/^\s*/)[0].length // length of the initial whitespaces
      var elem = window.$(`
        <span>
          <span style='font-size: inherit; display:inline-block; width:${width}ch'></span>
          <span style='font-size: 80%'>
            <span class='label label-info' style='position: relative; top:-1px'>HYPERMEDIA</span>
            <a class='open-link'    href='${widgetInfo.href}' target='_blank' >Open link</a> |
            <a class='copy-link'    href='#' data-clipboard-text='${widgetInfo.href}' >Copy link</a>
            <span class='explore-link-container'> |
              <a class='explore-link' href='#' >Explore link</a>
              <small class="text-muted"><em>(${widgetInfo.operationSummary})</em></small>
            </span>
          </span>
        </span>`)

      if (!widgetInfo.operationId) {
        elem.find('span.explore-link-container').hide()
      } else {
        elem.find('a.explore-link')
            .attr('href', `/operation/${widgetInfo.operationId}/try-it`)
            .click(evt => {
              evt.preventDefault()
              const { store: { dispatch }, history } = tthis.context
              history.pushState(null, `/operation/${widgetInfo.operationId}/try-it`)
              dispatch(selectedOperation(widgetInfo.operationId))
            })
      }

      editor.addLineWidget(widgetInfo.lineNo - 1, elem[0], { coverGutter: false, noHScroll: false })
    }
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
  operations: PropTypes.object
}

TryOutWidgetTabResponsePanel.contextTypes = {
  store: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
}

export default TryOutWidgetTabResponsePanel
