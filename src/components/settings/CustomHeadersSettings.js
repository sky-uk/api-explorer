import React, { Component, PropTypes } from 'react'

class CustomHeadersSettings extends Component {

  render () {
    return (
      <div className='tab-content' >
        <form className='form-horizontal'>
          <legend>Headers</legend>
          {this.props.config.headers.map(header => (
            <div key={header.name} className='form-group'>
              <label className='col-sm-2 control-label'>{header.name}</label>
              <div className='col-sm-10'>
                <input className='form-control' defaultValue={header.value} />
              </div>
            </div>
          ))}
          <div className='form-group'>
            <div className='col-sm-offset-2 col-sm-10'>
              <button className='btn btn-primary'>Save</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

CustomHeadersSettings.propTypes = {
  config: PropTypes.object
}

export default CustomHeadersSettings
