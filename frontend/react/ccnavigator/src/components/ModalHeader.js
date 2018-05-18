import React from 'react';
import { Link } from 'react-router-dom'
import Label from 'components/Label';
import Back from 'containers/Back.js';


const ModalHeader = (props) => {

  var subTitle = props.subTitle ? <h2 className="subtitle">{props.subTitle}</h2> : null;

  var labels = (props.labels || []).map((label, index) => {
    return <Label key={index} value={label} />
  })


  return (
    <div className="modal-header" style={{borderTopColor: props.color}}>
      <Link to="/navigator/" className="button-close">&times;</Link>
      <Back />
      <h1 className="title">
        <div className="labels">{labels}</div>
        {props.title}
      </h1>
      {subTitle}
    </div>
  )
}

export default ModalHeader;
