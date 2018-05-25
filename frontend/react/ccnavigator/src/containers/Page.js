import React from 'react';
import ApiClient from 'client/ApiClient'
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
    var path = this.props.remotePath || this.props.match.path

    //full info on this node including relationships
    ApiClient.instance().fetchContent("node--page", {field_path:path}, null, null, 0, function(node, included) {
      this.setState({
        nodeEntity: node[0],
        includedEntities: included
      });
    }.bind(this));
  }

  closeModal() {
    this.props.history.push('/')
  }

  render() {
    if(this.state.nodeEntity) {
      var title =  this.state.nodeEntity.attributes.title || "";
      var body = (this.state.nodeEntity.attributes.body || {}).value || "";
      var jsx = buildJSXFromHTML(body);
    }

    return (
      <div id="container-page">
        <div className="wrapper">
          <div className="pane content" style={{padding: "2em"}}>
            <h1>{title}</h1>
            {jsx}
          </div>
        </div>
      </div>
    )
  }
}

export default Page;
