import React from 'react';
//import { Link } from 'react-router-dom'
//import { css } from 'util/aphrodite-custom.js';
//import { Style } from './style.js';
import ApiClient from 'client/ApiClient'
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'
import ModalBody from 'components/ModalBody'
import { buildJSXFromHTML} from "util/utility"



class GlossaryItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      termEntity:null
    };
  }

  componentDidMount() {
    var termId = this.props.match.params.id;
    //full info on this node including relationships
    ApiClient.instance().fetchContent("taxonomy_term--glossary", {tid:termId}, null, null, function(terms) {
      this.setState({
        termEntity: terms[0]
      });
    }.bind(this));
  }


  /**
   * render node
   */
  render() {
    //show loading till we have fetched all
    var modalHeader = <ModalHeader title={"loading"} />
    var modalBody = "loading";

    //build content view when we have all data
    if(this.state.termEntity) {

      //make header
      var title =  this.state.termEntity.attributes.name || ""
      modalHeader = <ModalHeader title={title} />

      //make content
      var body = (this.state.termEntity.attributes.description || {}).value || "";
      var description = buildJSXFromHTML(body);

      //compose content of modal
      // description = (
      //   <div>
      //     {jsx}
      //   </div>
      // )

      modalBody = <ModalBody description={description} />
    }

    //return the content in a modal view
    return (
      <Modal isOpen={true} onRequestClose={ () => { this.closeModal() } }>
        {modalHeader}
        {modalBody}
      </Modal>
    )
  }

}

export default GlossaryItem;
