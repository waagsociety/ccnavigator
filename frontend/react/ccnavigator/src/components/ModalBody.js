import React from 'react';
import { Link } from 'react-router-dom'
import { css } from 'util/aphrodite-custom.js';
import Style from './ModalStyle.js';

const ModalBody = (props) => {

  var description = props.description ? <div className={css(Style.description)}>{props.description}</div> : ''

  var boxes = (props.boxes || []).map((box, index) => {

    if (box.link) {
      return (
        <Link key={index} to={box.link} className={css(Style.box, Style.boxLink)}>
          <h3 className={css(Style.boxTitle)}>{box.title}</h3>
          {box.content}
        </Link>
      )
    } else {
      return (
        <div key={index} className={css(Style.box)}>
          <h3 className={css(Style.boxTitle)}>{box.title}</h3>
          {box.content}
        </div>
      )
    }
  })

  return (
    <div className={css(Style.modalBody)}>
      <div className="content">{description}</div>
      <h3>{props.boxesTitle}</h3>
      <div className={css(Style.boxes)}>{boxes}</div>
    </div>
  )
}

export default ModalBody;
