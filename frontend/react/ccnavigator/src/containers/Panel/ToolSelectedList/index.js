import React from 'react';
import { connect } from 'react-redux'
import ToolSelectedListItem from "./ToolSelectedListItem"

class ToolSelectedList extends React.Component {

	constructor(props) {
		super(props);
    this.state = {
		}
	}

	render() {
    var list = this.props.tools.map((tool, index) => { return <ToolSelectedListItem key={tool.uuid} entityId={tool.uuid} /> })
    return (
      <div>
        {list}
      </div>
    );
	}

}

//connect the status prop to the record for this tool in redux
const mapStateToProps = (state, ownProps) => ({
  tools: state.tools
})
ToolSelectedList = connect(mapStateToProps)(ToolSelectedList)

export default ToolSelectedList;
