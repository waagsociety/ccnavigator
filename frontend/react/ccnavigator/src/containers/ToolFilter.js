import React from 'react';

class ToolFilter extends React.Component {


  render() {
    var filters = {
      groupSize: ["0-5", "5-10", "10-25", "25+"],
      duration: ["0-5 min", "5-30 min", "30-120 min", "2-4 hr", "full day+"],
      facilitatorParticipant: ["1/1", "1/5", "1/10", "1/25"],
      experienceLevelFacilitator: ["1", "2", "3", "4"],
    }

    return (
      <div className="tool-filters">
        <h3><span className="icon"></span>tool display filters</h3>

        <div className="tool-filter">
          <h4>group size</h4>
          <ul className="tool-filter-options">
            <li>0-5</li>
            <li>5-10</li>
            <li>10-25</li>
            <li>25+</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ToolFilter;
