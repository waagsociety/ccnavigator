import React from 'react';
import ApiClient from 'client/ApiClient'
import { setToolStatus, clearTools, setUser } from 'actions'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import StoreIO from 'client/StoreIO.js'

class Login extends React.Component {

	static propTypes = {
  	dispatch: PropTypes.func.isRequired
  }

	componentDidMount() {
		ApiClient.instance().loginStatus(function(status){
			if(status === true) {
				//load user data
				this.getUser();
			}
		}.bind(this));
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
				var reduxStored = ((user.data || {}).attributes || {}).field_data;
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
		//make a ref to the div so we can use it for snap
		return (
			<div style={{background:"#ddd"}}>
				<input type="text" ref={(elem) => { this.userField = elem; }} />
        <input type="password" ref={(elem) => { this.passField = elem; }} />
        <input type="submit" onClick={ this.onLogin.bind(this)} />
				<input type="submit" value="logout" onClick={ this.onLogout.bind(this)} />
				<br/>
				<input type="text" ref={(elem) => { this.userInfoField = elem; }} />
				<input type="submit" value="save user data" onClick={ this.onSaveUser.bind(this)}  />
				<input type="submit" value="add tool" onClick={ this.onAddTool.bind(this)}  />
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
