import React from 'react';
import ApiClient from 'client/ApiClient'
import { setToolStatus } from 'actions'
import { connect } from 'react-redux'

class ToolView extends React.Component {

	constructor(props) {
		super(props);
    //init state
    this.state = {
			title : null,
      body : null
		}
    //fetch content
    if(this.props.entityId) {
      ApiClient.instance().fetchEntity(this.props.entityId, "node/tool", (data) => {
        if(data) {
          this.setState({
            title : ((data.data || {}).attributes || {}).title,
            body : (((data.data || {}).attributes || {}).body || {}).value
          });
        }
      });
    }
	}

	componentDidMount() {

	}

	componentDidUpdate() {
  }

  componentWillUnmount() {
	}

  onFlag() {
    this.props.dispatch(setToolStatus(this.props.entityId, "todo"));
  }

  render() {

    var status = (this.props.tool || {}).status;

    return (
      <div>
        <input type="submit" value="flag " onClick={this.onFlag.bind(this)}  />
        <span>{status}</span>
        <h3>{this.state.title}</h3>
        <div dangerouslySetInnerHTML={{__html: this.state.body}}></div>
      </div>
    )
	}

}

//connect the status prop to the record for this tool in redux
const mapStateToProps = (state, ownProps) => ({
  tool: state.tools.find((item) => {return item.uuid === ownProps.entityId})
})
ToolView = connect(mapStateToProps)(ToolView)

export default ToolView;
