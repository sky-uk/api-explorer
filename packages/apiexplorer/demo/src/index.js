import './styles.css'
import APIExplorer from './../../src'

import { CurlGeneratorTab } from 'apiexplorer-components'

APIExplorer
  .addAPI('petstore', 'swagger2', 'http://petstore.swagger.io/v2/swagger.json',c => {
    
  })
  .addWidgetTab('CURL', CurlGeneratorTab)
  .start('demo')
