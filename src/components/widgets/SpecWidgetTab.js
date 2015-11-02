import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class SpecWidgetTab extends Component {
  render () {
    return (
      <div className='tab-content' >
        <noscript ></noscript>
        <div >
          <span >
          </span>
          <div className='tab-pane fade in' >
            <p >SPEEEEECCCCCCCCCCCCC Logins the user with sky id ac token</p>
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
    )
  }
}

SpecWidgetTab.propTypes = {
  children: PropTypes.element,
  operation: PropTypes.object
}

export default connect(
  state => {
    const operation = state.operations.filter(op => op.get('id') === state.router.params.id).first()
    return {
      operation: operation.size > 0 ? operation.toJS() : null
    }
  }
)(SpecWidgetTab)
