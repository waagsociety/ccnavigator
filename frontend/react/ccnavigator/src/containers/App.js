import React, { useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Constants } from 'config/Constants.js'
import Config from 'config/Config.js'

import Header from "containers/Header.js"
import Home from "containers/Home.js"
import Page from "containers/Page.js"
import Map from "containers/Map"

import 'styles/styles.css'


const { detect } = require('detect-browser')


function SiteSettings() {
  const title = useSelector(state => state.title)

  useEffect(() => {
    document.title = (title ? title + " « " : "") + Config.title;
  });

  return <style>
    @import url("https://fonts.googleapis.com/css?family=Roboto+Condensed%3A300%2C300italic%2Cregular%2Citalic%2C700%2C700italic&ver=5.3.2");
    {`
      :root {
        --color-bg: ${Config.colors['color-bg']};
        --color-bg-hover: ${Config.colors['color-bg-hover']};
        --color-text: ${Config.colors['color-text']};
        --color-headings: ${Config.colors['color-headings']};
        --color-1: ${Config.colors['color-1']};
        --color-2: ${Config.colors['color-2']};
        --color-3: ${Config.colors['color-3']};
        --color-4: ${Config.colors['color-4']};
        --font-family-default: ${Config.fontFamily.default};
        --font-weight-default: ${Config.fontWeight.default};
        --font-family-headings: ${Config.fontFamily.headings};
        --font-weight-headings: ${Config.fontWeight.headings};
        --font-weight-strong: ${Config.fontWeight.strong};
      }
  `}
  </style>;
}


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title : '',
      width: 1200,
      height: 800
    }
    this.handleKeyUp = this.handleKeyUp.bind(this)
    window.addEventListener("keyup", this.handleKeyUp.bind(this))
  }

  static getDerivedStateFromProps(props, state) {
    if (props.title !== state.title) {
      return {
        title: props.title,
      }
    }
    return null
  }

  componentDidMount() {
    const browser = detect()
    // handle the case where we don't detect the browser
    if (browser && browser.name === "ie") {
      alert("This website needs a modern browser to function. Recent versions of Firefox, Edge, Chrome, Opera and Safari will do.")
    }
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
          <SiteSettings />
          { Config.header && <Header /> }
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/waags-public-research" component={Page} />
            <Route path="/the-power-of-co-creation" component={Page} />
            <Route path="/hosting-co-creation" component={Page} />
            <Route path="/ccn-community" component={Page} />
            <Route path="/navigator" component={Map} />
            <Route path="/about" component={Page} />
            <Route path="*" component={props => <Page remotePath="/404"/>} status={404} />
          </Switch>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  title: state.title,
})
App = connect(mapStateToProps)(App)

export default App
