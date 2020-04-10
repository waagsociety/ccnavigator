import React from 'react';
import { connect } from 'react-redux'
import { Link, withRouter, matchPath } from 'react-router-dom';
import Label from 'components/Label';
import Config from 'config/Config.js'
//import ToolSelectedList from './ToolSelectedList'
//import LanguageSelector from "containers/LanguageSelector"


class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nav: false
    };
  }

  componentDidMount() {
    this.unsubscribeFromHistory = this.props.history.listen(this.handleLocationChange);
  }

  componentDidUnMount() {
    if (this.unsubscribeFromHistory) this.unsubscribeFromHistory();
  }


  handleLocationChange = (location) => {
    this.setState({
      nav: false
    })
  }

  onNavToggle() {
    this.setState({
      nav: !this.state.nav
    })
  }

  render() {
    var currentLocation = this.props.location.pathname
    var navigation = (
      <div id="site-navigation">
        <div id="nav-toggle" onClick={() => {this.onNavToggle()}}><span className="fa icon"></span></div>
        <nav>
          <ul>
            <li className={currentLocation === "/" ? "current" : null}>
              <Link to="/">on co-creation</Link>
            </li>
            <li className={matchPath(currentLocation, {path:"/navigator/*"}) ? "current" : null}>
              <Link to="/navigator/">the navigator</Link>
            </li>
            <li className={currentLocation === "/about" ? "current" : null}>
              <Link to="/about">about</Link>
            </li>
          </ul>
        </nav>
      </div>
    )

    var className = (this.state.nav === true ? "nav-toggled" : "")

    //<ToolSelectedList/>
    //<LanguageSelector/>
    return (
      <div id="site-header" className={className}>
        <div id="site-titles">
          <h1 id="site-title">{Config.title} <Label value="beta" size="0.3em" align="text-top"/></h1>
          <h2 id="site-subtitle">guiding you through the <span className="nowrap">co-creative</span> landscape</h2>
        </div>
        {navigation}
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

Header = connect(mapStateToProps)(Header)
Header = withRouter(Header)

export default Header;
