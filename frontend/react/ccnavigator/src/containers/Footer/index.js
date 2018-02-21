import React from 'react';
import { connect } from 'react-redux'
//import { css } from 'util/aphrodite-custom.js';
//import Style from './style.js';
import Login from "containers/Login"
import Logout from "containers/Logout"
import LanguageSelector from "containers/LanguageSelector"

class Footer extends React.Component {

  render() {
    var userform = null;
    if (this.props.user) {
      userform = <Logout/>
    } else {
      userform = <Login/>
    }

    return (
      <div>
        {userform}
        <LanguageSelector/>
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

Footer = connect(mapStateToProps)(Footer)

export default Footer;
