import React from 'react';
import { Link } from 'react-router-dom'
import { css } from 'util/aphrodite-custom.js';
import Style from './ModalStyle.js';

const ModalHeader = (props) =>
  <div className={css(Style.modalHeader)}>
    <Link to="/" className={css(Style.close)}>&times;</Link>
    <div className={css(Style.titleRow)}>
      <div className={css(Style.label)}>{props.label}</div>
      <h1 className={css(Style.title)}>{props.title}</h1>
    </div>
    <h2 className={css(Style.subTitle)}>{props.subTitle}</h2>
  </div>

export default ModalHeader;
