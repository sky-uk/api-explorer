/* eslint-env mocha */

import React from 'react/addons'
import ExplorerHeader from '../../src/components/ExplorerHeader'
import {expect} from 'chai'

const {renderIntoDocument, scryRenderedDOMComponentsWithTag} = React.addons.TestUtils

describe('components', () => {
  describe('ExplorerHeader', () => {
    it('ExplorerHeader elements check', () => {
      const component = renderIntoDocument(
        <ExplorerHeader api={{ apiName: 'Sample API', apiVersion: '1.2.3', productVersion: '4.5.6' }} />
      )

      const h1 = scryRenderedDOMComponentsWithTag(component, 'h1')
      expect(h1[0].textContent.trim()).to.equal('Sample API Documentation 1.2.3')

      const spanOutput = scryRenderedDOMComponentsWithTag(component, 'output')
      expect(spanOutput[0].title).to.equal('4.5.6')
      expect(spanOutput[0].textContent.trim()).to.equal('1.2.3')
    })
  })
})
