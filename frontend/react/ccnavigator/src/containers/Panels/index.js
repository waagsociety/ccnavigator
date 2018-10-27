import React from 'react';
import { connect } from 'react-redux'
import ToolFilters from "./ToolFilters"
//import Userform from "./Userform"
//import Search from "./Search"


class Panels extends React.Component {

  render() {

    //<Userform />
    //<Search />
    return (
      <div className="panels">
        <ToolFilters />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

Panels = connect(mapStateToProps)(Panels)

export default Panels;
