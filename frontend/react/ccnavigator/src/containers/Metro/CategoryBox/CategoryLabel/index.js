import React from 'react';
import { connect } from 'react-redux'
import { css } from 'util/aphrodite-custom.js';
//own imports
import { abbreviateString} from "util/utility.js"
import { Style } from './style.js';
import { Link } from 'react-router-dom'

class CategoryLabel extends React.Component {

	constructor(props) {
		super(props);
		var name = (this.props.entity.attributes || {}).name;
		var shortName = abbreviateString(name);
    this.state = {
      shortLabels: true,
			name: name,
			shortName: shortName
    }
	}

	onLabelMouseEnter(evt) {
		var newState = false
		if(newState !== this.state.shortLabels) {
			this.setState({
				shortLabels: newState
			})
		}
	}

	onLabelMouseLeave(evt) {
		this.setState({
			shortLabels: true
		});
	}

  render() {
    var displayName = ((this.props.zoomLevelHigh || this.state.shortLabels === false) ? this.state.name : this.state.shortName);
    var dots = new Array(this.props.entity.nodes.length || 0)
    dots.fill("•")
    return (
			<Link to={`/tool-list/${this.props.entity.id}`}>
				<div
        	className={css(Style["label"])}
        	onMouseEnter={this.onLabelMouseEnter.bind(this)}
        	onMouseLeave={this.onLabelMouseLeave.bind(this)} >
        	<span><span className={css(Style["dots"])}>{dots.join('')}</span>{displayName}</span>
      	</div>
			</Link>
    );

	}

}

//when language changes we need to do stuff
const mapStateToProps = (state, ownProps) => ({
  zoomLevelHigh: state.zoomLevelHigh
})
CategoryLabel = connect(mapStateToProps)(CategoryLabel)

export default CategoryLabel;
