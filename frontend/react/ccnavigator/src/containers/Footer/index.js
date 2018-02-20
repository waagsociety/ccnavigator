import React from 'react';
import { connect } from 'react-redux'
import { css } from 'util/aphrodite-custom.js';
import Style from './style.js';
import Login from "containers/Login"
import LanguageSelector from "containers/LanguageSelector"

class Footer extends React.Component {

  render() {
    //set indicator for user logged in
    var indicator = <div style={{width:"10px",height:"10px",background:(this.props.user ? "green" : "red")}}></div>
    //
    var user = null;
    if (this.props.user) {
      var name = ((this.props.user.data || {}).attributes || {}).name;
      user = <div>{name}</div>
    }
    return (
      <div>
        <Login/>
        <LanguageSelector/>
        {indicator}
        {user}
        <p>koek</p>
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

Footer = connect(mapStateToProps)(Footer)

export default Footer;
