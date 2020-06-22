import React from 'react';
import ApiClient from 'client/ApiClient'
//import { setToolStatus, clearTools, setUser } from 'actions'
import { setUser } from 'actions'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import StoreIO from 'client/StoreIO.js'
import { Link } from 'react-router-dom'

class Login extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      toggled: false
    }
  }

  /*
  * get the user status, if the user is logged in this component will be unmount by parent
  */
  componentDidMount() {
    console.debug("mount Login")
    ApiClient.instance().loginStatus(function(status){
      if(status === true) {
        this.getUser();
      }
    }.bind(this));
  }

  onLogin(evt) {
    var user = this.userField.value
    var pass = this.passField.value
    ApiClient.instance().login(user, pass, function(result){
      if(result) {
        this.getUser()
      }
    }.bind(this));
  }

  getUser(evt) {
    ApiClient.instance().getUser(function(user){
      if(user) {
        //get the field with json data stored from redux by this very client and put it into redux
        var reduxStored = (user.attributes || {}).field_data
        StoreIO.instance().importData(reduxStored)
        this.props.dispatch(setUser(user))
      }
    }.bind(this));
  }

  onToggleFormDisplay() {
    this.setState({
      toggled: !this.state.toggled
    })
  }

  render() {

    var className = "panel-content toggle"
    if(this.state.toggled) {
      className += " toggled"
    }

    return (
        <div className={className}>
          <h3 className="toggle-button" onClick={() => {this.onToggleFormDisplay()}}><span className="icon"></span>log in / register</h3>
          <div className="toggle-content">
            <div className="form-login">
              <input placeholder="username" type="text" ref={(elem) => { this.userField = elem; }} />
              <input placeholder="password" type="password" ref={(elem) => { this.passField = elem; }} />
              <button onClick={ this.onLogin.bind(this) }>login</button>
            </div>
            <p className="small">
              No account yet? <Link className="button-link" to="">Register now</Link> to save your progress, receive feedback and other great features!
            </p>
          </div>
        </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  tools: state.tools
})

//we kunnen dus kiezen om de redux en react code te scheiden door een callback mee te geven met dispatch daar in
/*
const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(setToolStatus("asddsas","todo"))
  }
})
*/

Login = connect(mapStateToProps)(Login)

//export the connected Login this exposes the dispatch function and the store to the component
export default Login
