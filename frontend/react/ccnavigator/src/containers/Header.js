import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ToolSelectedList from './ToolSelectedList'
import Label from 'components/Label';
import { withRouter, matchPath } from 'react-router-dom';


class Header extends React.Component {

  componentWillMount() {
    this.unsubscribeFromHistory = this.props.history.listen(this.handleLocationChange);
  }

  //
  componentDidUnMount() {
    if (this.unsubscribeFromHistory) this.unsubscribeFromHistory();
  }

  //
  handleLocationChange = (location) => {
    //console.log("location", location)
  }

  componentWillUpdate(nextProps) {
    if (nextProps.specificProperty !== this.props.specificProperty) {
      // Do whatever you want
    }
  }

  componentDidUpdate() {
    //console.log("need to fetch info about the tools selected")
  }

  render() {
    var currentLocation = this.props.location.pathname
    var navigation = (
      <nav id="site-navigation">
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
    )

    return (
      <div className="header-container">
        <div>
          <h1 id="site-title">Co-creation Navigator <Label value="beta" size="0.3em" align="text-top"/></h1>
          <h2 id="site-subtitle">guiding you through the <span className="nowrap">co-creative</span> landscape</h2>
          {navigation}
        </div>
        <ToolSelectedList/>
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
