import React from 'react';
import { Link } from 'react-router-dom'
import { css } from 'aphrodite';
import ApiClient from 'client/ApiClient'
import { setToolStatus } from 'actions'
import { connect } from 'react-redux'
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'
import { Style } from './style.js';
import { buildJSXFromHTML} from "util/utility"


class ToolView extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			nodeEntity:null,
			includedEntities:null,
			newBody: null
		};
	}

	componentDidMount() {
		var entityId = this.props.match.params.id;
		//full info on this node including relationships
		ApiClient.instance().fetchContent("node--tool", entityId, null, ["field_image"], function(node, included) {
			var body = (node.attributes.body || {}).value || "";
			var newBody = buildJSXFromHTML(body);
			this.setState({
				nodeEntity: node,
				includedEntities: included,
				newBody: newBody
			});
		}.bind(this));
	}



  onFlag() {
		var entityId = this.props.match.params.id;
    this.props.dispatch(setToolStatus(entityId, "todo"));
  }

	/**
	 * render image or whatever
	 */
	renderInclude(item) {
		switch(item.type) {
			case "file--file":
				var mime = (item.attributes || {}).filemime;
				switch(mime) {
					case "image/jpeg":
						var filename = (item.attributes || {}).filename;
						var url = (item.attributes || {}).url;
						return <img className={css(Style.image)} src={ApiClient.instance().getFullURL(url)} alt={filename} />
						break;
					default:
						console.log("entity mime not supported:", mime);
						break;
				}
				break;
			default:
				console.log("entity type not supported:", item.type);
				break;
		}
		return null;
	}

	/**
	 * render node
	 */
  render() {
		//show loading till we have fetched all
		var header = <ModalHeader title={"loading"} />
		var content = "loading";
		//build content view when we have all data
		if(this.state.nodeEntity) {
			//make header
			var title =  this.state.nodeEntity.attributes.title || "";
			header = <ModalHeader title={title} />
			//make content
			var body = (this.state.nodeEntity.attributes.body || {}).value || "";
			//includes
			var includes = (this.state.includedEntities || []).map((item) => {
				return this.renderInclude(item);
			});
			//content part
			content = (
				<div>
					<div dangerouslySetInnerHTML={{__html: body}} />
					{includes}
					{this.state.newBody}
				</div>

			)
		}
		//return the content in a modal view
		//linking with Link registers a link, which makes routing without page load possible
		//normal links with <a> don't work
		//https://www.npmjs.com/package/html-to-react

		var b = [];
		b.push("ablaba");
		b.push(<Link to="/taxonomy/term/37">{"aaaa"}</Link>);
		b.push("ablaba");
		b.push(<Link to="/taxonomy/term/37">bbb</Link>);

		return (
			<Modal isOpen={true}>
				{header}
				<button onClick={this.onFlag.bind(this)}>flag</button>
				{content}
			</Modal>
		)
	}

}

//connect the status prop to the record for this tool in redux
const mapStateToProps = (state, ownProps) => ({
  tool: state.tools.find((item) => {return item.uuid === ownProps.entityId})
})
ToolView = connect(mapStateToProps)(ToolView)

export default ToolView;
