import React, { Component } from 'react'
import Highlight from 'react-highlight'
import 'highlight.js/styles/monokai.css' // see issue #26
import { AppLogo } from '.'

class HowToConfigureAPIExplorer extends Component {

  render () {
    const topLoadingStyles = {
      backgroundColor: '#222',
      color: 'white',
      paddingTop: '5%',
      textAlign: 'center',
      height: '2000'
    }
    return (
      <div>
        <div style={topLoadingStyles} >
          <div>
            <AppLogo width={128} />
            <br />
            <h1 style={{ fontFamily: 'verdana' }}>API Explorer</h1>
            <br />
            <br />
            <br />
            <p>It seems that you have an <strong>empty</strong> API Explorer configuration. Check out a sample configuration.</p>
            <br />
            <div style={{textAlign: 'left', marginLeft: '20%', marginRight: '20%'}}>
              {/* <Highlight className='JavaScript'>{`APIExplorer
  .addAPI('petstore', 'swagger2', 'https://api.swaggerhub.com/apis/anil614sagar/petStore/1.0.0', c => {
    c.addHeader('X-Foo', 'Some Value')
    c.addHeader('X-Bar', 'Another Value')
  })
  .configCORS({ credentials: 'omit' })
  .start()`}
              </Highlight> */}
            </div>
            <a href='https://github.com/sky-uk/api-explorer'>https://github.com/sky-uk/api-explorer</a>

          </div>
          <br />
          <br />

        </div>
      </div>
    )
  }
}

export default HowToConfigureAPIExplorer
