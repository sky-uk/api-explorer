export default class APIExplorerPluginConfigurator {
  constructor(apiExplorer) {
    this.apiExplorer = apiExplorer

    this.apiExplorer.plugins = []
  }

  /**
   * Method of the fluent API used to configure APIExplorer with API Specifications
   *
   * The pluginSpec can have the following properties:
   * {
   *   key: 'somePlugin',        // (REQUIRED) unique identifier of the plugin
   *   name: 'Some Plugin'       // Friendly name of the plugin
   * }
   *
   * Plugin will be available by index, and by key in the APIExplorer.plugins array.
   * Example: `const plugin = APIExplorer.plugins.somePlugin`
   *
   * @param  {[function]} configurator    A function used to configure API Explorer
   * @return {[APIExplorer]}              APIExplorer instance to provide a fluent interface
   */
  addPlugin(pluginSpec) {
    if (!pluginSpec) {
      throw new Error('ArgumentError: pluginSpec is a required field')
    }

    if (!/^[a-z][a-zA-Z]*$/.test(pluginSpec.key)) {
      throw new Error('ArgumentError: pluginSpec.key should match "[a-z][a-zA-Z]*" regex.')
    }

    if (this.apiExplorer.plugins[pluginSpec.key]) {
      throw new Error(`ArgumentError: A plugin with the same key [${pluginSpec.key}] is already registered.`)
    }

    pluginSpec.name = pluginSpec.name || pluginSpec.key

    this.apiExplorer.plugins.push(pluginSpec)
    this.apiExplorer.plugins[pluginSpec.key] = pluginSpec
    console.log(`[${pluginSpec.key}] ${pluginSpec.name} successfully registered.`)
    console.log(this.apiExplorer.plugins)
  }
}
