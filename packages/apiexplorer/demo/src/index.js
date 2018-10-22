import './styles.css'
import APIExplorer from './../../src'

APIExplorer
  .addAPI('petstore', 'swagger2', '/petstore.json', c => {
    c.displaySummaryAtWelcome(true)
    c.listOperationsAtWelcome(true)
    c.setRequestTimeoutInMiliseconds(1000)
  })
  .start('demo')
