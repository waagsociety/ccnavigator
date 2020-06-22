import React from 'react';
import { Link } from 'react-router-dom'

const InfoPanelItems = (props) => {

  var items = (props.items || []).map((item, index) => {

    if (item.link) {
      return (
        <Link key={index} to={item.link} className="item">
          <h3 className="item-title">{item.title}</h3>
          {item.content}
        </Link>
      )
    } else {
      return (
        <div key={index} className="item">
          <h3 className="item-title">{item.title}</h3>
          {item.content}
        </div>
      )
    }
  })

  return (
    <div className="info-panel-items">
      {props.itemsTitle ? <h3>{props.itemsTitle}</h3> : null}
      {items.length ? <div className={`items ${props.itemsType}`}>{items}</div> : null}
      {props.children}
    </div>
  )
}

export default InfoPanelItems;
