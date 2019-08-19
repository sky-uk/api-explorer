import React, { Component } from 'react'
import Styled from 'styled-components'
import { Label } from 'semantic-ui-react'

class ExplorerHeader extends Component {
  render () {
    const { apiName, productVersion, apiVersion } = this.props.api
    return (
      <Header>
        {apiName}
        &nbsp;Documentation&nbsp;
        <Label size='mini' color='blue'
          data-tooltip={productVersion} data-position='right center' data-variation='small' >
          {apiVersion}
        </Label>
      </Header>
    )
  }
}

export default ExplorerHeader

/* ###############################################################################
    Header
############################################################################### */
const Header = Styled.h1`
  font-family: Montserrat, sans-serif;
  font-weight: 400;
  font-size: 1.8em;
  line-height: 1.6em;
  color: #11171A;
  margin-bottom: 10px;
  padding: 0;

  .beta-label {
    background-color: #f0ad4e;
    color: white;
    margin: 10px;
    padding:4px;
    font-size:80%;
    font-weight: bold;
  }

  .documentation-version output {
    font-size:40%;
  }
`
