import React from 'react';
import { css } from 'aphrodite';
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
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
			termEntities:null
		};
	}

	componentDidMount() {
		var entityId = this.props.match.params.id;
		//full info on this node including relationships
		ApiClient.instance().fetchContent("node--tool", entityId, null, ["field_image", "field_download"], function(node, included) {
			//set content
			this.setState({
				nodeEntity: node,
				includedEntities: included
			});
			//lookup the terms in the hierarchy to get pathnames
			var categoryIds = (((node.relationships || {}).field_category || {}).data || []).map((cat) => {
				return cat.id;
			});
			ApiHelper.instance().findInContentHierarchy(categoryIds, function(terms) {
				this.setState({
					termEntities: terms
				});
			}.bind(this));
		}.bind(this));
	}

	/**
	 * flag button hit
	 */
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
					case "application/pdf":
						var filename = (item.attributes || {}).filename;
						var url = (item.attributes || {}).url;
						return <a href={ApiClient.instance().getFullURL(url)} target="_blank"><button>DOWNLOAD</button></a>
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
			var label = "";
			//display the caterories this tool falls under
			if(this.state.termEntities) {
				var labels = this.state.termEntities.map((term) => {
					return term.path.join("-")
				});
				label = labels.join(" ");
			}
			header = <ModalHeader label={label} title={title} />
			//make content
			var body = (this.state.nodeEntity.attributes.body || {}).value || "";
			var jsx = buildJSXFromHTML(body);
			//includes
			var includes = (this.state.includedEntities || []).map((item) => {
				return this.renderInclude(item);
			});
			//content part
			content = (
				<div>
					{jsx}
					{includes}
				</div>
			)
		}

		//return the content in a modal view
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
