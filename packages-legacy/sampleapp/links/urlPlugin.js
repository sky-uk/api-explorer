import esprima from 'esprima'

function isUrl (value) {
  return typeof value === 'string' && value.startsWith('http')
}

function transverseObject (obj) {
  let links = []

  // iterate object properties
  for (let prop of obj.properties) {
    if (isUrl(prop.value.value)) {
      links.push({
        url: prop.value.value,
        loc: prop.loc
      })
    }

    if (prop.value.hasOwnProperty('elements')) {
      links = links.concat(transverseArray(prop.value))
    }
  }

  return links
}

function transverseArray (arr) {
  let links = []

  // iterate array elements
  for (let elem of arr.elements || []) {
    if (elem.hasOwnProperty('properties')) {
      links = links.concat(transverseObject(elem))
    } else if (isUrl(elem.value)) {
      links.push({
        url: elem.value,
        loc: elem.loc
      })
    }
  }

  return links
}

function createLinksMetadata (reprAst) {
  let links = []

  if (reprAst.hasOwnProperty('elements')) {
    links = links.concat(transverseArray(reprAst))
  }

  return links
}

function addWidgetToEditor (editor, link, op) {
  const width = link.loc.start.column // length of the initial whitespaces
  var elem = window.$(`
        <span>
          <span style='font-size: inherit; display:inline-block; width:${width}ch'></span>
          <span style='font-size: 80%'>
            <a class='open-link' href='${op.href}' target='_blank'><i class="fa fa-external-link"></i> Open Link</a>
          </span>
        </span>`)

  editor.addLineWidget(link.loc.start.line - 1, elem[0], { coverGutter: false, noHScroll: false })
}

export default {
  key: 'addUrlLinks',
  name: 'addUrlLinks',
  decorateEditor: (cm, { operations, apis, history }, repr) => {
    const toParse = 'var json=' + repr
    const ast = esprima.parse(toParse, { loc: true })
    const reprAst = ast.body[0].declarations[0].init

    const links = createLinksMetadata(reprAst)

    for (let link of links) {
      addWidgetToEditor(cm, link, {
        href: link.url
      })
    }
  }
}
