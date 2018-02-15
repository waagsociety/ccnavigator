import React from 'react';
import { css } from 'util/aphrodite-custom.js';
import Style from './style.js';

const ModalHeader = (props) =>
  <div className={css(Style.container)}>
    <div className={css(Style.titleRow)}>
      <div className={css(Style.label)}>{props.label}</div>
      <h1 className={css(Style.title)}>{props.title}</h1>
    </div>
    <h2 className={css(Style.subTitle)}>{props.subTitle}</h2>
  </div>

export default ModalHeader;
