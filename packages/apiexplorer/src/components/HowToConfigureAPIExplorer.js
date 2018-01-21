import React, { Component } from 'react'
import 'highlight.js/styles/monokai.css' // see issue #26
import { AppLogo } from '.'

class HowToConfigureAPIExplorer extends Component {
  render () {
    const topLoadingStyles = {
      backgroundColor: '#222',
      color: 'white',
      paddingTop: '5%',
      textAlign: 'center',
      height: '100%'
    }

    return (
      <div className='fullHeight'>
        <div className='fullHeight' style={topLoadingStyles} >
          <div className='fullHeight'>
            <AppLogo width={128} />
            <br />
            <h1>API Explorer</h1>
            <p>
              It seems that you have an <strong>empty</strong> API Explorer configuration.
              <br />
              Check out a sample configuration in the GitHub Repository.
            </p>
            <br />
            <a href='https://github.com/sky-uk/api-explorer'>https://github.com/sky-uk/api-explorer</a>
          </div>
        </div>
      </div>
    )
  }
}

export default HowToConfigureAPIExplorer
