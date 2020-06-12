import React from 'react'
import ApiClient from 'client/ApiClient'
import { buildJSXFromHTML} from "util/utility"


class Footer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      content: null
    }
  }

  componentDidMount() {
    ApiClient.instance().fetchContent("node--page", {field_path:"/footer"}, null, null, 0, function(node, included) {
      if(node) {
        this.setState({
          content: node[0]
        })
      }
    }.bind(this))
  }

  render() {

    if(this.state.content) {
      var content = (this.state.content.attributes.body || {}).value || ""
      content = buildJSXFromHTML(content)
    }


    return (
      <div id="footer">
        <div className="wrapper">
          {content}
        </div>
      </div>
    )
  }
}

export default Footer
