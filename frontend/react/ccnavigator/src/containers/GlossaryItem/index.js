import React from 'react';
import { Link } from 'react-router-dom'
import { css } from 'util/aphrodite-custom.js';
import ApiClient from 'client/ApiClient'
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'
import { buildJSXFromHTML} from "util/utility"
import { Style } from './style.js';


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
    var header = <ModalHeader title={"loading"} />
    var content = "loading";
    //build content view when we have all data
    if(this.state.termEntity) {
      //make header
      var title =  this.state.termEntity.attributes.name || "";
      header = <ModalHeader title={title} />
      //make content
      var body = (this.state.termEntity.attributes.description || {}).value || "";
      var jsx = buildJSXFromHTML(body);
      //compose content of modal
      content = (
        <div>
          {jsx}
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

export default GlossaryItem;
