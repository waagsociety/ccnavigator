import React from 'react';
import ApiClient from 'client/ApiClient'
import ToolListItem from "./ToolListItem"

class ToolList extends React.Component {

	constructor(props) {
		super(props);
    this.state = {
			list : null
		}
	}

	componentDidMount() {
    if(this.props.entityId) {
      ApiClient.instance().fetchContentWithTerm(this.props.entityId, function(data){
        this.setState({
          list : data.data
        });
      }.bind(this));
    }
	}

	componentDidUpdate() {
    console.log("Modal content componentDidUpdate")
  }

  componentWillUnmount() {
    console.log("Modal content componentWillUnmount")
	}

  onClose() {
    if(this.props.onClose) {
      this.props.onClose();
    }
  }

  onToolSelected(item) {
    if(this.props.onToolSelected) {
      this.props.onToolSelected(item.props.data.id) //pass entity data obj
    }
  }

  render() {
    var content = null;
    if(this.state.list) {
      content = this.state.list.map((item, index) => {
        return (
          <li key={index}>
            <ToolListItem data={item} onToolSelected={this.onToolSelected.bind(this)} />
          </li>
        );
      });
    }

    return (
      <div>
        {content}
      </div>
    );
	}

}

export default ToolList;
