import React from 'react';
import ApiClient from 'client/ApiClient'
import { buildJSXFromHTML} from "util/utility"

class Home extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      content_1: null,
      content_2_1: null,
      content_2_2: null,
      content_3: null,
      content_1_i: null,
      content_2_1_i: null,
      content_2_2_i: null,
      content_3_i: null,
    };
  }

  componentDidMount() {
    ApiClient.instance().fetchContent("node--page", {field_path:"/home-1"}, null, ["field_image"], 0, function(node, included) {
      this.setState({
        content_1: node,
        content_1_i: included
      });
    }.bind(this));
    ApiClient.instance().fetchContent("node--page", {field_path:"/home-2-1"}, null, ["field_image"], 0, function(node, included) {
      this.setState({
        content_2_1: node,
        content_2_1_i: included
      });
    }.bind(this));
    ApiClient.instance().fetchContent("node--page", {field_path:"/home-2-2"}, null, ["field_image"], 0, function(node, included) {
      this.setState({
        content_2_2: node,
        content_2_2_i: included
      });
    }.bind(this));
    ApiClient.instance().fetchContent("node--page", {field_path:"/home-3"}, null, ["field_image"], 0, function(node, included) {
      this.setState({
        content_3: node,
        content_3_i: included
      });
    }.bind(this));
    }

  render() {

    if(this.state.content_1) {
      console.log(this.state.content_1_i)
      var content_1_title = this.state.content_1[0].attributes.title || "";
      var content_1_body = (this.state.content_1[0].attributes.body || {}).value || "";
      var content_1_body = buildJSXFromHTML(content_1_body);
    }
    if(this.state.content_2_1) {
      var content_2_1_title = this.state.content_2_1[0].attributes.title || "";
      var content_2_1_body = (this.state.content_2_1[0].attributes.body || {}).value || "";
      var content_2_1_body = buildJSXFromHTML(content_2_1_body);
    }
    if(this.state.content_2_2) {
      var content_2_2_title = this.state.content_2_2[0].attributes.title || "";
      var content_2_2_body = (this.state.content_2_2[0].attributes.body || {}).value || "";
      var content_2_2_body = buildJSXFromHTML(content_2_2_body);
    }
    if(this.state.content_3) {
      var content_3_title = this.state.content_3[0].attributes.title || "";
      var content_3_body = (this.state.content_3[0].attributes.body || {}).value || "";
      var content_3_body = buildJSXFromHTML(content_3_body);
    }

    return (
      <div id="container-page">
        <div className="wrapper content">

          <div className="row">
            <div className="pane">
            {content_1_body}
            </div>
          </div>

          <div className="row">
            <div className="columns">
              <div className="column pane">
                <h2>{content_2_1_title}</h2>
                {content_2_1_body}
              </div>

              <div className="column pane">
                <h2>{content_2_2_title}</h2>
                {content_2_2_body}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="pane">
            <h2>{content_3_title}</h2>
            {content_3_body}
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default Home;
