import React from 'react';
import { connect } from 'react-redux'
import Login from "containers/Login"
import Logout from "containers/Logout"

class Userform extends React.Component {

  render() {
    var userform = null
    if (this.props.user) {
      userform = <Logout/>
    } else {
      userform = <Login/>
    }

    return (
      <div className="panel userform">
        {userform}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

Userform = connect(mapStateToProps)(Userform)

export default Userform
