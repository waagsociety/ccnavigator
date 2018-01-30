import React from 'react';
import { connect } from 'react-redux'
import { css } from 'aphrodite';
//own imports
import { abbreviateString} from "util/utility.js"
import { Style } from './style.js';
import { setActiveEntity } from 'actions'

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

  onLabelClicked(evt) {
    //set active entity to show modal
    this.props.dispatch(setActiveEntity(this.props.entity));
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
      <div
        className={css(Style["label"])}
        data-entity-id={this.props.uuid}
        onMouseEnter={this.onLabelMouseEnter.bind(this)}
        onMouseLeave={this.onLabelMouseLeave.bind(this)}
        onClick={this.onLabelClicked.bind(this)} >
        <span data-entity-id={this.props.uuid}><span className={css(Style["dots"])}>{dots.join('')}</span>{displayName}</span>
      </div>
    );

	}

}

//when language changes we need to do stuff
const mapStateToProps = (state, ownProps) => ({
  zoomLevelHigh: state.zoomLevelHigh
})
CategoryLabel = connect(mapStateToProps)(CategoryLabel)

export default CategoryLabel;
