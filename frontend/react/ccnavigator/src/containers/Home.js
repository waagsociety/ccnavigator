import React from 'react';
import ApiClient from 'client/ApiClient'
import { buildJSXFromHTML} from "util/utility"
import { Link } from 'react-router-dom'

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
    ApiClient.instance().fetchContent("node--page", {field_path:"/the-society-as-research-laboratorium"}, null, ["field_short_description", "field_image"], 0, function(node, included) {
      this.setState({
        content_2_1: node,
        content_2_1_i: included
      });
    }.bind(this));
    ApiClient.instance().fetchContent("node--page", {field_path:"/the-power-of-co-creation"}, null, ["field_short_description", "field_image"], 0, function(node, included) {
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

    if((this.state.content_1 || []).length > 0) {
      var content_1_title = this.state.content_1[0].attributes.title || "";
      var content_1_body = this.state.content_1[0].attributes.field_short_description || "";
    }
    if((this.state.content_2_1 || []).length > 0) {
      var content_2_1_title = this.state.content_2_1[0].attributes.title || "";
      var content_2_1_body = this.state.content_2_1[0].attributes.field_short_description || "";
    }
    if((this.state.content_2_2 || []).length > 0) {
      var content_2_2_title = this.state.content_2_2[0].attributes.title || "";
      var content_2_2_body = this.state.content_2_2[0].attributes.field_short_description || "";
    }
    if((this.state.content_3 || []).length > 0) {
      var content_3_title = this.state.content_3[0].attributes.title || "";
      var content_3_body = (this.state.content_3[0].attributes.body || {}).value || "";
      content_3_body = buildJSXFromHTML(content_3_body);
    }

    return (
      <div id="container-page">
        <div className="wrapper content">

          <div className="row">
            <div className="pane pane-header" style={{ backgroundImage: "url(https://ccn.waag.org/drupal/sites/default/files/2018-05/ccn-screenshot.png)" }}>
              <div className="pane-text">
                <h1>{content_1_title}</h1>
                <h2 className="subtitle">{content_1_body}</h2>
                <Link className="button button-go" to="/navigator/">to the navigator!</Link>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="columns">
              <div className="column pane">
                <img src="https://ccn.waag.org/drupal/sites/default/files/2018-05/society-as-a-laboratorium.jpg" alt="" />
                <div className="pane-text">
                  <h2>{content_2_1_title}</h2>
                  <p>{content_2_1_body} [...]</p>
                  <Link className="button-link button-go" to="/the-society-as-research-laboratorium">read more</Link>
                </div>
              </div>

              <div className="column pane">
                <img src="https://ccn.waag.org/drupal/sites/default/files/2018-05/power-of-co-creation.jpg" alt="" />
                <div className="pane-text">
                  <h2>{content_2_2_title}</h2>
                  <p>{content_2_2_body} [...]</p>
                  <Link className="button-link button-go" to="/the-power-of-co-creation">read more</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="pane">
              <div className="pane-text">
                <h2>{content_3_title}</h2>
                {content_3_body}
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default Home;
