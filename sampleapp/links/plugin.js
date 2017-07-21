import esprima from 'esprima'

function createLinksMetadata (reprAst) {
  const links = []

  for (let elem of reprAst.elements || []) {
    let idProp = elem.properties.filter(p => p.key.value === 'id')[0]
    links.push({
      id: idProp.value.value,
      loc: idProp.loc
    })
  }
  return links
}

function addWidgetToEditor (editor, link, op) {
  const width = link.loc.start.column // length of the initial whitespaces
  var elem = window.$(`
        <span>
          <span style='font-size: inherit; display:inline-block; width:${width}ch'></span>
          <span style='font-size: 80%'>
            <span class='label label-info' style='position: relative; top:-1px'>LINK</span>
            <a class='open-link' href='${op.href}' target='_blank' >Open link</a> |
            <a class='explore-link' href='${op.exploreLink}' target='_blank' >Explore link</a>
            <span class='text-muted'><em>${op.summary}</em></span>
          </span>
        </span>`)

  elem.find('a.explore-link').click(op.handleExploreLinkClick)

  editor.addLineWidget(link.loc.start.line - 1, elem[0], { coverGutter: false, noHScroll: false })
}

export default {
  key: 'addLinksToPetShop',
  name: 'addLinksToPetShop',
  decorateEditor: (cm, { operations, apis, history }, repr) => {
    const toParse = 'var json=' + repr
    const ast = esprima.parse(toParse, { loc: true })
    const reprAst = ast.body[0].declarations[0].init

    // Inject links to `get /pet/{petId}`
    const links = createLinksMetadata(reprAst)
    const operationSpec = operations.filter(op => op.spec.operationId === 'getPetById')[0].spec

    for (let link of links) {
      const exploreLink = APIExplorer.LinkGenerator.toOperation(operationSpec, { petId: link.id })

      addWidgetToEditor(cm, link, {
        summary: operationSpec.summary,
        href: APIExplorer.LinkGenerator.makeHref(apis, operationSpec, { petId: link.id, foo: 'bar' }),
        exploreLink,
        handleExploreLinkClick: evt => {
          evt.preventDefault()
          history.pushState(null, exploreLink, null)
        }
      })
    }

    // TODO: Implement links to /pet/findByTags
  }
}
