
export default {
  key: 'addHATEOASLinks',
  name: 'addHATEOASLinks',
  decorateEditor: (cm, { operations, apis, history }, repr) => {
    addHATEOASLinks(cm, apis, operations, history)
  }
}

function addHATEOASLinks (editor, apis, operations, history) {
  const hateoasLinks = getLinksFor(editor.getValue(), apis, operations)
  hateoasLinks.forEach(addWidgetToEditor)

  // this.setState({hateoasLinks: hateoasLinks})

  function addWidgetToEditor (widgetInfo) {
    const width = widgetInfo.line.indexOf('"')

    var hateoasLinkObj = document.createElement('span')
    hateoasLinkObj.innerHTML =
      `
      <span style='font-size: inherit; display:inline-block; width:${width}ch'></span>
       <span style='font-size: 80%'>
        <span class='label label-info' style='position: relative; top:-1px'>HATEOAS</span>
        <a class='open-link'    href='${widgetInfo.href}' target='_blank' >Open link</a> |
        <a class='copy-link'    href='#' data-clipboard-text='${widgetInfo.href}' >Copy link</a> |
        <a class='explore-link' href='#' >Explore link</a>
        <small class="text-muted"><em>(${widgetInfo.operationSummary})</em></small>
      </span>`

    editor.addLineWidget(widgetInfo.lineNo - 1, hateoasLinkObj, { coverGutter: false, noHScroll: false })

    // new ZeroClipboard(elem.find("a.copy-link"))

    const operationSpec = operations.filter(op => op.spec.operationId === widgetInfo.operationId)[0].spec
    const href = APIExplorer.LinkGenerator.toOperation(operationSpec, widgetInfo.pathParameters)
    let exploreLink = hateoasLinkObj.querySelector('a.explore-link')
    exploreLink.setAttribute('href', href)
    exploreLink.addEventListener('click', exploreClick, false)

    function exploreClick (evt) {
      history.push(href, null)
      evt.preventDefault()
    }
  }
}

function getLinksFor (text, apis, operations) {
  if (text.charAt(0) === '{') return getJSONLinksFor(text, apis, operations)
  else if (text.indexOf('<?xml') === 0) return getXMLLinksFor(text, apis, operations)
  throw new Error('TEXT FORMAT NOT SUPPORTED: ', text.substring(0, 20), '...')
}

function getXMLLinksFor (text, apis, operations) {
  throw new Error('XML LINKS LOADER NOT IMPLEMENTED')
}

function getJSONLinksFor (text, apis, operations) {
  const linkRegEx = /^\s+"href":\s+"([^"]*)",/i
  const lines = text.split('\n')
  return getLinks(linkRegEx).map(toHATEOASInfo).filter(info => info.valid)

  function getLinks (linkMatcher) {
    return lines.map((line, lineIdx) => { return { line, lineIdx, lineNo: lineIdx } })
      .filter(lineInfo => linkMatcher.test(lineInfo.line))
  }

  function toHATEOASInfo (lineInfo) {
    const href = linkRegEx.exec(lineInfo.line)[1]
    var info = {
      valid: false,
      line: lineInfo.line,
      lineNo: lineInfo.lineNo,

      href: href,
      rel: '',
      method: 'GET',

      operationId: 0,
      operationSummary: '',
      pathParameters: [],
      bodyParameter: '',
      bodyContentType: 'json'
    }

    try {
      info.rel = /rel": "([^"]+)"/g.exec(lines[lineInfo.lineIdx - 1])[1]
      info.method = /method": "(GET|POST|DELETE|PUT|PATCH)"/g.exec(lines[lineInfo.lineIdx + 2])[1]

      let linkLines = [
        lines[lineInfo.lineIdx - 1], // rel
        lines[lineInfo.lineIdx], // href
        lines[lineInfo.lineIdx + 2] // method
      ]
      let idx = lineInfo.lineIdx + 2
      let linkMustacheCount = 1
      let parametersMustacheCount = 0
      let containsParameters = false
      let firstParametersLine

      do {
        const line = lines[idx++]
        linkLines.push(line)
        const openMustacheCount = (line.match(/\{/g) || []).length
        const closeMustacheCount = (line.match(/\}/g) || []).length

        linkMustacheCount += openMustacheCount
        linkMustacheCount -= closeMustacheCount

        const parametersIndex = line.indexOf('\'parameters\': {')
        if (parametersIndex !== -1) {
          containsParameters = true
          firstParametersLine = true
          parametersMustacheCount = 1
          info.bodyParameter = '{' + '%0A'
        }
        if (parametersMustacheCount > 0 && containsParameters && !firstParametersLine) {
          parametersMustacheCount += openMustacheCount
          parametersMustacheCount -= closeMustacheCount
          const lineToAdd = '  '.repeat(parametersMustacheCount) + line.replace(/^\s+/, '')
          if (parametersMustacheCount === 0) {
            info.bodyParameter += lineToAdd.replace(/,\s+$/, '')
          } else {
            info.bodyParameter += lineToAdd + '%0A'
          }
        }
        firstParametersLine = false
      }
      while (linkMustacheCount !== 0)

      const findOperationParams = { method: info.method, postBody: info.bodyParameter, bodyType: info.bodyContentType }
      var matchedOperation = findOperation(operations, href, findOperationParams)
      info.operationId = matchedOperation.id
      info.operationSummary = matchedOperation.summary
      info.pathParameters = matchedOperation.params
    } catch (err) {
      return info /* ignore parsing error */
    }

    info.valid = true
    return info
  }
}

function findOperation (operations, url, params) {
  var results = []
  for (var i = 0; i < operations.length; ++i) {
    var op = operations[i].spec
    if (op.httpMethod.toUpperCase() !== params.method.toUpperCase()) {
      continue
    }

    // Replace operation path url parameter name with \. and store name/index pair since javascript doesn't suppport named groups..
    // We use this later on to build pathParams object.
    var pathNames = []
    var regex = op.url.replace(/{\w+}/g, function (val) {
      var value = val.replace('{","').replace('}","')
      pathNames.push(value)
      return '(.*)'
    })

    if (regex.endsWith('(.*)')) {
      regex = regex.substring(0, regex.lastIndexOf('(.*)')) + '?([^/?]*)'
    }
    regex = RegExp(regex)
    var matches = url.match(regex)

    if (matches) {
      var requestParameters = []
      matches.slice(1).forEach((m, i) => requestParameters.push({ name: pathNames[i], value: m }))

      var splitUrl = url.split('?')
      if (splitUrl.length > 1) {
        splitUrl[1].split('&').forEach((item) => { var parts = item.split('='); requestParameters.push({name: parts[0], value: parts.length > 1 ? parts[1].replace('+', ' ') : ''}) })
      }

      if (params.postBody) {
        requestParameters.push({ name: 'body', value: params.postBody, bodyType: params.bodyType })
      }

      results.push({ id: op.operationId, summary: op.summary, params: requestParameters })
    }
  }

  if (results.length === 0) return null
  if (results.length === 1) return results[0]

  // If we have multiple results choose the one with most parameters
  results = results.sort((a, b) => b.params.length - a.params.length)
  console.log(`INFO: Multiple operations found for '${url}'. Was selected the operation with most parameters: '${results[0].id}'.`)
  return results[0]
}
