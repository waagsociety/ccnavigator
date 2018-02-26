import React from 'react';
import { Link } from 'react-router-dom'
import { css } from 'util/aphrodite-custom.js';
import Style from './ModalStyle.js';

const ModalHeader = (props) => {

  var subTitle = props.subTitle ? <h2 className={css(Style.subTitle)}>{props.subTitle}</h2> : null;

  var labels = (props.labels || []).map((label, index) => {
    return <span key={index} className={css(Style.label)}>{label}</span>
  })

  return (
    <div className={css(Style.modalHeader)}>
      <Link to="/" className={css(Style.close)}>&times;</Link>

      <div className={css(Style.titleContainer)}>
        <div className={css(Style.labels)}>{labels}</div>
        <h1 className={css(Style.title)}>{props.title}</h1>
      </div>

      {subTitle}
    </div>
  )
}

export default ModalHeader;
