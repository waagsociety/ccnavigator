import React from 'react';
import ApiClient from 'client/ApiClient'
import { connect } from 'react-redux'

class ToolListItem extends React.Component {

	constructor(props) {
		super(props);




    //fetch content
    var imageId = ((((this.props.data || {}).relationships || {}).field_image || {}).data || {}).id;
    if(imageId != null) {
      ApiClient.instance().fetchEntity(imageId, "file/file", (data) => {
        if(data) {
          this.setState({
            image : data
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

  render() {
		var image = null;
    /*if(this.state.image) {
      var url = ((this.state.image.data || {}).attributes || {}).url || "";
      image = <img alt="preview" src={ApiClient.instance().getFullImageURL(url)} style={{width:"100%"}} />
    }*/

		console.log("en", this.props.entity);

		var name = this.props.entity.attributes.title;
		var description = this.props.entity.attributes.field_short_description || "";

    return (
      <div>
        <span style={{textDecoration:"underline"}} onClick={this.onToolSelected.bind(this)}>{name}</span>
        <div>{description}</div>
        {image}
      </div>
    )
	}

}

ToolListItem = connect()(ToolListItem)

export default ToolListItem;
