import React from 'react';
import { connect } from 'react-redux'
import { css } from 'util/aphrodite-custom.js';
import Style from './style.js';
import { Link } from 'react-router-dom'
//import Login from "containers/Login"
//import Logout from "containers/Logout"
//import LanguageSelector from "containers/LanguageSelector"

class Footer extends React.Component {

  render() {
    // include login functionality later
    // var userform = null;
    // if (this.props.user) {
    //   userform = <Logout/>
    // } else {
    //   userform = <Login/>
    // }

    var navigation = (
      <div className={css(Style["navigation"])}>
        <Link className={css(Style["navigationLink"])} to="/about">about</Link>
      </div>
    )

    //{userform}
    //<LanguageSelector/>
    return (
      <div>
        {navigation}
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

Footer = connect(mapStateToProps)(Footer)

export default Footer;
