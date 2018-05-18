import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Label from 'components/Label'

class CategoryLabel extends React.Component {

  constructor(props) {
    super(props)
    var name = (this.props.entity.attributes || {}).name
    var shortName = name.charAt(0)
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
    return (
      <Link className="theme-label" to={`/navigator/theme/${this.props.entity.id}`}>
        <span className="theme-label-text">{displayName}</span>
        {this.props.entity.nodes.length > 0 ? <Label value={this.props.entity.nodes.length} color={this.props.color} size={'1em'} /> : null}
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
