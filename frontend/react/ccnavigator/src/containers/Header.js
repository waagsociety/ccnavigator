import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ToolSelectedList from './ToolSelectedList'
import Label from 'components/Label';
import { withRouter } from 'react-router-dom';
import MediaQuery from 'react-responsive';


class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nav: false
    };
  }

  componentWillMount() {
    this.unsubscribeFromHistory = this.props.history.listen(this.handleLocationChange);
  }

  //
  componentDidUnMount() {
    if (this.unsubscribeFromHistory) this.unsubscribeFromHistory();
  }

  //
  handleLocationChange = (location) => {
    this.setState({
      nav: false
    })
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

  onNavToggle() {
    this.setState({
      nav: !this.state.nav
    })
  }

  render() {
    var currentLocation = this.props.location.pathname

    var className = (this.state.nav === true ? "nav-toggled" : "")

    var navigation = (
      <nav id="site-navigation" className={className}>
        <MediaQuery orientation="portrait">
          <div id="nav-toggle" onClick={() => {this.onNavToggle()}}><span className="fa icon"></span>&nbsp;menu</div>
        </MediaQuery>
        <ul>
          <li className={currentLocation === "/" ? "current" : null}>
            <Link to="/">on co-creation</Link>
          </li>
          <li className={currentLocation === "/navigator/" ? "current" : null}>
            <Link to="/navigator/">the navigator</Link>
          </li>
          <li className={currentLocation === "/about" ? "current" : null}>
            <Link to="/about">about</Link>
          </li>
        </ul>
      </nav>
    )

    //<ToolSelectedList/>
    return (
      <div className="header-container">
        <div className="panel-content">
          <h1 id="site-title">Co-creation Navigator <Label value="beta" size="0.3em" align="text-top"/></h1>
          <h2 id="site-subtitle">guiding you through the <span className="nowrap">co-creative</span> landscape</h2>
          {navigation}
        </div>
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
