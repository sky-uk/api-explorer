import './index.css'

import APIExplorer from 'apiexplorer'

APIExplorer
  .addAPI('petstore', 'swagger2', 'http://petstore.swagger.io/v2/swagger.json')
  .start('app')
