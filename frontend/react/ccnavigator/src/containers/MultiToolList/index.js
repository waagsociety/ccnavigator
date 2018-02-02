import React from 'react';
import { css } from 'aphrodite';
//
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { connect } from 'react-redux'
import { Style } from './style.js';
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'

/**
 * Get a list of tools in this category
 */
class MultiToolList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {"entity":null};

		var entityId = this.props.match.params.id;
		//get children



		//does this cat have children / is this categorie the parent of other cats
		//http://l2thel.local/jsonapi/taxonomy_term/category?filter[parent.uuid][value]=6cec371d-6597-4332-a300-c6fed37b3ab0

		//http://l2thel.local/jsonapi/node/tool?filter[field_category.parent.uuid][value]=6cec371d-6597-4332-a300-c6fed37b3ab0

	}

	componentDidMount() {
		var entityId = this.props.match.params.id;
		//
		ApiHelper.instance().findInContentHierarchy("a5b8d8bc-de72-4dca-a285-a25cf75cbae3", function(term) {
			console.log("h", term);
		});



		//get this entity
		var entityId = this.props.match.params.id;
		ApiClient.instance().fetchContent("taxonomy_term--category", entityId, null, null, function(entity) {
			console.log("this entity", entity);
			this.setState({"entity": entity});
		}.bind(this));


		//get all nodes that have this term
		//ApiClient.instance().fetchContent("taxonomy_term--category", {"parent.uuid": entityId}, ["name", "parent"], null, function(terms) {
		//	console.log("terms", terms);
		//});

		//get all nodes that have this term its children as term
		ApiClient.instance().fetchContent("node--tool", {"field_category.parent.uuid" : entityId}, null, null, function(nodes) {
			console.log("nodes", nodes);
			this.setState({"content": nodes});
		}.bind(this));

	}

  onToolSelected(item) {
    if(this.props.onToolSelected) {
      this.props.onToolSelected(item.props.data.id) //pass entity data obj
    }
  }

	onClose() {
	}

  render() {

		if(this.state.entity) {

			var label = "zone ";
			var subTitle = this.state.entity.attributes.field_subtitle || "";
			var body = (this.state.entity.attributes.description || {}).value || "";

			//
			var listItems = null;
			if(this.state.content) {
				var	listItems = this.state.content.map((node) => {
						return (
							<li key={node.id}>
							</li>
						)
				});
			}

			return (
				<Modal isOpen={true}>
					<ModalHeader onClose={this.onClose.bind(this)} label={label} title={this.state.entity.attributes.name} subTitle={subTitle}/>
					<ul>{listItems}</ul>
				</Modal>
			)
		}

		return "";

	}

}

export default MultiToolList;
