import React from 'react';
import { Link } from 'react-router-dom'
import { css } from 'util/aphrodite-custom.js';
import Style from './ModalStyle.js';

const ModalBody = (props) => {

  var description = props.description ? <div className={css(Style.description)}>{props.description}</div> : ''

  var boxes = (props.boxes || []).map((box, index) => {
    var boxContents = (
      <div>
        <h3>{box.title}</h3>
        {box.content}
      </div>
    )

    if (box.link) {
      return (
        <Link key={index} to={box.link} className={css(Style.box, Style.boxLink)}>
          {boxContents}
        </Link>
      )
    } else {
      return (
        <div key={index} className={css(Style.box)}>
          {boxContents}
        </div>
      )
    }
  })

  return (
    <div className={css(Style.modalBody)}>
      {description}
      <h3>{props.boxesTitle}</h3>
      {boxes}
    </div>
  )
}

export default ModalBody;
