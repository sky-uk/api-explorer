import { combineReducers } from 'redux'

const reducers = { }

// Inject all the existing plugin reducers
if (window.APIExplorer && window.APIExplorer.plugins.length > 0) {
  window.APIExplorer.plugins
    .filter(pluginSpec => pluginSpec.reducer)
    .forEach(pluginSpec => reducers[pluginSpec.key] = pluginSpec.reducer)
}

export default Object.keys(reducers).length > 0 ? combineReducers(reducers) : reducers
