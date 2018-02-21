import React from 'react';
import ApiClient from 'client/ApiClient'
//import { setToolStatus, clearTools, setUser } from 'actions'
import { setUser } from 'actions'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import StoreIO from 'client/StoreIO.js'
import { css } from 'util/aphrodite-custom.js';
import Style from './style.js';

class Login extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  onLogin(evt) {
    var user = this.userField.value;
    var pass = this.passField.value;
    ApiClient.instance().login(user, pass, function(result){
      if(result) {
        this.getUser();
      }
    }.bind(this));
  }

  getUser(evt) {
    ApiClient.instance().getUser(function(user){
      if(user) {
        //get the field with json data stored from redux by this very client and put it into redux
        var reduxStored = ((user.data || {}).attributes || {}).field_data;
        StoreIO.instance().importData(reduxStored);
        this.props.dispatch(setUser(user));
      }
    }.bind(this));
  }

  render() {
    return (
      <div>
        <div className={css(Style.login_form)}>
          <input type="text" ref={(elem) => { this.userField = elem; }} />
          <input type="password" ref={(elem) => { this.passField = elem; }} />
          <input type="submit" value="login" onClick={ this.onLogin.bind(this)} />
        </div>
      </div>
    );
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
export default Login;
