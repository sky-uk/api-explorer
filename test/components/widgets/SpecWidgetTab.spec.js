import React from 'react/addons'
import SpecWidgetTab from '../../../src/components/widgets/SpecWidgetTab'
import {expect} from 'chai'

const {renderIntoDocument, scryRenderedDOMComponentsWithTag} = React.addons.TestUtils

function setup (propOverrides) {
  const props = Object.assign({
    operation: {
      spec: {
        summary: 'Test Summary',
        description: 'Test Description',
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Test Parameter Description',
            type: 'integer'
          },
          {
            in: 'body2',
            name: 'body2',
            description: 'Test Parameter Description 2',
            type: 'string'
          }
        ],
        responses: {
          400: {
            description: '400 Description'
          },
          404: {
            description: '404 Description'
          }
        }
      }
    }
  }, propOverrides)

  return renderIntoDocument(<SpecWidgetTab {...props} />)
}

describe('components', () => {
  describe('SpecWidgetTab', () => {
    it('SpecWidgetTab top elements check', () => {
      const component = setup()

      const ps = scryRenderedDOMComponentsWithTag(component, 'p')
      expect(ps[0].textContent.trim()).to.equal('Test Summary')
      expect(ps[1].textContent.trim()).to.equal('Test Description')

      const tds = scryRenderedDOMComponentsWithTag(component, 'td')

      // Parameters
      expect(tds[0].textContent.trim()).to.equal('body')
      expect(tds[1].textContent.trim()).to.equal('body')
      expect(tds[2].textContent.trim()).to.equal('Test Parameter Description')
      expect(tds[3].textContent.trim()).to.equal('integer')

      expect(tds[4].textContent.trim()).to.equal('body2')
      expect(tds[5].textContent.trim()).to.equal('body2')
      expect(tds[6].textContent.trim()).to.equal('Test Parameter Description 2')
      expect(tds[7].textContent.trim()).to.equal('string')
    })

    it('SpecWidgetTab parameters element check', () => {
      const component = setup()

      const tds = scryRenderedDOMComponentsWithTag(component, 'td')

      // Parameters
      expect(tds[0].textContent.trim()).to.equal('body')
      expect(tds[1].textContent.trim()).to.equal('body')
      expect(tds[2].textContent.trim()).to.equal('Test Parameter Description')
      expect(tds[3].textContent.trim()).to.equal('integer')

      expect(tds[4].textContent.trim()).to.equal('body2')
      expect(tds[5].textContent.trim()).to.equal('body2')
      expect(tds[6].textContent.trim()).to.equal('Test Parameter Description 2')
      expect(tds[7].textContent.trim()).to.equal('string')
    })

    it('SpecWidgetTab responses elements check', () => {
      const component = setup()

      const tds = scryRenderedDOMComponentsWithTag(component, 'td')

      // Responses
      expect(tds[8].textContent.trim()).to.equal('400')
      expect(tds[9].textContent.trim()).to.equal('400 Description')

      expect(tds[10].textContent.trim()).to.equal('404')
      expect(tds[11].textContent.trim()).to.equal('404 Description')
    })
  })
})
