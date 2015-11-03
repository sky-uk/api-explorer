import React from 'react/addons'
import OperationWidget from '../../src/components/OperationWidget'
import {expect} from 'chai'

const {renderIntoDocument, scryRenderedDOMComponentsWithTag} = React.addons.TestUtils

function setup (propOverrides) {
  const props = Object.assign({
    operation: {
      spec: {
        httpMethod: 'get',
        url: 'http://testurl'
      }
    },
    history: {
      isActive (value) { return true }
    }
  }, propOverrides)

  return renderIntoDocument(<OperationWidget {...props} />)
}

describe('components', () => {
  describe('OperationWidget', () => {
    it('OperationWidget elements check', () => {
      const component = setup()

      const strong = scryRenderedDOMComponentsWithTag(component, 'strong')
      expect(strong[0].textContent.trim()).to.equal('GET')

      const samp = scryRenderedDOMComponentsWithTag(component, 'samp')
      expect(samp[0].textContent.trim()).to.equal('http://testurl')

      const li = scryRenderedDOMComponentsWithTag(component, 'li')
      expect(li[0].textContent.trim()).to.equal('Test Widget')

      const a = scryRenderedDOMComponentsWithTag(component, 'a')
      expect(a[0].textContent.trim()).to.equal('Test Widget')
    })
  })
})
