import React from 'react';
import { css } from 'util/aphrodite-custom.js';
//own imports
import { Style } from './style.js';
import { groupBy} from "util/utility.js"
import CategoryLabel from "./CategoryLabel"
import { Link } from 'react-router-dom'

class CategoryBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      shortLabels: true
    }
  }

  componentDidMount() {
  }

  /**
   *
   */
  render() {
    var termEntity = this.props.entity;
    var path = termEntity.path.map(x => x + 1).join("-")

    //render term themes (children of category)
    var termThemes = (termEntity.children || []).map((subTerm, index) => {
      var toolsCnt = ((this.state.nrOfToolsPerCategory || {})[subTerm.id]) || 0
      return (
        <CategoryLabel key={subTerm.id} entity={subTerm} toolsCnt={toolsCnt} />
      )
    });

    //put the term themes in groups of max 2
    var themesInGroups = groupBy(termThemes, 2);
    var groupedThemes = themesInGroups.map((group, index) => {
      return <div key={index} className={css(Style["category-box-row"])}>{group}</div>
    });

    var termThemesOutput
    if (termEntity.grandparent === false) {
      termThemesOutput = <div>{groupedThemes}</div>
    }

    const zoneClassName = css(
      termEntity.path.length > 1 ? Style["zone"] : [Style["zone"],Style["zone-single"]]
    ) 


    //return category box, max 2 labels on a line
    return (
      <foreignObject width="100%" height="100%" className={css(Style["category-anchor"],Style[`category-anchor-${path}`])}>
        <div className={css(Style["category-box"],Style["no-select"])}>
          <h3 className={css(Style["category-title"])}>
            <Link to={`/zone/${this.props.entity.id}`} className={css(Style["category-title-link"])}>
              <span className={zoneClassName}>{path}</span> {termEntity.attributes.name}
            </Link>
          </h3>
          {termThemesOutput}
        </div>
      </foreignObject>
    )
  }
}

export default CategoryBox;
