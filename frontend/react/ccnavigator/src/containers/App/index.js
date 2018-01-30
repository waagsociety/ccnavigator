import React from 'react';
import Panel from "containers/Panel"
import Metro from "containers/Metro"
import Login from "containers/Login"
import Modal from "components/Modal.js"
import ToolList from "containers/ToolList"
import ToolView from "containers/ToolView"
import LanguageSelector from "containers/LanguageSelector"
import { connect } from 'react-redux'
import {setActiveEntity} from "actions"

class App extends React.Component {

	constructor(props) {
		super(props);
    this.state = {
			showModal : false,
      entityId : null
		}
	}

	componentWillReceiveProps(newProps) {
		console.log("new entity", newProps.activeEntity)
	}

  onModalClose() {
    this.props.dispatch(setActiveEntity(null));
  }

  render() {
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

    return (
      <div>
        <Login />
        <Panel />
				<LanguageSelector/>
        <Metro width="600" height="400"/>
        <Modal isOpen={modalContent != null}>
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
