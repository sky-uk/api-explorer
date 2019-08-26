import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Styled from 'styled-components'
import { Button, Icon, Label } from 'semantic-ui-react'

class ExplorerHeader extends Component {
  render () {
    const { apiName, productVersion, apiVersion, slug } = this.props.api
    return (
      <Header className="apiHeader">
        <Button as={Link} to={APIExplorer.LinkGenerator.toSpecViewer(slug)} icon labelPosition='left' size='mini' className='viewSourceButton'>
          <Icon name='file code' />
          View Spec
        </Button>
        <h1>
          {apiName}&nbsp;Documentation&nbsp;
          <Label size='mini' color='blue'
            data-tooltip={productVersion} data-position='right center' data-variation='small' >
            {apiVersion}
          </Label>
        </h1>
      </Header>
    )
  }
}

export default ExplorerHeader

/* ###############################################################################
    Header
############################################################################### */
const Header = Styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;

  h1 {
    font-family: Montserrat, sans-serif;
    font-weight: 400;
    font-size: 1.8em;
    line-height: 1.6em;
    color: #11171A;
    margin: 0px;
    padding: 0;
  }

  h1 .label {
    top: -5px;
  }

  h1 .documentation-version output {
    font-size:40%;
  }

  .viewSourceButton.ui.button {
    float: right;
    margin-top: 5px;
  }
`
