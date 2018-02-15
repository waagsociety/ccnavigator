import React from 'react';
import { css } from 'util/aphrodite-custom.js';
import Style from './style.js';

const ModalHeader = (props) =>
  <div className={css(Style.container)}>
    <div className={css(Style.inset)}>
      <div className={css(Style.row)}>
        <div className={css(Style.cell)}><div className={css(Style.label)}>{props.label}</div></div>
        <div className={css(Style.cell)}><h3 className={css(Style.title)}>{props.title}</h3></div>
      </div>
      <div>
        <span className={css(Style.subTitle)}>{props.subTitle}</span>
      </div>
    </div>
  </div>

export default ModalHeader;
