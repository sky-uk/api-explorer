import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import cx from 'classnames'
import Enumerable from 'linq'

class LateralMenu extends Component {

  render () {
    const apiOperationsArray = this.props.apis.get('byOrder')
                                              .map(name => this.props.operations.filter(o => o.apiname === name))
                                              .toArray()
    return (
    <div id='lateral-menu'>
      <ul className='nav'>
        {apiOperationsArray.map(operations => this.renderAPI(operations))}
      </ul>
    </div>
    )
  }

  renderAPI (operations) {
    const tags = Enumerable.from(operations).selectMany(o => o.spec.tags).distinct().toArray()
    return (
      <li key={operations[0].apiname}>
        <a href='#'>
          <i className='fa fa-fw fa-user'></i>
          <span></span>
          <strong>{operations[0].apiname}</strong><span> API</span>
        </a>
        <ul className='nav nav-second-level'>
        {tags.map(tag => this.renderOperationsWithTag(operations, tag))}
        </ul>
      </li>
    )
  }

  renderOperationsWithTag (operations, tag) {
    const visibleOperations = Enumerable.from(operations).where(o => (o.spec.tags).indexOf(tag) !== -1).toArray()
    return (
      <li key={tag}>
        <a href='#'>{tag.toUpperCase()}</a>
        <ul className='nav nav-third-level'>
          {visibleOperations.map(this.renderOperation)}
        </ul>
      </li>
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
            <span>{operation.spec.url}</span>
          </span>
        </Link>
      </li>
    )
  }
}

LateralMenu.propTypes = {
  operations: PropTypes.array.isRequired,
  apis: PropTypes.object.isRequired
}

export default LateralMenu
