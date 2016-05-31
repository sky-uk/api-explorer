import esprima from 'esprima'

function createLinksMetadata (reprAst) {
  const links = []

  for (let elem of reprAst.elements) {
    let idProp = elem.properties.filter(p => p.key.value === 'id')[0]
    links.push({
      id: idProp.value.value,
      loc: idProp.loc
    })
  }
  return links
}

function addWidgetToEditor (editor, link, op) {
  const width = link.loc.start.column// length of the initial whitespaces
  var elem = window.$(`
        <span>
          <span style='font-size: inherit; display:inline-block; width:${width}ch'></span>
          <span style='font-size: 80%'>
            <span class='label label-info' style='position: relative; top:-1px'>LINK</span>
            <a class='open-link'    href='${op.href}' target='_blank' >Open link</a>
          </span>
        </span>`)

  editor.addLineWidget(link.loc.start.line - 1, elem[0], { coverGutter: false, noHScroll: false })
}

export default {
  key: 'addLinksToPetShop',
  name: 'addLinksToPetShop',
  decorateEditor: (cm, {operations, apis}, repr) => {
    const toParse = 'var json=' + repr
    const ast = esprima.parse(toParse, {
      loc: true
    })
    const reprAst = ast.body[0].declarations[0].init
    const links = createLinksMetadata(reprAst)
    const petStore = apis
    const host = petStore.host
    const basePath = petStore.basePath
    const scheme = petStore.schemes[0]
    const path = operations.filter(op => op.spec.operationId === 'getPetById')[0].spec.url
    const templ = `${scheme}://${host}${basePath}${path}`
    for (let link of links) {
      addWidgetToEditor(cm, link, {
        href: templ.replace('{petId}', link.id)
      })
    }
  }
}
