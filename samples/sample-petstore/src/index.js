import './index.css'

import { APIExplorer, CurlGeneratorTab } from 'apiexplorer'

APIExplorer
  .addAPI('petstore', 'swagger2', '/public/petstore.json', c => {
    c.listOperationsAtWelcome(true)
    c.setRequestTimeoutInMiliseconds(1000)
  })
  .addWidgetTab('CURL', CurlGeneratorTab)
  .addCustomizableHeader('Sky-OTT-Provider', [
    {value: 'SKY', description: 'Sky Store'}
  ])
  .addCustomizableHeader('Sky-OTT-Proposition', [
    {value: 'STORE', description: 'Sky Store'},
    {value: 'NOWTV', description: 'Now TV'}
  ])
  .addCustomizableHeader('Sky-OTT-Country', [
    {value: 'GB', description: 'United Kingdom'},
    {value: 'DE', description: 'Germany'},
    {value: 'IE', description: 'Ireland'},
    {value: 'AT', description: 'Austria'}
  ])
  .start('app')
