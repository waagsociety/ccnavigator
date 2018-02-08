import React from 'react';
import { connect } from 'react-redux'
import ToolSelectedList from './ToolSelectedList'
import { css } from 'aphrodite';
import Style from './style.js';
import Login from "containers/Login"
import LanguageSelector from "containers/LanguageSelector"

class Panel extends React.Component {

	componentWillUpdate(nextProps) {
		if (nextProps.specificProperty !== this.props.specificProperty) {
            // Do whatever you want
    }
  }

	componentDidUpdate() {
		console.log("need to fetch info about the tools selected")
  }

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
			<div className={css(Style.container)}>
				<Login/>
				<LanguageSelector/>
				{indicator}
				{user}
				<ToolSelectedList/>
      </div>
    );
	}

}

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

Panel = connect(mapStateToProps)(Panel)

export default Panel;
