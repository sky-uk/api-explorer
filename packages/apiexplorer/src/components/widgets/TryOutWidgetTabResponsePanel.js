/* global APIExplorer */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Controlled as CodeMirror } from 'react-codemirror2'

class TryOutWidgetTabResponsePanel extends Component {
  constructor () {
    super()
    this.editor = null
  }

  applyPlugins () {
    if (!APIExplorer.plugins) return

    APIExplorer.plugins
      .filter(p => p.decorateEditor)
      .forEach(p => p.decorateEditor(
        this.editor,
        {
          operations: this.props.operations.toJS(),
          apis: this.props.apis,
          history: this.context.router.history
        },
        this.editor.getValue()))
  }

  componentDidMount () {
    this.applyPlugins()
    if (this.props.response && this.props.response.data && this.props.response.data !== '') {
      this.props.response.data = this.props.response.data.replace('\\"', '"')
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.response.data === this.props.response.data) {
      return
    }
    this.applyPlugins()
  }

  getIndentedJson () {
    let data = this.props.response.data

    if (!data || data === '') {
      return ''
    }

    if (this.props.response.contentType && this.props.response.contentType.indexOf('json') > 0) {
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

    const editorOptions = Object.assign({
      mode: this.props.response.contentType,
      readOnly: true
    }, APIExplorer.editor.options)

    return (
      <div>
        <CodeMirror
          value={data}
          options={editorOptions}
          onBeforeChange={(editor, data, newValue) => this.editor.setValue(newValue) }
          onChange={(editor, data, newValue) => this.editor.setValue(newValue) }
          editorDidMount={editor => { this.editor = editor }}
        />

        <small style={{ display: 'block', margin: '1em 0' }} className='text-muted'>
          <strong>Fullscreen: </strong>Press <mark>F11</mark> or <mark>Ctrl-M</mark> to enter fullscreen. Press ESC to exit.&nbsp;
          <strong>Search: </strong>To start search use <mark>Ctrl-F</mark>, and to find next use <mark>Ctrl-G</mark>.&nbsp;
          <strong>Fold: </strong>To fold all lines press <mark>Ctrl-Y</mark>, and <mark>Ctrl-Alt-Y</mark> to unfold.&nbsp;
          <em>Note that in OSX you should use Cmd instead of Ctrl.</em>
        </small>
      </div>
    )
  }
}

TryOutWidgetTabResponsePanel.propTypes = {
  response: PropTypes.object,
  operations: PropTypes.object,
  apis: PropTypes.object
}

export default TryOutWidgetTabResponsePanel
