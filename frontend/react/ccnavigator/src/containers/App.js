import React from 'react';
import Header from "containers/Header.js"
import Footer from "containers/Footer.js"
import Metro from "containers/Metro"
import Home from "containers/Home.js"
import Page from "containers/Page.js"
import Theme from "containers/Theme.js"
import Zone from "containers/Zone.js"
import Tool from "containers/Tool.js"
import GlossaryItem from "containers/GlossaryItem.js"
import MediaQuery from 'react-responsive';
import 'styles/styles.css'
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

  render() {
    return (
      <Router>
        <div id="container-app">

          <MediaQuery orientation="landscape">
            <div id="panel-left" className="panel" style={{width: '15rem'}}>
              <Header />
              <Route path="*" component={Footer} />
            </div>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/navigator" component={Metro} />
              <Route path="/about" component={Page} />
              <Route path="*" component={props => <Page remotePath="/404"/>} status={404}/>
            </Switch>
          </MediaQuery>

          <MediaQuery orientation="portrait">
            <div id="panel-header" className="panel">
              <Header />
            </div>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/navigator" component={Metro} />
              <Route path="/about" component={Page} />
              <Route path="*" component={props => <Page remotePath="/404"/>} status={404}/>
            </Switch>
            <div className="panel">
              <Route path="*" component={Footer} />
            </div>
          </MediaQuery>

          <Switch>
            <Route exact path="/navigator/" />
            <Route path="/navigator/theme/:id" component={Theme} />
            <Route path="/navigator/zone/:id" component={Zone} />
            <Route path="/navigator/tool/:id" component={Tool} />
            <Route path="/navigator/*/taxonomy/term/:id" component={GlossaryItem} />
          </Switch>

        </div>
      </Router>
    );
  }

}

export default App;
