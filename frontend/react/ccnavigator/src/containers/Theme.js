import React from 'react';
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { connect } from 'react-redux'
import { buildJSXFromHTML } from 'util/utility.js'
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'
import ModalBody from 'components/ModalBody'
import Loading from 'components/Loading'
import { Constants } from 'config/Constants.js'


/**
 * Get a list of tools in this category
 */
class Theme extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      termHierachy:null,
      termEntity:null,
      nodeEntities:null,
      includedEntities:null
    };
  }

  componentDidMount() {
    this.update();
  }

  componentWillReceiveProps(nextProps) {
    this.update();
  }

  update() {
    var entityId = this.props.match.params.id;
    //get hierarchy path of this term
    ApiHelper.instance().clearCaches();
    ApiHelper.instance().findTermInContentHierarchy(entityId, function(term) {
      this.setState({termHierachy: term});
    }.bind(this));
    //full info on this entity
    ApiClient.instance().fetchContent("taxonomy_term--category", entityId, null, null, 0, function(termEntity) {
      this.setState({termEntity: termEntity});
    }.bind(this));
    //full info on all nodes that have this term
    ApiHelper.instance().buildFilter((filter) => {
      filter["field_category.uuid"] = entityId;
      ApiClient.instance().fetchContent("node--tool", filter, null, Object.values(Constants.filterFieldMapping), 0, function(nodeEntities, included) {
        //connect relationships to include in entity
        this.setState({
          nodeEntities: nodeEntities,
          includedEntities: included
        });
      }.bind(this));
    });
  }

  onToolSelected(item) {
    if(this.props.onToolSelected) {
      this.props.onToolSelected(item.props.data.id) //pass entity data obj
    }
  }

  closeModal() {
    this.props.history.push('/navigator/')
  }

  resolveRelationship(tool, relationshipName, includes) {
    var uuidRelated = (((tool["relationships"] || {})[relationshipName] || {})["data"] || {})["id"]
    if(uuidRelated) {
      var found = (includes || []).find((el) => {
        return (el || {}).id === uuidRelated;
      });
      return (found.attributes || {}).name;
    }
    return null;
  }

  render() {
    //show loading till we have fetched all
    var modalHeader
    var modalBody = <Loading />

    //build content view when we have all data
    if(this.state.termHierachy && this.state.termEntity && this.state.nodeEntities) {

      //make header
      var path = this.state.termHierachy.path.slice(0, 2).map(x => x + 1).join("-")
      var categoryColor
      if (Constants.zones[path]) {
        categoryColor = Constants.colors[Constants.zones[path].color]
      } else if (Constants.zones[path.slice(0, -2)]) {
        categoryColor = Constants.colors[Constants.zones[path.slice(0, -2)].color]
      }

      //var labels = ["zone " + this.state.termHierachy.path.map(x => x + 1).join("-")]
      var labels = ["zone " + (this.state.termHierachy.path[0] + 1)]
      var title =  this.state.termEntity.attributes.name || ""
      var subTitle = this.state.termEntity.attributes.field_subtitle || ""
      //
      modalHeader = <ModalHeader color={categoryColor} labels={labels} title={title} subTitle={subTitle} />

      //make body
      var description = (this.state.termEntity.attributes.description || {}).value || ""
      description = buildJSXFromHTML(description)

      var boxes = this.state.nodeEntities.map((node) => {
        //
        var description = node.attributes.field_short_description ? <p>{node.attributes.field_short_description}</p> : ''

        //metadata fields
        var metaDataFields = Object.values(Constants.filterFieldMapping).map((fieldName) => {
          var fieldValue = this.resolveRelationship(node,fieldName,this.state.includedEntities)
          var className = "short-tool-meta " + fieldName.slice(6)
          return (fieldValue ? <span key={fieldName} className={className}>{fieldValue}</span> : null)
        });

        var metaData = (
          <div className="short-tool-metas">
            {metaDataFields}
          </div>
        )

        return {
          link: `/navigator/tool/${node.id}`,
          title: node.attributes.title,
          content: <div className="box-body">{description}{metaData}</div>
        }
      })

      var boxesTitle = (boxes.length > 0 ? "tools" : "no tools")
      if((this.props.filtersSelected || []).length > 0) {
        boxesTitle += " (matching current tool filters)"
      }


      modalBody = <ModalBody description={description} boxesType="tools" boxesTitle={boxesTitle} boxes={boxes} />
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

/**
 * update when language or filters change
 */
const mapStateToProps = (state, ownProps) => ({
  language: state.language,
  filtersSelected: state.toolFiltersApplied
})

Theme = connect(mapStateToProps)(Theme)

export default Theme;
