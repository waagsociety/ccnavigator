import React from 'react';
import { StyleSheet, css } from 'util/aphrodite-custom.js';


const Label = (props) => {

  const labelClass = css(
    (props.value.length > 1) ? Style.labelBar : Style.labelCircle,
    Style.label
  )

  return (
    <span className={labelClass} style={{"backgroundColor" : props.color, "fontSize" : props.size}}>
      {props.value}
    </span>
  )
}

const Style = StyleSheet.create({
  label: {
    display: 'inline-block',
    margin: '0.25em 0',
    background: 'black',
    borderRadius: '0.75em',
    color: 'white',
    fontSize: '0.4em',
    height: '1.5em',
    lineHeight: '1.75em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    verticalAlign: 'middle',

    ':first-child': {
      marginRight: '0.5em'
    },
    ':last-child': {
      marginLeft: '0.5em'
    }
  },
  labelCircle: {
    width: '1.5em',
    textAlign: 'center'
  },
  labelBar: {
    padding: '0 0.65em',
  }
});


export default Label;
