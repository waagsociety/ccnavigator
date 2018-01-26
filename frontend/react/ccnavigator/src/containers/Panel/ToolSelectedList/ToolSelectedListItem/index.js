import React from 'react';
import { connect } from 'react-redux'
import { css } from 'aphrodite';
import { removeTool } from 'actions'
import Style from './style.js';

class ToolSelectedListItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			title : this.props.entityId
		}
		if(this.props.entityId) {
      /*ApiClient.fetchEntity(this.props.entityId, "node/tool_block", (data) => {
        if(data) {
          this.setState({
            title : ((data.data || {}).attributes || {}).title
          });
        }
      });*/
    }
	}

	componentDidMount() {
	}

	componentDidUpdate() {
  }

  componentWillUnmount() {
	}

	onDelete(evt) {
		this.props.dispatch(removeTool(this.props.entityId));
	}

  render() {
    return (
			<tr className={css(Style.container)}>
				<td>{this.state.title}</td>
				<td><button className={css(Style.delete)} onClick={this.onDelete.bind(this)}>delete</button></td>
			</tr>
		)
	}
}

ToolSelectedListItem = connect()(ToolSelectedListItem)

export default ToolSelectedListItem;
