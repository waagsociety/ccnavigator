import React from 'react';
import { connect } from 'react-redux'
import { setTitle } from 'actions'
import ApiClient from 'client/ApiClient'
import { Link } from 'react-router-dom'
import { Constants } from 'config/Constants.js'

import Footer from 'containers/Footer';
import Label from 'components/Label';

class Home extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      content_1: null,
      content_2_1: null,
      content_2_2: null,
      content_3_1: null,
      content_3_2: null,
    };
  }

  componentDidMount() {
    this.props.dispatch(setTitle(Constants.title))

    ApiClient.instance().fetchContent("node--page", {field_path:"/home-1"}, null, ["field_image"], 0, function(node) {
      this.setState({ content_1: node })
    }.bind(this))
    ApiClient.instance().fetchContent("node--page", {field_path:"/waags-public-research"}, null, ["field_image"], 0, function(node) {
      this.setState({ content_2_1: node })
    }.bind(this))
    ApiClient.instance().fetchContent("node--page", {field_path:"/the-power-of-co-creation"}, null, ["field_image"], 0, function(node) {
      this.setState({ content_2_2: node })
    }.bind(this))
    ApiClient.instance().fetchContent("node--page", {field_path:"/hosting-co-creation"}, null, ["field_image"], 0, function(node) {
      this.setState({ content_3_1: node })
    }.bind(this))
    ApiClient.instance().fetchContent("node--page", {field_path:"/ccn-community"}, null, ["field_image"], 0, function(node) {
      this.setState({ content_3_2: node })
    }.bind(this))
  }

  render() {

    if((this.state.content_1 || []).length > 0) {
      var content_1_title = this.state.content_1[0].attributes.title || "";
      var content_1_body = this.state.content_1[0].attributes.field_short_description || "";
    }
    if((this.state.content_2_1 || []).length > 0) {
      var content_2_1_title = this.state.content_2_1[0].attributes.title || "";
    }
    if((this.state.content_2_2 || []).length > 0) {
      var content_2_2_title = this.state.content_2_2[0].attributes.title || "";
    }
    if((this.state.content_3_1 || []).length > 0) {
      var content_3_1_title = this.state.content_3_1[0].attributes.title || "";
    }
    if((this.state.content_3_2 || []).length > 0) {
      var content_3_2_title = this.state.content_3_2[0].attributes.title || "";
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
              <Link className="column pane" to="/waags-public-research">
                <img src="https://ccn.waag.org/drupal/sites/default/files/2019-05/Public-Research.jpg" alt="" />
                <div className="pane-text">
                  <h2>{content_2_1_title}</h2>
                </div>
              </Link>

              <Link className="column pane" to="/the-power-of-co-creation">
                <img src="https://ccn.waag.org/drupal/sites/default/files/2019-05/Power-of-Co-creation.jpg" alt="" />
                <div className="pane-text">
                  <h2>{content_2_2_title}</h2>
                </div>
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="columns">
              <Link className="column pane" to="/hosting-co-creation">
                <img src="https://ccn.waag.org/drupal/sites/default/files/2019-05/Hosting-Co-creation.jpg" alt="" />
                <div className="pane-text">
                  <h2>{content_3_1_title}</h2>
                </div>
              </Link>

              <Link className="column pane" to="/ccn-community">
                <img src="https://ccn.waag.org/drupal/sites/default/files/2019-05/Community.jpg" alt="" />
                <div className="pane-text">
                  <h2>{content_3_2_title}</h2>
                </div>
              </Link>
            </div>
          </div>

        </div>

        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({})
Home = connect(mapStateToProps)(Home)

export default Home;
