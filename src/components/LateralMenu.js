import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import cx from 'classnames'

class LateralMenu extends Component {

  render () {
    const operations = this.props.operations
    return (
    <div id='lateral-menu'>
      <ul className='nav'>
        <li>
          <a href='#'>
            <i className='fa fa-fw fa-user'></i>
            <span></span>
            <strong>{operations[0].apiname}</strong><span> API</span>
          </a>
          <ul className='nav nav-second-level'>
            <li>
              <a href='#'></a>
              <ul className='nav nav-third-level'>
                {operations.map(this.renderOperation)}
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    )
  }

  renderOperation (operation) {
    const httpMethodCx = cx('btn btn-outline btn-xs', {
      'btn-success': operation.spec.httpMethod === 'post',
      'btn-info': operation.spec.httpMethod === 'get',
      'btn-danger': operation.spec.httpMethod === 'delete',
      'btn-warning': operation.spec.httpMethod === 'put'
    })
    return (
      <li key={operation.id} id={operation.id} className='lioperation' title={operation.spec.description}>
        <Link to={`/operation/${operation.id}/spec`} className='operation-container' >
          <span className='operation'>
            <span className={httpMethodCx}>{operation.spec.httpMethod.toUpperCase()}</span>
            &nbsp;
            <span className='pull-right'>
            {operation.spec.tags.map(tag => <span key={tag} className='label'>{tag.toUpperCase()}</span>)}
            </span>
            <span>{operation.spec.url}</span>
          </span>
        </Link>
      </li>
    )
  }
}

LateralMenu.propTypes = {
  operations: PropTypes.array.isRequired
}

export default LateralMenu
