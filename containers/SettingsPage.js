import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router'

@connect(state => ({ settings: state.settings }))
export default class SettingsPage extends Component {
  render() {
    const { settings } = this.props;
    return (
      <div>
        <h1>Settings</h1>
        <br/>
        Width: <span>{settings.width}</span>
        <br/>
        <Link to='/'>Go Back!</Link>
      </div>
    );
  }
}
