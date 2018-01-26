import React from 'react';
import { connect } from 'react-redux'
import { css } from 'aphrodite';
//own imports
import { Style } from './style.js';
import { setActiveEntity } from 'actions'

class CategoryLabel extends React.Component {

	constructor(props) {
		super(props);
    this.state = {
      shortLabels: true
    }
	}

  onLabelClicked(evt) {
    //set active entity to show modal
    this.props.dispatch(setActiveEntity(evt.target.dataset.entityId));
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

    //var shortName = abbreviateString(this.props.name);
    var displayName = ((this.props.zoomLevelHigh || this.state.shortLabels === false) ? this.props.name : this.props.shortName);
    var dots = new Array(this.props.toolsCnt)
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
