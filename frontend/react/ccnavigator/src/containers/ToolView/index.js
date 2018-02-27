import React from 'react';
import { css } from 'util/aphrodite-custom.js';
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { setToolStatus } from 'actions'
import { connect } from 'react-redux'
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'
import ModalBody from 'components/ModalBody'
import Style from 'components/ModalStyle.js';
import { buildJSXFromHTML} from "util/utility"


class ToolView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nodeEntity:null,
      includedEntities:null,
      termEntities:null
    };
  }

  componentDidMount() {
    var entityId = this.props.match.params.id;
    //full info on this node including relationships
    ApiClient.instance().fetchContent("node--tool", entityId, null, ["field_image", "field_download"], function(node, included) {
      //set content
      this.setState({
        nodeEntity: node,
        includedEntities: included
      });
      //lookup the terms in the hierarchy to get pathnames
      var categoryIds = (((node.relationships || {}).field_category || {}).data || []).map((cat) => {
        return cat.id;
      });
      ApiHelper.instance().findTermInContentHierarchy(categoryIds, function(terms) {
        this.setState({
          termEntities: terms
        });
      }.bind(this));
    }.bind(this));
  }

  /**
   * flag button hit
   */
  onFlag() {
    var entityId = this.props.match.params.id;
    this.props.dispatch(setToolStatus(entityId, "todo"));
  }

  /**
   * flag button hit
   */
  onUnflag() {
    var entityId = this.props.match.params.id;
    this.props.dispatch(setToolStatus(entityId, null));
  }

  /**
   * render image or whatever
   */
  renderInclude(item) {
    console.log("ite", item)
    switch(item.type) {
      case "file--file":
        var mime = (item.attributes || {}).filemime;
        var filename, url;
        switch(mime) {
          case "image/jpeg":
            filename = (item.attributes || {}).filename;
            url = (item.attributes || {}).url;
            return <img key={item.id} className={css(Style.image)} src={ApiClient.instance().getFullURL(url)} alt={filename} />
          case "application/pdf":
            filename = (item.attributes || {}).filename;
            url = (item.attributes || {}).url;
            return <a key={item.id} href={ApiClient.instance().getFullURL(url)} target="_blank"><button>DOWNLOAD</button></a>
          default:
            console.log("entity mime not supported:", mime);
            break;
        }
        break;
      default:
        console.log("entity type not supported:", item.type);
        break;
    }
    return null;
  }

  closeModal() {
    this.props.history.push('/')
  }

  render() {
    //show loading till we have fetched all
    var modalHeader = <ModalHeader title={"loading"} />
    var modalBody = "loading";

    //build content view when we have all data
    if(this.state.nodeEntity) {

      //make header
      var title =  this.state.nodeEntity.attributes.title || "";
      var labels = [];

      //display the caterories this tool falls under
      if(this.state.termEntities) {
        labels = this.state.termEntities.map((term) => {
          return term.path.map(x => x + 1).join("-")
        });
      }
      modalHeader = <ModalHeader labels={labels} title={title} />

      //make tool description
      var body = (this.state.nodeEntity.attributes.body || {}).value || "";
      var jsx = buildJSXFromHTML(body);
      //includes
      var includes = (this.state.includedEntities || []).map((item) => {
        return this.renderInclude(item);
      });

      //make flag or unflag button
      let button = null;
      if(!this.props.flagged) {
        button = <button onClick={this.onFlag.bind(this)}>flag</button>
      } else {
        button = <button onClick={this.onUnflag.bind(this)}>unflag</button>
      }

      //body part
      var description = (
        <div>
          {button}
          {jsx}
          {includes}
        </div>
      )
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

//connect the status prop to the record for this tool in redux
const mapStateToProps = (state, ownProps) => ({
  flagged: state.tools.find((item) => {return item.uuid === ownProps.match.params.id})
})
ToolView = connect(mapStateToProps)(ToolView)

export default ToolView;
