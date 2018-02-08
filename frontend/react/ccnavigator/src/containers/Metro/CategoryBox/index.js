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
      var path = termEntity.path.join("-");
      //render term labels (children of category)
      var termLabels = (termEntity.children || []).map((subTerm, index) => {
        var toolsCnt = ((this.state.nrOfToolsPerCategory || {})[subTerm.id]) || 0
        return (
          <CategoryLabel key={subTerm.id} entity={subTerm} toolsCnt={toolsCnt} />
        )
      });
      //put the term labels in groups of max 2
      var labelsInGroups = groupBy(termLabels, 2);
      var groupedLabels = labelsInGroups.map((group, index) => {
        return <div key={index} className={css(Style["category-box-row"])}>{group}</div>
      });
      //return category box, max 3 labels on a line
      return (
        <foreignObject width="100%" height="100%" className={css(Style["category-anchor"],Style[`category-anchor-${path}`])}>
					<div className={css(Style["category-box"],Style["no-select"])}>
						<Link to={`/multi-tool-list/${this.props.entity.id}`}>
							<span>
								{termEntity.attributes.name}
	            </span>
						</Link>
            <div>
              {groupedLabels}
            </div>
          </div>
        </foreignObject>
      )
	}
}

export default CategoryBox;
