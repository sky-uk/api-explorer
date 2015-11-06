/* import React from 'react/addons'
import { ResponseSchemaWidgetTab } from '../../../src/components'
import {expect} from 'chai'

const {renderIntoDocument, scryRenderedDOMComponentsWithTag} = React.addons.TestUtils

describe('components', () => {
  describe('ResponseSchemaWidgetTab', () => {
    it('ResponseSchemaWidgetTab TO DO', () => {
      expect('TODO').to.equal('TODO')
    })
  })
})

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
        'responses':{
           '200': {
              'description':'successful operation',
              'schema': {
                 'type':'array',
                 'items':{
                    '$ref':'#/definitions/Pet'
                 }
              }
           },
           '400':{
              'description':'Invalid status value'
           }
        },
        'definitions': {
          'Pet' :{
            'type':'object',
            'required':[
              'name',
              'photoUrls'
            ],
            'properties': {
              'id': {
                 'type': 'integer',
                 'format': 'int64'
              },
              'category': {
                 '$ref': '#/definitions/Category'
              },
              'tags': {
                'type': 'array',
                'xml': {
                  'name': 'tag',
                  'wrapped': true
                },
                'items': {
                  '$ref':'#/definitions/Tag'
                }
              },
           },
           'xml': {
              'name': 'Pet'
           }
        },
        'Category': {
          'type': 'object',
          'properties': {
            'id': {
             'type': 'integer',
             'format': 'int64'
            },
            'name': {
               'type': 'string'
            }
          },
          'xml': {
            'name': 'Category'
         }
        },
        'Tag':{
          'type': 'object',
          'properties': {
            'id': {
              'type': 'integer',
              'format': 'int64'
            },
            'name': {
              'type':'string'
            }
          },
          'xml': {
            'name':'Tag'
          }
        }
      }
    }
  }}, propOverrides)
  return renderIntoDocument(<SpecWidgetTab {...props} />)
}*/
