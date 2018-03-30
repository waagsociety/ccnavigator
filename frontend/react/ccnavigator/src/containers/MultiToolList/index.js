import React from 'react';
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { buildJSXFromHTML } from 'util/utility.js'
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'
import ModalBody from 'components/ModalBody'
import Loading from 'components/Loading'
import { StyleSheet, css } from 'util/aphrodite-custom.js'
import { Constants } from 'config/Constants.js'


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
    ApiHelper.instance().findTermInContentHierarchy(entityId, function(term) {
      //console.log(term)
      this.setState({termHierachy: term});
    }.bind(this));
    //full info on this entity
    ApiClient.instance().fetchContent("taxonomy_term--category", entityId, null, null, 0, function(termEntity) {
      //console.log("full term data", termEntity);
      this.setState({termEntity: termEntity});
    }.bind(this));
    //full info on all nodes that have this term its child terms as term
    ApiClient.instance().fetchContent("node--tool", {"field_category.parent.uuid" : entityId}, null, null, 0, function(nodeEntities) {
      //console.log("node entities", nodeEntities);
      this.setState({nodeEntities: nodeEntities});
    }.bind(this));
  }

  closeModal() {
    this.props.history.push('/')
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

      if (this.state.termHierachy.children.length > 0) {
        if (this.state.termHierachy.children[0].children.length === 0) {

          var	boxes = this.state.termHierachy.children.map((term) => {

            var themeTools
    
            if (term.nodes.length > 0) {
              themeTools = term.nodes.map((node) => {
                var fullNode = this.state.nodeEntities.filter(function(f){ return f.id  === node.id})[0]
                return (
                  <span key={node.id} className={css(Style.tool)} style={{backgroundColor: categoryColor}}>
                    {fullNode.attributes.title}
                  </span>
                )
              })
            } else {
              themeTools = 'no tools yet...' // todo: make translatable
            }
    
            //list the tools in this subcategory
            //<h4>tools:</h4>
            var content = (
              <div>
                <p>{term.attributes.field_subtitle}</p>
                {themeTools}
              </div>
            ) // todo: make translatable
    
            return {
              link: `/theme/${term.id}`,
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


const Style = StyleSheet.create({
  tool: {
    display: 'inline-block',
    margin: '0.5em 0.5em 0 0',
    textTransform: 'lowercase',
    backgroundColor: Constants.colors.turquoise,
    color: '#FFF',
    fontSize: '0.8rem',
    lineHeight: '1.5em',
    borderRadius: '0.75em',
    padding: '0 0.5em'
  }

});

export default MultiToolList;
