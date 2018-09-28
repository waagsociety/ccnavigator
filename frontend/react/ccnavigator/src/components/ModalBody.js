import React from 'react';
import { Link } from 'react-router-dom'

const ModalBody = (props) => {

  var description = props.description ? <div className="description">{props.description}</div> : ''

  var boxes = (props.boxes || []).map((box, index) => {

    if (box.link) {
      return (
        <Link key={index} to={box.link} className="box">
          <h3 className="box-title">{box.title}</h3>
          {box.content}
        </Link>
      )
    } else {
      return (
        <div key={index} className="box">
          <h3 className="box-title">{box.title}</h3>
          {box.content}
        </div>
      )
    }
  })

  return (
    <div className="modal-body">
      <div className="content">{description}</div>
      <h3>{props.boxesTitle}</h3>
      <div className={`boxes ${props.boxesType}`}>{boxes}</div>
    </div>
  )
}

export default ModalBody;
