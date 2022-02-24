import React from 'react';
import { connect } from 'react-redux'
import { Link, matchPath } from 'react-router-dom'
import { withRouter } from 'util/withRouter'
import Label from 'components/Label'
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
    //console.log(this.props)
    //this.unsubscribeFromHistory = this.props.history.listen(this.handleLocationChange);
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
    var currentLocation = this.props.router.location.pathname
    var navigation = (
      <div id="site-navigation">
        <div id="nav-toggle" onClick={() => {this.onNavToggle()}}><span className="fa icon"></span></div>
        <nav>
          <ul>
            { Config.nav.map(item => <li key={ item.path } className={(!item.matchPath && currentLocation === item.path) ? "current" : ""}>
                { item.path.includes("http") ?
                  <a href={item.path} target="_blank" rel="noopener noreferrer">{ item.label }</a>
                  :
                  <Link to={ item.path }>{ item.label }</Link>
                }
              </li>
            )}
          </ul>
        </nav>
      </div>
    )

    return (
      <div id="site-header" className={this.state.nav === true ? "nav-toggled" : ""}>
        <div id="site-titles">
          <h1 id="site-title">{Config.title} <Label value="beta" size="0.3em" align="text-top"/></h1>
          <h2 id="site-subtitle">{Config.subtitle}</h2>
        </div>
        {/* <LanguageSelector/> */}
        {/* <ToolSelectedList/> */}
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
