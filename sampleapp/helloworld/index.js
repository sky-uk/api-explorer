import APIExplorer from './../../src'

APIExplorer
  .config(c => {
    c.swagger2API('helloworld', 'http://localhost:3000/sampleapp/helloworld/helloworld.json', true)
  })
  .start()
