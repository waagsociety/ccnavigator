import React from 'react';
import { connect } from 'react-redux'
import { css } from 'util/aphrodite-custom.js'
//own imports
import Label from 'components/Label'
import { firstLettersString } from "util/utility.js"
import { Style } from './style.js'
import { Link } from 'react-router-dom'
import { Constants } from 'config/Constants'

class CategoryLabel extends React.Component {

  constructor(props) {
    super(props);
    var name = (this.props.entity.attributes || {}).name;
    var shortName = firstLettersString(name);
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

    //onMouseEnter={this.onLabelMouseEnter.bind(this)}
    //onMouseLeave={this.onLabelMouseLeave.bind(this)}

    return (
      <Link className={css(Style["label"])} to={`/theme/${this.props.entity.id}`}>
        <Label value={this.props.entity.nodes.length} color={[Constants.colors.turquoise]} />
        {displayName}
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
