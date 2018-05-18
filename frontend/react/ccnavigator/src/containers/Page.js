import React from 'react';
import ApiClient from 'client/ApiClient'
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'
import ModalBody from 'components/ModalBody'
import Loading from 'components/Loading'
import { buildJSXFromHTML} from "util/utility"


class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nodeEntity:null,
      includedEntities:null,
    };
  }

  componentDidMount() {
    var path = this.props.match.path

    //full info on this node including relationships
    ApiClient.instance().fetchContent("node--page", {field_path:path}, null, null, 0, function(node, included) {
      //set content
      this.setState({
        nodeEntity: node,
        includedEntities: included
      });
    }.bind(this));
  }

  closeModal() {
    this.props.history.push('/navigator/')
  }

  render() {
    //show loading till we have fetched all
    var modalHeader
    var modalBody = <Loading />

    //build content view when we have all data
    if(this.state.nodeEntity) {

      //console.log(this.state.nodeEntity)

      //make header
      var title =  this.state.nodeEntity[0].attributes.title || "";

      modalHeader = <ModalHeader title={title} />

      //make description
      var body = (this.state.nodeEntity[0].attributes.body || {}).value || "";
      var jsx = buildJSXFromHTML(body);

      //body part
      modalBody = <ModalBody description={jsx} />
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

export default Page;
