import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Constants } from 'config/Constants.js'

import Header from "containers/Header.js"
import Home from "containers/Home.js"
import Page from "containers/Page.js"
import Map from "containers/Map"

import 'styles/styles.css'


const { detect } = require('detect-browser')

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal : false,
      entityId : null,
      width: 1200,
      height: 800
    }
    this.updateDimensions = this.updateDimensions.bind(this)
    window.addEventListener("resize", this.updateDimensions.bind(this))

    this.handleKeyUp = this.handleKeyUp.bind(this)
    window.addEventListener("keyup", this.handleKeyUp.bind(this))
  }

  componentDidMount() {
    const browser = detect()
    // handle the case where we don't detect the browser
    if (browser && browser.name === "ie") {
      alert("This website needs a modern browser to function. Recent versions of Firefox, Edge, Chrome, Opera and Safari will do.")
    }

    this.updateDimensions()
    window.addEventListener("resize", this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions)
  }

  componentWillReceiveProps(newProps) {
    //console.log("new entity", newProps.activeEntity)
  }

  /**
   * calculate & Update state of new dimensions
   */
  updateDimensions() {
    //let update_width  = window.innerWidth
    //let update_height = window.innerHeight
    //this.setState({ width: update_width, height: update_height })
  }

  handleKeyUp(e) {
    if(["1", "2", "3", "4", "5"].indexOf(e.key) > -1) {
      window.svgmap.animateZoomPan(1.75, [Constants.zones[e.key].x + 75,Constants.zones[e.key].y + 15])
    }

    if(e.key === "w") {
      window.svgmap.animateZoomPan(1.4, [645,577.5])
    }

    if(e.key === "z") {
      window.svgmap.animateZoomPan(1, [500,480])
    }

    if(e.key === "m") {
      window.svgmap.animateZoomPan(1, [500,480])
    }
  }


  render() {
    return (
      <Router>
        <div id="container-app">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/the-society-as-research-laboratorium" component={Page} />
            <Route path="/the-power-of-co-creation" component={Page} />
            <Route path="/navigator" component={Map} />
            <Route path="/about" component={Page} />
            <Route path="*" component={props => <Page remotePath="/404"/>} status={404} />
          </Switch>
         </div>
      </Router>
    )
  }
}

export default App
