import './index.css'

import { APIExplorer, CurlGeneratorTab } from 'apiexplorer'

APIExplorer
  .addAPI('petstore', 'swagger2', '/public/petstore.json', c => {
    c.listOperationsAtWelcome(true)
    c.setRequestTimeoutInMiliseconds(1000)
  })
  .addWidgetTab('CURL', CurlGeneratorTab)
  .addCustomizableHeader('X-Language', [
    { value: 'eng', description: 'English' },
    { value: 'por', description: 'Portuguese' },
    { value: 'spa', description: 'Spanish' }
  ])
  .addCustomizableHeader('X-Country', [
    { value: 'PT', description: 'Portugal' },
    { value: 'ES', description: 'Spain' },
    { value: 'FR', description: 'France' },
    { value: 'IT', description: 'Italy' }
  ])
  .start('app')
