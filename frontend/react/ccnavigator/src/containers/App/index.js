import React from 'react';
import Header from "containers/Header"
import Footer from "containers/Footer"
import Metro from "containers/Metro"
import Modal from "components/Modal.js"
import Page from "containers/Page"
import ToolList from "containers/ToolList"
import MultiToolList from "containers/MultiToolList"
import ToolView from "containers/ToolView"
import GlossaryItem from "containers/GlossaryItem"
import MediaQuery from 'react-responsive';
import ModalHeader from 'components/ModalHeader'
import ModalBody from 'components/ModalBody'
import { css } from 'util/aphrodite-custom.js';
import Style from './style.js';
import ApiClient from 'client/ApiClient';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
const { detect } = require('detect-browser');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal : false,
      entityId : null,
      width: 1200,
      height: 800
    }
    this.updateDimensions = this.updateDimensions.bind(this);
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentDidMount() {
    const browser = detect();
    // handle the case where we don't detect the browser
    if (browser && browser.name === "ie") {
      alert("This website needs a modern browser to function. Recent versions of Firefox, Edge, Chrome, Opera and Safari will do.");
    }

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  componentWillReceiveProps(newProps) {
    console.log("new entity", newProps.activeEntity)
  }

  /**
   * calculate & Update state of new dimensions
   */
  updateDimensions() {
    //let update_width  = window.innerWidth;
    //let update_height = window.innerHeight;
    //this.setState({ width: update_width, height: update_height });
  }

  closeModal() {
    this.props.history.push('/')
  }

  render() {
    var about = (
      <Modal isOpen={true} onRequestClose={ () => { this.closeModal() } }>
        <ModalHeader title="About" />
        <ModalBody description="About the Co-Creation Navigator" />
      </Modal>
    )

    var introduction = (
      <Modal isOpen={true} onRequestClose={ () => { this.closeModal() } }>
        <ModalHeader title="The Co-creation Navigator" />
        <ModalBody description="Ahoy!" />
      </Modal>
    )

    var notFound = (
      <Modal isOpen={true} onRequestClose={ () => { this.closeModal() } }>
        <ModalHeader title="Not found 404" />
        <ModalBody description="Could not navigate to what you were looking for..." />
      </Modal>
    )

    return (
      <Router>
        <div className={css(Style.app_container)}>
          <MediaQuery orientation="landscape">
            <div className={css([Style.panel, Style.left_panel])} style={{width: '15rem'}}>
              <Header />
              <Footer />
            </div>
            <div className={css(Style.map_container)}>
              <Metro />
            </div>
          </MediaQuery>
          <MediaQuery orientation="portrait">
            <div className={css([Style.panel, Style.header_panel])}>
              <Header />
            </div>
            <div className={css(Style.map_container)} style={{height:'1px'}}>
              <Metro />
            </div>
            <div className={css(Style.panel)}>
              <Footer />
            </div>
          </MediaQuery>

          <Switch>
            <Route exact path="/" />
            <Route path="/introduction" render={() => introduction } />
            <Route path="/about" component={Page} />
            <Route path="/theme/:id" component={ToolList} />
            <Route path="/zone/:id" component={MultiToolList} />
            <Route path="/tool/:id" component={ToolView} />
            <Route path="/*/taxonomy/term/:id" component={GlossaryItem} />
            <Route path="*" render={() => notFound } status={404}/>
          </Switch>
        </div>
      </Router>
    );
  }

}

export default App;
