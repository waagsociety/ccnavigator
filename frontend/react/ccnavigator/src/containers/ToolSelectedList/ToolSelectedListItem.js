import React from 'react';


const ToolSelectedListItem = (props) =>
  <div className="tool">
    <h5>{props.title}</h5>
    <button onClick={() => {props.onDelete(props)}}>delete</button>
  </div>

export default ToolSelectedListItem;
