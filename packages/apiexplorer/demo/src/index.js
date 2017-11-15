import './styles.css'
import APIExplorer from './../../src'
console.log(APIExplorer)

APIExplorer
  .addAPI('petstore', 'swagger2', 'http://petstore.swagger.io/v2/swagger.json')
  .start('demo')
