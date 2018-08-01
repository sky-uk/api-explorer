import { connect } from 'react-redux'

export default function settingsPaneWrapper (settingsPane) {
  return connect(
    (state) => {
      return {
        config: {
          defaultScheme: state.configs.get('url').protocol,
          useProxy: state.configs.get('url').useProxy,
          headers: state.configs.get('headers'),
          customizableHeaders: state.configs.get('customizableHeaders'),
          originalCustomizableHeaders: state.configs.get('originalCustomizableHeaders'),
          queryString: state.configs.get('url').getQueryString()
        }
      }
    }
  )(settingsPane)
}
