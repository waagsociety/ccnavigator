import React from 'react';
import ApiClient from 'client/ApiClient'

class ToolListItem extends React.Component {

	constructor(props) {
		super(props);
    //inital state
    this.state = {
			title : ((this.props.data || {}).attributes || {}).title,
      body : (((this.props.data || {}).attributes || {}).body || {}).value,
      image : null
		}
    //fetch content
    var imagaId = ((((this.props.data || {}).relationships || {}).field_image || {}).data || {}).id;
    if(imagaId != null) {
      ApiClient.instance().fetchEntity(imagaId, "file/file", (data) => {
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

  onToolSelected() {
    if(this.props.onToolSelected) {
      this.props.onToolSelected(this)
    }
  }

  render() {
    var image = null;
    if(this.state.image) {
      var url = ((this.state.image.data || {}).attributes || {}).url || "";
      image = <img alt="preview" src={ApiClient.instance().getFullImageURL(url)} style={{width:"100%"}} />
    }
    return (
      <div>
        <h3 style={{textDecoration:"underline"}} onClick={this.onToolSelected.bind(this)}>{this.state.title}</h3>
        <div dangerouslySetInnerHTML={{__html: this.state.body}}></div>
        {image}
      </div>
    )
	}

}


export default ToolListItem;
