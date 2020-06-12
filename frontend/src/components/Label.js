import React from 'react';


const Label = (props) => {

  const labelClass = (props.value.length > 1 ? "label label-bar" : "label label-circle")

  return (
    <span className={labelClass} style={{"backgroundColor" : props.color, "fontSize" : props.size, 'verticalAlign': props.align}}>
      {props.value}
    </span>
  )
}

export default Label;
