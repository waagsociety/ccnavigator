import React from 'react';
import { css } from 'aphrodite';
//
import ApiClient from 'client/ApiClient'
import ToolListItem from "./ToolListItem"
import {setActiveEntity} from "actions"
import { connect } from 'react-redux'
import { Style } from './style.js';
import ModalHeader from 'components/ModalHeader'

class ToolList extends React.Component {

	constructor(props) {
		super(props);
    this.state = {
		}
	}

	componentDidMount() {
    if(this.props.entity) {

		}
	}

  onToolSelected(item) {
    if(this.props.onToolSelected) {
      this.props.onToolSelected(item.props.data.id) //pass entity data obj
    }
  }

	onClose() {
		this.props.dispatch(setActiveEntity(null));
	}

  render() {

		var	listItems = this.props.entity.nodes.map((node) => {
				return (
					<li key={node.id}>
						<ToolListItem entity={node} />
					</li>
				)
		});

		console.log("ent", this.props.entity);
		var label = "zone " + this.props.entity.path.join("-")
		var subTitle = this.props.entity.attributes.field_subtitle || "";
		var body = (this.props.entity.attributes.description || {}).value || "";

    return (
			<div>
				<ModalHeader onClose={this.onClose.bind(this)} label={label} title={this.props.entity.attributes.name} subTitle={subTitle}/>
				<span>{this.props.entity.attributes.name}</span>
	      <ul>
	        {listItems}
	      </ul>
			</div>
    );
	}

}

ToolList = connect()(ToolList)

export default ToolList;
