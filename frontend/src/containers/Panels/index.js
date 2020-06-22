import React from 'react';
import ToolFilters from "./ToolFilters"
import Practices from "./Practices"
//import Userform from "./Userform"
//import Search from "./Search"


class Panels extends React.Component {
  render() {
    //<Userform />
    //<Search />
    return (
      <div className="panels">
        <Practices />
        <ToolFilters />
      </div>
    )
  }
}

export default Panels
