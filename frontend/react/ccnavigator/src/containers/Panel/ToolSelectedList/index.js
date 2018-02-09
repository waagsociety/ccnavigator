import React from 'react';
import { connect } from 'react-redux'
import ToolSelectedListItem from "./ToolSelectedListItem"
import ApiHelper from 'client/ApiHelper'
import { setToolStatus } from 'actions'

class ToolSelectedList extends React.Component {

	constructor(props) {
		super(props);
    this.state = {
			nodeEntities: null
		}
	}

	componentDidMount() {
		this.update(this.props.tools);
	}

	/**
	 * when tool list changes
	 */
	componentWillReceiveProps(nextProps) {
		this.update(nextProps.tools);
	}

	/**
	 * retrieve tool node data from stored hierarchy
	 */
	update(tools) {
		var toolIds = tools.map((tool) => {return tool.uuid});
		ApiHelper.instance().findNodeInContentHierarchy(toolIds, function(nodes) {
			this.setState({
				nodeEntities: nodes
			});
		}.bind(this));
	}

	onDeleteItem(props) {
		this.props.dispatch(setToolStatus(props.id, null));
	}

	render() {
		var list = null;
		// join the tool data from redux with node data
		if(this.props.tools && this.state.nodeEntities) {
			list = this.props.tools.map((tool, index) => {
				var nodeInfo = this.state.nodeEntities.filter((node) => { return node.id == tool.uuid})[0];
				var title = ((nodeInfo || {}).attributes || {}).title;
				return <ToolSelectedListItem id={tool.uuid} key={tool.uuid} title={title} onDelete={this.onDeleteItem.bind(this)} />
			});
		}

		return (
			<div style={{width:"100%"}}>
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
