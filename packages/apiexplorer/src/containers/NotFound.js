import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppLogo } from './../components'

class NotFound extends Component {
  render () {
    const style = {
      backgroundColor: '#222',
      color: 'white',
      paddingTop: '10%',
      textAlign: 'center',
      height: '2000'
    }
    return (
      <div style={style}>
        <br />
        <AppLogo width={128} />
        <br /><br />
        <span style={{fontSize: '40px'}}>This is not the page you are looking for..!.</span>
        <br /><br />
        <a href='/'><button className='btn btn-success'>
          <span className='glyphicon glyphicon-home' /> Back Home
        </button></a>
      </div>
    )
  }
}

export default connect(
  state => {
    return {}
  }
)(NotFound)
