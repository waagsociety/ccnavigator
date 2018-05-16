import React from 'react';

class ToolFilter extends React.Component {

  render() {

    return (
      <div className="tool-filters">
        <h3 className="toggle"><span className="icon"></span>tool display filters</h3>
        <div className="toggle-area">
          <div className="tool-filter">
            <h4>group size</h4>
            <ul className="tool-filter-options">
              <li>0-5</li>
              <li>5-10</li>
              <li>10-25</li>
              <li>25+</li>
            </ul>
          </div>

          <div className="tool-filter">
            <h4>duration</h4>
            <ul className="tool-filter-options">
              <li>0-5 min</li>
              <li>5-30 min</li>
              <li className="selected">30-120 min</li>
              <li>2-4 hr</li>
              <li>full day+</li>
            </ul>
          </div>

          <div className="tool-filter">
            <h4>facilitator / participant</h4>
            <ul className="tool-filter-options">
              <li>1/1</li>
              <li>1/5</li>
              <li>1/10</li>
              <li>1/25</li>
            </ul>
          </div>

          <div className="tool-filter">
            <h4>experience level facilitator</h4>
            <ul className="tool-filter-options">
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ToolFilter
