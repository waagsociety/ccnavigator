import React from 'react';
import { css } from 'aphrodite';
//own imports
import ApiClient from 'client/ApiClient'
import { Style } from './style.js';
import { groupBy, abbreviateString} from "util/utility.js"
import CategoryLabel from "./CategoryLabel"

class CategoryBox extends React.Component {

	constructor(props) {
		super(props);
    this.state = {
      shortLabels: true
    }
	}

  componentDidMount() {
    //TODO: move to APIHelper because this function gets called more then once and needs to be cached
		ApiClient.instance().fetchContent("tool", function(data) {
			if(data) {
				//count the categories linked in each tool node
				var nrOfToolsPerCategory = data.reduce(function(table, tool) {
          var cats = ((tool.relationships || {}).field_category || {}).data || []
					for(var i=0;i<cats.length;i++) {
						//raise the cnt for linked category id
						var id = cats[i].id;
						var cnt = table[id] || 0;
						table[id] = cnt + 1;
					}
					return table;
			  }, {});
        this.setState({
          nrOfToolsPerCategory: nrOfToolsPerCategory
        })
			}
		}.bind(this));
  }

  onTitleClicked(evt) {
		alert("category box title clicked")
	}

	/**
   *
   *
	 */
  render() {
      var cat = this.props.data;
      var path = this.props.path;
      //render term labels (children of category)
      var termLabels = (cat.children || []).map((subcat, index) => {
        var shortName = abbreviateString(subcat.name);
        var toolsCnt = ((this.state.nrOfToolsPerCategory || {})[subcat.id]) || 0
        return (
          <CategoryLabel key={subcat.id} name={subcat.name} shortName={shortName} uuid={subcat.id} toolsCnt={toolsCnt} />
        )
      });
      //put the term labels in groups of max 3
      var labelsInGroups = groupBy(termLabels, 2);
      var groupedLabels = labelsInGroups.map((group, index) => {
        return <div key={index} className={css(Style["category-box-row"])}>{group}</div>
      });
      //return category box, max 3 labels on a line
      return (
        <foreignObject width="100%" height="100%" className={css(Style["category-anchor"],Style[`category-anchor-${path}`])}>
          <div className={css(Style["category-box"])}>
            <span
              key={cat.id}
              data-entity-id={cat.id}
              onClick={this.onTitleClicked.bind(this)} >
              {cat.name}
            </span>
            <div>
              {groupedLabels}
            </div>
          </div>
        </foreignObject>
      )
	}
}

export default CategoryBox;
