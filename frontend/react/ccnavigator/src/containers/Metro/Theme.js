import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Label from 'components/Label'

class CategoryLabel extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      shortLabels: true
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
    var shortName = this.props.name.charAt(0);
    var displayName = ((this.props.zoomLevelHigh || this.state.shortLabels === false) ? this.props.name : shortName);
    return (
      <Link className="theme-label" to={`/navigator/theme/${this.props.uuid}`}>
        <span className="theme-label-text">{displayName}</span>
        <Label value={this.props.count ? this.props.count : "0" } color={this.props.count ? this.props.color : "lightgray"} size={'1em'} />
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
