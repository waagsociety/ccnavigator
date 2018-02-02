import React from 'react';
import Panel from "containers/Panel"
import Metro from "containers/Metro"
import Login from "containers/Login"
import Modal from "components/Modal.js"
import ToolList from "containers/ToolList"
import MultiToolList from "containers/MultiToolList"
import ToolView from "containers/ToolView"
import LanguageSelector from "containers/LanguageSelector"
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

class App extends React.Component {

	constructor(props) {
		super(props);
    this.state = {
			showModal : false,
      entityId : null,
			width: 1200,
			height: 800
		}
		this.updateDimensions = this.updateDimensions.bind(this);
		window.addEventListener("resize", this.updateDimensions.bind(this));
	}

	componentDidMount() {
		this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
	}

	componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

	componentWillReceiveProps(newProps) {
		console.log("new entity", newProps.activeEntity)
	}

	/**
   * calculate & Update state of new dimensions
   */
  updateDimensions() {
  	let update_width  = window.innerWidth;
    let update_height = window.innerHeight;
    this.setState({ width: update_width, height: update_height });
  }

  render() {
		//define what to render based upon active entity, why not use link and router?
    /*
    var modalContent = null;
		if(this.props.activeEntity) {
			switch (this.props.activeEntity.type) {
				case "taxonomy_term--category":
					if(this.props.activeEntity.children.length > 0) {
						//a term with subcategories require a different layout
						modalContent = <ToolList entity={this.props.activeEntity} />
					}
					else {
						//a term ??
						modalContent = <ToolList entity={this.props.activeEntity} />
					}
					break;
				case "node--tool":
					modalContent = <ToolView entity={this.props.activeEntity} />
					break;
				default:
			}
		}
    */

		var about = (<Modal isOpen={true}>about bla bla</Modal>)

    return (
			<Router>
				<div>
	        <Login />
	        <Panel />
					<LanguageSelector/>
	        <Metro width={this.state.width} height={this.state.width} />
					<Route path="/about" render={() => about } />
					<Route path="/tool-list/:id" component={ToolList} />
					<Route path="/multi-tool-list/:id" component={MultiToolList} />
          <Route path="/tool/:id" component={ToolView} />
	      </div>
			</Router>
    );
	}

}


export default App;
