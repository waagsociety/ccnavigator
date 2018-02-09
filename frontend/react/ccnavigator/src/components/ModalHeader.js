import React from 'react';
import { StyleSheet, css } from 'util/aphrodite-custom.js';
import { Link } from 'react-router-dom'

const style = StyleSheet.create({
  container: {
    background:"#fff"
  },
  close:{
    position:"absolute",
    right:"10px",
    top:"10px"
  },
  row:{
    display:"flex",
    "flex-flow":"row"
  },
  cell:{
    display:"flex",
    "align-items": "center"
  },
  label:{
    background:"black",
    "border-radius": "8px",
    color: "white",
    "font-size": "16px",
    "text-transform": "uppercase",
    padding: "0 8px",
    "white-space": "nowrap"
  },
  title:{
    color: "black",
    "font-size": "36px",
    "font-weight": "bold",
    "white-space": "nowrap",
    "padding": "0 18px"
  },
  subTitle:{
    color: "black",
    "font-size": "24px",
    "white-space": "nowrap"
  },
  inset:{
    padding:"5%"
  }

});

const ModalHeader = (props) =>
  <div className={css(style.container)}>
    <Link to="/">
      <span className={css(style.close)}>&times;</span>
    </Link>
    <div className={css(style.inset)}>
      <div className={css(style.row)}>
        <div className={css(style.cell)}><div className={css(style.label)}>{props.label}</div></div>
        <div className={css(style.cell)}><h3 className={css(style.title)}>{props.title}</h3></div>
      </div>
      <div>
        <span className={css(style.subTitle)}>{props.subTitle}</span>
      </div>
    </div>
  </div>

export default ModalHeader;
