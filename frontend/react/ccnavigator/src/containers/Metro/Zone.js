import React from 'react';
import { Link } from 'react-router-dom'
import { Constants } from 'config/Constants.js';
//import { groupBy} from "util/utility.js"
import Label from 'components/Label';
import CategoryLabel from "./Theme.js"


class CategoryBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      shortLabels: true
    }
  }

  componentDidMount() {
  }


  render() {
    var termEntity = this.props.entity;
    var path = termEntity.path.map(x => x + 1).join("-")
    var categoryColor = Constants.colors[Constants.zones[path].color]


    // render term themes (if not grandparent)
    var termThemes
    if (termEntity.grandparent === false) {
      termThemes = (termEntity.children || []).map((subTerm, index) => {
        var name = (subTerm.attributes || {}).name;
        var count = (subTerm.nodes || []).length;
        return <CategoryLabel key={subTerm.id} uuid={subTerm.id} count={count} name={name} color={categoryColor} />
      })
      termThemes = <div className="themes">{termThemes}</div>
    }


    // set category classes
    var zoneClass = 'zone'
    if (path.length > 1) {
      zoneClass += ' sub-zone'
    }

    var categoryWidth = 230
    if(path.length > 1){
      categoryWidth = 170
    }

    //return category box
    return (
      <foreignObject className={zoneClass} width={categoryWidth} height="130" x={Constants.zones[path].x} y={Constants.zones[path].y} transform={`rotate(-45 ${Constants.zones[path].x},${Constants.zones[path].y})`}>
        <Link to={`/navigator/zone/${this.props.entity.id}`} className="zone-title-link">
          <h3 className="zone-title">
            {path.length === 1 &&
              <Label value={path} size={'0.6em'}/>
            }
            <span>{termEntity.attributes.name}</span>
          </h3>
        </Link>
        {termThemes}
       </foreignObject>
    )
  }
}

export default CategoryBox;
