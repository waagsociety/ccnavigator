import React from 'react';
import { Link } from 'react-router-dom'
import Label from 'components/Label';
import { css } from 'util/aphrodite-custom.js';
import Style from './ModalStyle.js';
import Back from 'containers/Back.js';


const ModalHeader = (props) => {

  var subTitle = props.subTitle ? <h2 className={css(Style.subTitle)}>{props.subTitle}</h2> : null;

  var labels = (props.labels || []).map((label, index) => {
    return <Label key={index} value={label} />
  })


  return (
    <div className={css(Style.modalHeader)} style={{borderTopColor: props.color}}>
      <Link to="/" className={css(Style.close)}>&times;</Link>
      <Back />
      <h1 className={css(Style.title)}>
        <div className={css(Style.labels)}>{labels}</div>
        {props.title}
      </h1>
      {subTitle}
    </div>
  )
}

export default ModalHeader;
