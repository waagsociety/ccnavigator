import React from 'react';
import { connect } from 'react-redux'
import { setTitle } from 'actions'
import ApiClient from 'client/ApiClient'
import { buildJSXFromHTML} from "util/utility"
import { Link } from 'react-router-dom'
import { Constants } from 'config/Constants.js'

import Label from 'components/Label';

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
    this.props.dispatch(setTitle(Constants.title))

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

        <div className="row">
          <Link className="pane pane-header" style={{ backgroundImage: "url(https://ccn.waag.org/drupal/sites/default/files/2018-05/ccn-screenshot.png)" }} to="/navigator/">
            <div className="pane-text wrapper">
              <h1>{content_1_title} <Label value="beta" color="#2FB6BC" size="0.3em" align="text-top"/></h1>
              <h2 className="subtitle">{content_1_body}</h2>
              <span className="button button-go">to the navigator!</span>
            </div>
          </Link>
        </div>

        <div className="wrapper content">
          <div className="row">
            <div className="columns">
              <Link className="column pane" to="/the-society-as-research-laboratorium">
                <img src="https://ccn.waag.org/drupal/sites/default/files/2018-05/society-as-a-laboratorium.jpg" alt="" />
                <div className="pane-text">
                  <h2>{content_2_1_title}</h2>
                  <p>{content_2_1_body} [...]</p>
                  <span className="button-link button-go">read more</span>
                </div>
              </Link>

              <Link className="column pane" to="/the-power-of-co-creation">
                <img src="https://ccn.waag.org/drupal/sites/default/files/2018-05/power-of-co-creation.jpg" alt="" />
                <div className="pane-text">
                  <h2>{content_2_2_title}</h2>
                  <p>{content_2_2_body} [...]</p>
                  <span className="button-link button-go">read more</span>
                </div>
              </Link>
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

const mapStateToProps = (state, ownProps) => ({

})
Home = connect(mapStateToProps)(Home)

export default Home;
