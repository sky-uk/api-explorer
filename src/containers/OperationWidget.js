import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'

class OperationWidget extends Component {
  render () {
    const operation = this.props.operations.toJS().find(op => op.id === this.props.params.id)
    const panelCx = cx('documentation-widget panel panel-default', {
      'panel-info': operation.spec.httpMethod === 'get',
      'panel-green': operation.spec.httpMethod === 'post',
      'panel-danger': operation.spec.httpMethod === 'delete',
      'panel-warning': operation.spec.httpMethod === 'put'
    })
    return (
      <div className={panelCx} >
        <div className='panel-heading' id='POST-v2-user-session-skyid-ac' >
          <small className='pull-right doc-w-nickname' title='Logins the user with sky id ac token' >Logins the user with sky id ac token
          </small>
          <strong >{operation.spec.httpMethod.toUpperCase()}
          </strong>
          <span >&nbsp;
          </span>
          <samp >{operation.spec.url}
          </samp>
          <span className='doc-w-secured' >
          </span>
        </div>
        <div className='panel-body' >
          <ul className='nav nav-tabs' >
            <li >
              <a href='/api/explorer/operation/POST-v2-user-session-skyid-ac/tryitout' >Try It Out
              </a>
            </li>
            <li className='active' >
              <a className=' active' href='/api/explorer/operation/POST-v2-user-session-skyid-ac/spec' >Spec
              </a>
            </li>
            <li >
              <a href='/api/explorer/operation/POST-v2-user-session-skyid-ac/response' >Response Schema
              </a>
            </li>
          </ul>
          <div className='tab-content' >
            <noscript ></noscript>
            <div >
              <span >
              </span>
              <div className='tab-pane fade in' >
                <p >Logins the user with sky id ac token</p>
                <p className='text-muted' >This action calls the Sky iD service.</p>
                <div >
                  <div >
                    <h4 >Parameters</h4>
                    <table className='table table-striped' >
                      <tbody className='operation-params' >
                        <tr >
                          <td >
                            <span className='label label-default' >body
                            </span>
                          </td>
                          <td className='col-md-2' >
                            <span >token
                            </span>
                          </td>
                          <td className='col-md-8' >
                            <span className='doc-w-param-value' >Login on skyid to get a sso token
                            (Example:
                            Go to https://demo.id.bskyb.com/signin/skystore
                            Login with following credentials username: skystoredev, password: abcdefg
                            Then come back and try out without the parameter token)
                            You can also pass the token as AuthorizationCode=AuthorizationCode_value in the body
                            </span>
                          </td>
                          <td className='col-md-2' >
                            <span className='doc-w-param-datatype' >AuthorizationCodeBodyContent
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <noscript >
                  </noscript>
                </div>
                <div >
                  <h4 >Response Status Codes
                  </h4>
                  <table className='table table-bordered table-striped' >
                    <tbody className='operation-status' >
                      <tr >
                        <td className='col-md-2' >204
                        </td>
                        <td className='col-md-10' >Ok
                        </td>
                      </tr>
                      <tr >
                        <td className='col-md-2' >401
                        </td>
                        <td className='col-md-10' >Unauthorized access
                        </td>
                      </tr>
                      <tr >
                        <td className='col-md-2' >403
                        </td>
                        <td className='col-md-10' >Invalid credentials
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <noscript >
            </noscript>
          </div>
        </div>
      </div>
    )
  }
}

OperationWidget.propTypes = {
  children: PropTypes.element,
  operations: PropTypes.object,
  params: PropTypes.object
}

export default connect(
  state => {
    return {
      operations: state.operations
    }
  }
)(OperationWidget)
