import React from 'react';
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
//import ToolListItem from "./ToolListItem"
import { connect } from 'react-redux'
import { buildJSXFromHTML } from 'util/utility.js';
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'
import ModalBody from 'components/ModalBody'


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
    ApiHelper.instance().findTermInContentHierarchy(entityId, function(term) {
      //console.log(term)
      this.setState({termHierachy: term});
    }.bind(this));
    //full info on this entity
    ApiClient.instance().fetchContent("taxonomy_term--category", entityId, null, null, function(termEntity) {
      //console.log("full term data", termEntity);
      this.setState({termEntity: termEntity});
    }.bind(this));
    //full info on all nodes that have this term
    ApiClient.instance().fetchContent("node--tool", {"field_category.uuid" : entityId}, null, null, function(nodeEntities) {
      //console.log("node entities", nodeEntities);
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
    var modalHeader = <ModalHeader title={"loading"} />
    var modalBody = "loading"; // todo: make translatable

    //build content view when we have all data
    if(this.state.termHierachy && this.state.termEntity && this.state.nodeEntities) {

      //make header
      var labels = ["zone " + this.state.termHierachy.path.map(x => x + 1).join("-")]
      var title =  this.state.termEntity.attributes.name || ""
      var subTitle = this.state.termEntity.attributes.field_subtitle || ""
      modalHeader = <ModalHeader labels={labels} title={title} subTitle={subTitle} />

      //make body
      var description = (this.state.termEntity.attributes.description || {}).value || ""
      description = buildJSXFromHTML(description)

      var boxesTitle = 'tools:' // todo: make translatable
      var boxes = this.state.nodeEntities.map((node) => {

        return {
          link: `/tool/${node.id}`,
          title: node.attributes.title,
          content: node.attributes.field_short_description ? <p>{node.attributes.field_short_description}</p> : ''
        }
      });

      modalBody = <ModalBody description={description} boxesTitle={boxesTitle} boxes={boxes} />
    }

    //return the content in a modal view
    return (
      <Modal isOpen={true}>
        {modalHeader}
        {modalBody}
      </Modal>
    )

  }

}

ToolList = connect()(ToolList)

export default ToolList;
