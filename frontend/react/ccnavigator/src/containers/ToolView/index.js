import React from 'react';
import ApiClient from 'client/ApiClient'
import { setToolStatus } from 'actions'
import { connect } from 'react-redux'
import ModalHeader from 'components/ModalHeader'

class ToolView extends React.Component {

	constructor(props) {
		super(props);

		//ApiClient.instance().fetchContent()

		/*
		http://l2thel.local/jsonapi/node/tool/73b148b4-03ce-4c20-ae76-c2f482d78e9a?include=field_image
		http://l2thel.local/jsonapi/node/tool?include=field_image
		*/

	}

	componentDidMount() {

	}

	componentDidUpdate() {
  }

  componentWillUnmount() {
	}

  onFlag() {
    this.props.dispatch(setToolStatus(this.props.entity.id, "todo"));
  }

  render() {

		var label = "";
		var title = this.props.entity.attributes.title;
		var subTitle = "";
		var status = (this.props.tool || {}).status;
		var body = (this.props.entity.attributes.body || {}).value || "";

    return (
      <div>
				<ModalHeader onClose={this.onClose.bind(this)} label={label} title={title} subTitle={subTitle}/>
        <input type="submit" value="flag " onClick={this.onFlag.bind(this)}  />
        <span>{status}</span>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{__html: body}}></div>
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
