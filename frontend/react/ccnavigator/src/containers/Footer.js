import React from 'react';
import { connect } from 'react-redux'
// import Login from "containers/Login"
// import Logout from "containers/Logout"
// import LanguageSelector from "containers/LanguageSelector"
import ToolFilter from "containers/ToolFilter"

class Footer extends React.Component {

  render() {
    // include login functionality later
    // var userform = null;
    // if (this.props.user) {
    //   userform = <Logout/>
    // } else {
    //   userform = <Login/>
    // }

    //{userform}
    //<LanguageSelector/>
    return (
      <div>

        <ToolFilter/>
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

Footer = connect(mapStateToProps)(Footer)

export default Footer;
