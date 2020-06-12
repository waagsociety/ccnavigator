import React from 'react'
import { connect } from 'react-redux'
import { setTitle } from 'actions'
import ApiClient from 'client/ApiClient'
import { buildJSXFromHTML} from "util/utility"
import Config from 'config/Config.js'
import Footer from 'containers/Footer';

class Page extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      footer: null,
      nodeEntity:null,
      includedEntities:null,
    }
  }

  componentDidMount() {
    var path = this.props.remotePath || this.props.match.path
    this.update(path)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.path !== nextProps.match.path) {
      this.update(nextProps.match.path)
    }
  }

  componentDidUpdate() {
    this.props.dispatch(setTitle(this.state.nodeEntity.attributes.title))
  }

  update(path) {
    ApiClient.instance().fetchContent("node--page", {field_path:path}, null, null, 0, function(node, included) {
      this.setState({
        nodeEntity: node[0],
        includedEntities: included
      })
    }.bind(this))
  }

  render() {
    var title = "Loading..."

    if(this.state.nodeEntity) {
      title =  this.state.nodeEntity.attributes.title || ""
      var body = (this.state.nodeEntity.attributes.body || {}).value || ""
      var jsx = buildJSXFromHTML(body)
    }

    return (
      <div id="container-page">
        <div className="wrapper">
          <div className="pane pane-border content" style={{padding: "2em"}}>
            <h1>{title}</h1>
            {jsx}
          </div>
        </div>
        { Config.footer && <Footer /> }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({

})
Page = connect(mapStateToProps)(Page)

export default Page
