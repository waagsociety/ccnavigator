import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ToolSelectedList from './ToolSelectedList'
import Label from 'components/Label';


class Header extends React.Component {

  componentWillUpdate(nextProps) {
    if (nextProps.specificProperty !== this.props.specificProperty) {
      // Do whatever you want
    }
  }

  componentDidUpdate() {
    console.log("need to fetch info about the tools selected")
  }

  render() {

    // TODO: apply current class when current
    var navigation = (
      <nav id="site-navigation">
        <ul>
          <li>
            <Link to="/">on co-creation</Link>
          </li>
          <li className="current">
            <Link to="/navigator">the navigator</Link>
          </li>
          <li>
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

export default Header;
