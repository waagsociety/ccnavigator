import React from 'react';
import Panel from "containers/Panel"
import Metro from "containers/Metro"
import Modal from "components/Modal.js"
import ToolList from "containers/ToolList"
import MultiToolList from "containers/MultiToolList"
import ToolView from "containers/ToolView"
import GlossaryItem from "containers/GlossaryItem"
import MediaQuery from 'react-responsive';

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
  	//let update_width  = window.innerWidth;
    //let update_height = window.innerHeight;
    //this.setState({ width: update_width, height: update_height });
  }

  render() {
		var about = (<Modal isOpen={true}>about bla bla</Modal>)
    return (
			<Router>
				<div style={{width:"100%",height:"100vh", overflow:"hidden"}}>
          <MediaQuery minWidth={1224}>
            <Panel />
            <div style={{width:"80%",height:"100%",float:"left"}}>
              <Metro />
            </div>
          </MediaQuery>
          <MediaQuery maxWidth={1224}>
            <div style={{width:"100%",height:"20%",background:"white"}}>
              <Panel />
            </div>
            <div style={{width:"100%",height:"80%"}}>
              <Metro />
            </div>
          </MediaQuery>

					<Route path="/about" render={() => about } />
					<Route path="/tool-list/:id" component={ToolList} />
					<Route path="/multi-tool-list/:id" component={MultiToolList} />
          <Route path="/tool/:id" component={ToolView} />
          <Route path="/*/taxonomy/term/:id" component={GlossaryItem} />
	      </div>
			</Router>
    );
	}

}


export default App;
