import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import cx from 'classnames'
import Enumerable from 'linq'
import { OperationsFilter } from '.'

class LateralMenu extends Component {
  constructor () {
    super()
    this.state = { filter: this.getFilterState('') }
  }

  // ----------------------------------------------------------------------------------------
  // Filtering
  // ----------------------------------------------------------------------------------------
  getFilterState (filterText) {
    // Convert filterText into a regex
    // EX: "GET u ent    vi" -> "GETuentvi" -> /G.*E.*T.*u.*e.*n.*t.*v.*i/i
    return {
      text: filterText,
      regex: new RegExp(filterText.replace(/\s/g, '').split('').join('.*'), 'i')
    }
  }

  handleFilterUpdate (text) {
    this.setState({ filter: this.getFilterState(text) })
  }

  matchFilterRegex (text) {
    return this.state.filter.regex.test(text)
  }

  isApiVisible (api, operations) {
    if (this.state.filter.text === '') return true
    return operations.some(o => this.isOperationVisible(o))
  }

  isTagVisible (tag, operations) {
    if (this.state.filter.text === '') return true
    if (this.matchFilterRegex(tag)) return true
    return operations.some(o => this.isOperationVisible(o))
  }

  isOperationVisible (operation) {
    if (this.state.filter.text === '') return true
    if (operation.spec.tags.some(tag => this.matchFilterRegex(tag))) return true
    return this.matchFilterRegex(operation.spec.httpMethod + operation.spec.url)
  }

  // ----------------------------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------------------------
  render () {
    const operationsByApi = this.props.apis.get('byOrder')
                                .map(name => this.props.operations.filter(o => o.apiname === name))
                                .toArray()
    return (
    <div id='lateral-menu'>
      <ul className='nav'>
        <OperationsFilter placeholder='e.g. getusersession'
        onFilter={text => this.handleFilterUpdate(text)} />

        {operationsByApi.map(apiOperations => this.renderAPI(apiOperations))}
      </ul>
    </div>
    )
  }

  renderAPI (apiOperations) {
    if (!this.isApiVisible(apiOperations[0].apiname, apiOperations)) return

    const tags = Enumerable.from(apiOperations).selectMany(o => o.spec.tags).distinct().toArray()
    return (
      <li key={apiOperations[0].apiname}>
        <a href='#'>
          <i className='fa fa-fw fa-user'></i>
          <span></span>
          <strong>{apiOperations[0].apiname}</strong><span> API</span>
        </a>
        <ul className='nav nav-second-level'>
        {tags.map(tag => this.renderOperationsWithTag(apiOperations, tag))}
        </ul>
      </li>
    )
  }

  renderOperationsWithTag (operations, tag) {
    const visibleOperations = Enumerable.from(operations).where(o => (o.spec.tags).indexOf(tag) !== -1).toArray()

    if (!this.isTagVisible(tag, visibleOperations)) return

    return (
      <li key={visibleOperations[0].apiname + tag}>
        <a href='#'>{tag}</a>
        <ul className='nav nav-third-level'>
          {visibleOperations.map(o => this.renderOperation(o))}
        </ul>
      </li>
    )
  }

  renderOperation (operation) {
    if (!this.isOperationVisible(operation)) {
      return
    }

    const httpMethodCx = cx('btn btn-outline btn-xs', {
      'btn-success': operation.spec.httpMethod === 'post',
      'btn-info': operation.spec.httpMethod === 'get',
      'btn-danger': operation.spec.httpMethod === 'delete',
      'btn-warning': operation.spec.httpMethod === 'put'
    })

    let liClass = 'lioperation'
    if (this.props.selectedOperationId && operation.id === this.props.selectedOperationId) {
      liClass = `${liClass} active`
    }

    if (operation.spec.deprecated) {
      liClass = `${liClass} deprecated-api`
    }

    return (
      <li key={operation.id} id={operation.id} className={liClass} title={operation.spec.description}>
        <Link to={`/operation/${operation.id}/try-it`} className='operation-container' onClick={ () => this.props.onOperationClick(operation.id) }>
          <span className='operation'>
            <span className={httpMethodCx}>{operation.spec.httpMethod.toUpperCase()}</span>
            &nbsp;
            {operation.spec.security && (<span key={`security${operation.id}`} style={{width: '1em', display: 'inline-block', opacity: '0.5', marginRight: '0px 5px', color: 'Yellow'}}><i className='fa fa-lock' title='Secured'></i></span>)}
              <span>{operation.spec.url}</span>
          </span>
        </Link>

      </li>
    )
  }

}

LateralMenu.propTypes = {
  operations: PropTypes.array.isRequired,
  apis: PropTypes.object.isRequired,
  selectedOperationId: PropTypes.string,
  onOperationClick: PropTypes.func.isRequired
}

export default LateralMenu
