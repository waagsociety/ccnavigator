import React from 'react';
import { css } from 'util/aphrodite-custom.js';
//
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { Style } from './style.js';
import { Link } from 'react-router-dom'
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'

/**
 * Get a list of tools in this category
 */
class MultiToolList extends React.Component {

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
		//full info on all nodes that have this term its child terms as term
		ApiClient.instance().fetchContent("node--tool", {"field_category.parent.uuid" : entityId}, null, null, function(nodeEntities) {
			console.log("node entities", nodeEntities);
			this.setState({nodeEntities: nodeEntities});
		}.bind(this));
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
			//use the concise term with hierarchy to build the term box
			var	subcategories = this.state.termHierachy.children.map((term) => {
					//list the tools in this subcategory
					var tools = term.nodes.map((node) => {
						var fullNode = this.state.nodeEntities.filter(function(f){ return f.id  === node.id})[0];
						return (
							<li key={node.id}>
								<Link to={`/tool/${fullNode.id}`}>
									<span>{fullNode.attributes.title}</span>
								</Link>
								<div>{fullNode.attributes.field_short_description || ""}</div>
							</li>
						)
					});
					//return a box for this subcategory
					return (
						<div className={css(Style.box)} key={term.id}>
							<span className={css(Style.term)}> {term.attributes.name} </span>
							{tools}
						</div>
					)
			});
			//compose content of modal
			content = (
				<div className={css(Style.container)}>
					<div dangerouslySetInnerHTML={{__html: termDescription}} />
					{subcategories}
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

export default MultiToolList;
