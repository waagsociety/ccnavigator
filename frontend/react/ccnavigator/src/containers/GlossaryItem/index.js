import React from 'react';
import { Link } from 'react-router-dom'
import { css } from 'aphrodite';
import ApiClient from 'client/ApiClient'
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'


class GlossaryItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			nodeEntity:null,
			includedEntities:null
		};
	}

	componentDidMount() {
		
	}


	/**
	 * render node
	 */
  render() {
		//show loading till we have fetched all
		var header = <ModalHeader title={"loading"} />
		var content = "glossary";
		//return the content in a modal view
		return (
			<Modal isOpen={true}>
				{header}
				{content}
			</Modal>
		)
	}

}

export default GlossaryItem;
