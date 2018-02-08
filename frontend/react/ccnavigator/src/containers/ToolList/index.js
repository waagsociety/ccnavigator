import React from 'react';
import { css } from 'util/aphrodite-custom.js';
//
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import ToolListItem from "./ToolListItem"
import { connect } from 'react-redux'
import { Style } from './style.js';
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'
import { Link } from 'react-router-dom'

/**
 * Get a list of tools in this category
 */
class ToolList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			termHierachy:null,
			termEntity:null,
			nodeEntities:null
		};
	}

	componentDidMount() {
		var entityId = this.props.match.params.id;
		//get hierarchy path of this term
		ApiHelper.instance().findInContentHierarchy(entityId, function(term) {
			console.debug("hierarchical term data, concise info on terms and nodes", term)
			this.setState({termHierachy: term});
		}.bind(this));
		//full info on this entity
		ApiClient.instance().fetchContent("taxonomy_term--category", entityId, null, null, function(termEntity) {
			console.log("full term data", termEntity);
			this.setState({termEntity: termEntity});
		}.bind(this));
		//full info on all nodes that have this term
		ApiClient.instance().fetchContent("node--tool", {"field_category.uuid" : entityId}, null, null, function(nodeEntities) {
			console.log("node entities", nodeEntities);
			this.setState({nodeEntities: nodeEntities});
		}.bind(this));
	}

  onToolSelected(item) {
    if(this.props.onToolSelected) {
      this.props.onToolSelected(item.props.data.id) //pass entity data obj
    }
  }

  render() {
		//show loading till we have fetched all
		var header = <ModalHeader title={"loading"} />
		var content = "loading";
		//build content view when we have all data
		if(this.state.termHierachy && this.state.termEntity && this.state.nodeEntities) {
			//make header
			var label = "zone " + this.state.termHierachy.path.join("-");
			var title =  this.state.termEntity.attributes.name || "";
			var subTitle = this.state.termEntity.attributes.field_subtitle || "";
			header = <ModalHeader label={label} title={title} subTitle={subTitle} />
			//make content
			var termDescription = (this.state.termEntity.attributes.description || {}).value || "";
			var tools = this.state.nodeEntities.map((node) => {
				return (
					<li className={css(Style.tool)}>
						<Link to={`/tool/${node.id}`}>
							<span>{node.attributes.title}</span>
						</Link>
						<div>{node.attributes.field_short_description}</div>
					</li>
				)
			});
			//compose content of modal
			content = (
				<div className={css(Style.container)}>
					<div dangerouslySetInnerHTML={{__html: termDescription}} />
					{tools}
				</div>
			)
		}
		//return the content in a modal view
		return (
			<Modal isOpen={true}>
				{header}
				{content}
			</Modal>
		)

	}

}

ToolList = connect()(ToolList)

export default ToolList;
