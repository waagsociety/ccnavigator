import React from 'react';
import { connect } from 'react-redux'
import ToolSelectedList from './ToolSelectedList'
import { css } from 'util/aphrodite-custom.js';
import Style from './style.js';


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
    return (
      <div className={css(Style.header_container)}>
        <div>
          <h1 className={css(Style.title)}>Co-creation Navigator</h1>
          <p className={css(Style.subtitle)}>Subtitle that explains what the navigator is and does</p>
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
