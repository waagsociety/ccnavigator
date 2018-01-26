import React from 'react';
import Panel from "containers/Panel"
import Metro from "containers/Metro"
import Login from "containers/Login"
import Modal from "components/Modal.js"
import ToolList from "containers/ToolList"
import ToolView from "containers/ToolView"
import LanguageSelector from "containers/LanguageSelector"
import { connect } from 'react-redux'

class App extends React.Component {

	constructor(props) {
		super(props);
    this.state = {
			showModal : false,
      entityId : null
		}
	}

	componentDidMount() {
		//GET ALL TOOLS, parse to count categories??
	}

  componentDidUpdate() {

  }

	componentWillReceiveProps(newProps) {

		if(newProps.activeEntity !== this.props.activeEntity) {
			//check what kind of entity this is, a tool or a term
			this.setState({
	      showModal : true,
	      entityId : newProps.activeEntity.entityId,
	      mode : "list"
	    });
		}
	}


  onTermClicked(entityId) {
    this.setState({
      showModal : true,
      entityId : entityId,
      mode : "list"
    });
  }
  onModalClose() {
    this.setState({
      showModal : false,
      entityId : null,
      mode : null
    });
  }

  onToolSelected(entityId) {
    this.setState({
      showModal : true,
      entityId : entityId,
      mode : "view"
    });
  }

  render() {

    var modalContent = null;
    if(this.state.showModal) {
      switch (this.state.mode) {
        case "list":
          modalContent = <ToolList entityId={this.state.entityId} onToolSelected={this.onToolSelected.bind(this)} />
          break;
        case "view":
          modalContent = <ToolView entityId={this.state.entityId} />
          break;
        default:
      }
    }

    return (
      <div>
        <Login />
        <Panel />
				<LanguageSelector/>
        <Metro onTermClicked={this.onTermClicked.bind(this)} width="600" height="400"/>
        <Modal isOpen={this.state.showModal}>
          {modalContent}
          <button onClick={this.onModalClose.bind(this)}>Close Modal</button>
        </Modal>
				<svg><ding/></svg>
      </div>
    );
	}

}

const mapStateToProps = (state, ownProps) => ({
	activeEntity: state.activeEntity
})

App = connect(mapStateToProps)(App)

export default App;
