import React from 'react';
import ApiClient from 'client/ApiClient'
import { setToolStatus, clearTools, setUser } from 'actions'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import StoreIO from 'client/StoreIO.js'

class Logout extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    console.debug("mount Logout")
    ApiClient.instance().loginStatus(function(status){
      if(status === true) {
        //load user data
        this.getUser();
      }
    }.bind(this));
  }

  onLogout(evt) {
    ApiClient.instance().logout(function(result) {
      if(result === true) {
        //clear redux state
        this.props.dispatch(clearTools());
        this.props.dispatch(setUser(null));
      }
    }.bind(this));
  }

  getUser(evt) {
    ApiClient.instance().getUser(function(user){
      if(user) {
        //get the field with json data stored from redux by this very client and put it into redux
        var reduxStored = (user.attributes || {}).field_data;
        StoreIO.instance().importData(reduxStored);
        this.props.dispatch(setUser(user));
      }
    }.bind(this));
  }

  onSaveUser(evt) {
    //save the full state, stringify in ApiClient
    var payload = StoreIO.instance().exportData();
    var data = {
      data : {
        attributes : {
          field_data : payload
        }
      }
    };
    //do it
    ApiClient.instance().saveUser(data, function(result){
      if(result) {
        console.log("successfully saved data");
      }
      else {
        console.log("failed to save data");
      }
    });
  }

  onAddTool(evt) {
    this.props.dispatch(setToolStatus("someid:" + Math.round((Math.random() * 10000)), "todo"));
  }

  render() {
    //set indicator for user logged in
    var indicator = <span style={{display: 'inline-block', width:'10px', height:'10px', background:(this.props.user ? "green" : "red")}}></span>
    //
    var user = null;
    if (this.props.user) {
      var name = ((this.props.user.data || {}).attributes || {}).name;
      user = <span>{name}</span>
    }

    //make a ref to the div so we can use it for snap
    return (
      <div className="form-login">
        {indicator}
        {user}
        <input type="submit" value="logout" onClick={ this.onLogout.bind(this)} />
        <div>
          <input type="text" ref={(elem) => { this.userInfoField = elem; }} />
          <input type="submit" value="save user data" onClick={ this.onSaveUser.bind(this)}  />
          <input type="submit" value="add tool" onClick={ this.onAddTool.bind(this)}  />
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  tools: state.tools
})


Logout = connect(mapStateToProps)(Logout)

export default Logout;
