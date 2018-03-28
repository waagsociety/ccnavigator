import React from 'react';
import { css } from 'util/aphrodite-custom.js';
//own imports
import Label from 'components/Label';
import { Style } from './style.js';
//import { groupBy} from "util/utility.js"
import CategoryLabel from "./CategoryLabel"
import { Link } from 'react-router-dom'
import { Constants } from 'config/Constants.js';


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

    // render term themes (if not grandparent) 
    var termThemes
    if (termEntity.grandparent === false) {
      termThemes = (termEntity.children || []).map((subTerm, index) => {
        var toolsCnt = ((this.state.nrOfToolsPerCategory || {})[subTerm.id]) || 0
        return (
          <CategoryLabel key={subTerm.id} entity={subTerm} toolsCnt={toolsCnt} />
        )
      })
      termThemes = <div className={css(Style['category-themes'])}>{termThemes}</div>
    }

    // set class if subcategory
    var categoryClass = (path.length > 1) ? css(Style['sub-category']) : ''

    //return category box
    return (
      <foreignObject className={categoryClass} width="250" height="150" x={Constants.zones[path].x} y={Constants.zones[path].y} transform={`rotate(-45 ${Constants.zones[path].x},${Constants.zones[path].y})`}>
        <Link to={`/zone/${this.props.entity.id}`} className={css(Style["category-title-link"])}>
          <h3 className={css(Style["category-title"])}>
            <Label value={path} size={'0.6em'}/>
            <span>{termEntity.attributes.name}</span>
          </h3>
        </Link>
        {termThemes}
       </foreignObject>
    )
  }
}

export default CategoryBox;
