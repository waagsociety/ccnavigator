import React from 'react';
import { connect } from 'react-redux'
import ToolSelectedListItem from "./ToolSelectedListItem.js"
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
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.update(nextProps.tools);
  }

  /**
   * retrieve tool node data from stored hierarchy
   */
  update(tools) {
    var toolIds = tools.map((tool) => {return tool.id});
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
        var nodeInfo = this.state.nodeEntities.filter((node) => { return node.id === tool.id})[0];
        var title = ((nodeInfo || {}).attributes || {}).title;
        return <ToolSelectedListItem id={tool.id} key={tool.id} title={title} onDelete={this.onDeleteItem.bind(this)} />
      });
    }

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
