import React from 'react';
import { StyleSheet, css } from "aphrodite";

const style = StyleSheet.create({
  container: {
    background:"#fff"
  },
  close:{
    position:"absolute",
    right:"1%",
    top:"1%"
  },
  label:{
    background:"black",
    "border-radius": "8px",
    color: "white",
    "font-size": "16px",
    "text-transform": "uppercase",
    display: "inline-block",
    padding: "0% 20%",
    "white-space": "nowrap"
  },
  title:{
    color: "black",
    "font-size": "36px",
    "font-weight": "bold",
    display: "inline-block",
    padding: "0% 10%",
    "white-space": "nowrap"
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
  <div className={css(style.container)} onClick={props.onClose}>
    <span className={css(style.close)}>&times;</span>
    <div className={css(style.inset)}>
      <table>
        <tbody>
          <tr>
            <td><span className={css(style.label)}>{props.label}</span></td>
            <td><span className={css(style.title)}>{props.title}</span></td>
          </tr>
        </tbody>
      </table>
      <div>
        <span className={css(style.subTitle)}>{props.subTitle}</span>
      </div>
    </div>
  </div>

export default ModalHeader;
