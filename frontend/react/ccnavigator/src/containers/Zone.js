import React from 'react';
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { buildJSXFromHTML } from 'util/utility.js'
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'
import ModalBody from 'components/ModalBody'
import Loading from 'components/Loading'
import Label from 'components/Label'
import { connect } from 'react-redux'
import { Constants } from 'config/Constants.js'


/**
 * Get a list of tools in this category
 */
class Zone extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      termHierachy:null,
      termEntity:null,
      nodeEntities:null
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
    //full info on all nodes that have this term its child terms as term
    ApiHelper.instance().buildFilter((filter) => {
      filter["field_category.parent.uuid"] = entityId;
      ApiClient.instance().fetchContent("node--tool", filter, null, null, 0, function(nodeEntities) {
        this.setState({nodeEntities: nodeEntities});
      }.bind(this));
    });
  }

  closeModal() {
    this.props.history.push('/navigator/')
  }

  render() {
    //show loading till we have fetched all
    var modalHeader
    var modalBody = <Loading />

    //build content view when we have all data
    if(this.state.termHierachy && this.state.termEntity && this.state.nodeEntities) {
      //make header
      var path = this.state.termHierachy.path.slice(0, 2).map(x => x + 1).join("-")
      var categoryColor = Constants.colors[Constants.zones[path].color]
      //var labels = ["zone " + this.state.termHierachy.path.map(x => x + 1).join("-")]
      var labels = ["zone " + (this.state.termHierachy.path[0] + 1)]
      var title =  this.state.termEntity.attributes.name || ""
      var subTitle = this.state.termEntity.attributes.field_subtitle || ""
      modalHeader = <ModalHeader color={categoryColor} labels={labels} title={title} subTitle={subTitle} />
      //make content
      var description = (this.state.termEntity.attributes.description || {}).value || ""
      description = buildJSXFromHTML(description)
      //use the concise term with hierarchy to build the term box
      var	boxesTitle
      // if not grandparent, do boxes..
      if (this.state.termHierachy.children.length > 0) {
        if (this.state.termHierachy.children[0].children.length === 0) {
          var	boxes = this.state.termHierachy.children.map((term, index) => {

            //als filter actief toevoeging aan titeltje
            var toolsNote = ((this.props.filtersSelected || []).length > 0 ? <small className="nowrap">(matching current filters)</small> : null)
            var label = (term.nodes.length === 1 ? 'tool' : 'tools')

            //list the tools in this subcategory
            var content = (
              <div className="box-body">
                <p>{term.attributes.field_subtitle}</p>
                <div><Label value={`${term.nodes.length} ${label}`} size={'0.7em'} color={categoryColor} /> {toolsNote}</div>
              </div>
            ) // todo: make translatable
            return {
              link: `/navigator/theme/${term.id}`,
              title: term.attributes.name,
              content: content
            }
          });
          if (boxes.length > 0) {
            boxesTitle = 'themes:'
          }
        }
      }

      //compose body of modal
      modalBody = <ModalBody description={description} boxesTitle={boxesTitle} boxes={boxes} />
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

Zone = connect(mapStateToProps)(Zone)


export default Zone;
