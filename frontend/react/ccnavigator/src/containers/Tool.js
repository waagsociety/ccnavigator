import React from 'react';
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { setToolStatus } from 'actions'
import { connect } from 'react-redux'
import Modal from "components/Modal.js"
import ModalHeader from 'components/ModalHeader'
import ModalBody from 'components/ModalBody'
import Loading from 'components/Loading'
import { buildJSXFromHTML} from "util/utility"


class Tool extends React.Component {

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
    ApiClient.instance().fetchContent("node--tool", entityId, null, ["field_image", "field_download"], 0, function(node, included) {
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
  renderFile(item, meta) {
    //console.log("ite", item)
    var mime = (item.attributes || {}).filemime;
    var filename, url;
    switch(mime) {
      case "image/jpeg":
        filename = (item.attributes || {}).filename;
        url = (item.attributes || {}).url;
        return <img key={item.id} src={ApiClient.instance().getFullURL(url)} alt={filename} />
      case "application/pdf":
        filename = (item.attributes || {}).filename;
        url = (item.attributes || {}).url;
        var label = (meta.description) ? meta.description : 'download';
        return <a className="button" key={item.id} href={ApiClient.instance().getFullURL(url)} target="_blank">{label}</a>
      default:
        console.log("entity mime not supported:", mime);
        break;
    }
    return null;
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

      //make header
      var title =  this.state.nodeEntity.attributes.title || "";
      var labels = [];

      //display the caterories this tool falls under
      if(this.state.termEntities) {
        labels = this.state.termEntities.map((term) => {
          return "zone " + (term.path[0] + 1)
        });
      }
      modalHeader = <ModalHeader labels={labels} title={title} />

      //make tool description
      var body = (this.state.nodeEntity.attributes.body || {}).value || "";
      var jsx = buildJSXFromHTML(body);

      // includes
      var filesMeta = ((this.state.nodeEntity.relationships || {}).field_download || {}).data || [];

      var files = (this.state.includedEntities || [])
        .filter((item) => item.type === 'file--file')

      var images = (files || [])
        .filter((item) => item.attributes.filemime === "image/jpeg")
        .map((item) => { return this.renderFile(item) })

      var downloads = (files || [])
        .filter((item) => item.attributes.filemime === "application/pdf")
        .map((item) => {
          var meta = filesMeta.filter((itemMeta) => itemMeta.id === item.id)[0].meta
          return this.renderFile(item, meta)
        })

      var links = (this.state.nodeEntity.attributes.field_link || [])
        .map((item, key) => {
          return <a className="button" key={key} href={item.uri} target="_blank">{item.title}</a>
        })


      // make flag or unflag button ##include later
      // let flagButton = null;
      // if(!this.props.flagged) {
      //   flagButton = <button onClick={this.onFlag.bind(this)}>flag</button>
      // } else {
      //   flagButton = <button onClick={this.onUnflag.bind(this)}>unflag</button>
      // }

      //body part
      var description = (
        <div>
          <div className="tool-metas">
            <div className="tool-meta">
              <span className="tool-meta-name">group size:</span>
              <span className="tool-meta-value">0-5</span>
            </div>
            <div className="tool-meta">
              <span className="tool-meta-name">duration:</span>
              <span className="tool-meta-value">30-120 min</span>
            </div>
            <div className="tool-meta">
              <span className="tool-meta-name">facilitator / participant:</span>
              <span className="tool-meta-value">1/5</span>
            </div>
            <div className="tool-meta">
              <span className="tool-meta-name">experience level facilitator:</span>
              <span className="tool-meta-value">2</span>
            </div>
          </div>
          <div className="columns">
            <div className="column">
              {images}
            </div>
            <div className="column">
              {jsx}
              {links}
              {downloads}
            </div>
          </div>
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
Tool = connect(mapStateToProps)(Tool)

export default Tool;
