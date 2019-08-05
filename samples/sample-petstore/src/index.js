import './index.css'

import { APIExplorer, CurlGeneratorTab } from 'apiexplorer'

APIExplorer
  .addAPI('petstore', 'swagger2', '/public/petstore.json', c => {
    c.listOperationsAtWelcome(true)
    c.setRequestTimeoutInMiliseconds(1000)
  })
  .addWidgetTab('CURL', CurlGeneratorTab)
  .start('app')
