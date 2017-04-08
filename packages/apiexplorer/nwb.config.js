module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'APIExplorer',
      externals: {
        react: 'React'
      }
    }
  }
}
