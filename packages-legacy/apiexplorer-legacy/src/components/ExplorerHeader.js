import React, { PropTypes, Component } from 'react'

class ExplorerHeader extends Component {

  render () {
    const { apiName, productVersion, apiVersion } = this.props.api
    return (
      <h1 className='page-header'>
        {apiName}
        &nbsp;Documentation&nbsp;
        <span className='documentation-version'>
          <output className='label label-info' title={productVersion}>{apiVersion} </output>
        </span>
      </h1>
    )
  }
}

ExplorerHeader.propTypes = {
  api: PropTypes.shape({
    apiName: PropTypes.string.isRequired,
    apiVersion: PropTypes.string.isRequired,
    productVersion: PropTypes.string
  }).isRequired
}

export default ExplorerHeader
