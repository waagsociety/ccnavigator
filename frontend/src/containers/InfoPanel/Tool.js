import React from 'react'
import Config from 'config/Config.js'
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { setToolStatus } from 'actions'
import { connect } from 'react-redux'

import { withRouter } from 'util/withRouter'

import { buildJSXFromHTML, isID} from "util/utility"
import InfoPanel from "containers/InfoPanel/index.js"


class Tool extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      id: props.router.params.id,
      nodeEntity: null,
      includedEntities: null,
      termEntities: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.router.params.id !== state.id) {
      return {
        id: props.router.params.id,
      }
    }
    return null
  }

  componentDidMount() {
    this.update(this.props.router.params.id)
  }


  update(id) {
    //get filter definitions to be able to lookup vocabulary names
    ApiHelper.instance().getFilterDefintions((definitions) => {
      this.setState({
        filterDefintions: definitions
      })
    })

    // set filter based we have a id or path
    var filter = (isID(id) ? id : { "field_path": "/" + id })
    // full info on this node including relationships
    var includes = [...Object.values(Config.filterFieldMapping), "field_image", "field_download"]

    ApiClient.instance().fetchContent("node--tool", filter, null, includes, 0, function(node, included) {
      if(node) {
        // if we filtered by path we take the first node of the result
        if(typeof(filter) !== "string") {
          node = node[0]
        }
        //set content
        this.setState({
          nodeEntity: node,
          includedEntities: included
        })
        //lookup the terms in the hierarchy to get pathnames
        var categoryIds = ((((node || {}).relationships || {}).field_category || {}).data || []).map((cat) => {
          return cat.id
        })
        ApiHelper.instance().findTermInContentHierarchy(categoryIds, function(terms) {
          this.setState({
            termEntities: terms
          })
        }.bind(this))
      }
    }.bind(this))
  }

  // flag button hit
  onFlag() {
    var entityId = this.props.router.params.id
    this.props.dispatch(setToolStatus(entityId, "todo"))
  }

  // flag button hit
  onUnflag() {
    var entityId = this.props.router.params.id
    this.props.dispatch(setToolStatus(entityId, null))
  }

  // render image or whatever
  renderFile(item, meta) {
    var mime = (item.attributes || {}).filemime
    var filename, url
    switch(mime) {
      case "image/jpeg":
        filename = (item.attributes || {}).filename
        url = ((item.attributes || {}).uri || {}).url
        return <img key={item.id} src={ApiClient.instance().getFullURL(url)} alt={filename} />
      case "application/pdf":
        filename = (item.attributes || {}).filename
        url = ((item.attributes || {}).uri || {}).url
        var label = (meta.description) ? meta.description : 'download tool'
        return <a className="button button-download" key={item.id} href={ApiClient.instance().getFullURL(url)} target="_blank" rel="noopener noreferrer">{label}</a>
      default:
        console.log("entity mime not supported:", mime)
        break
    }
    return null
  }

  //get the term name from the includes for this tool
  resolveMetaData(relationshipName) {
    //this.state.nodeEntity, fieldName, this.state.includedEntities
    if(this.state.nodeEntity && this.state.includedEntities && this.state.filterDefintions) {
      var idRelated = (((this.state.nodeEntity["relationships"] || {})[relationshipName] || {})["data"] || {})["id"]
      if(idRelated) {
        //find term
        var term = (this.state.includedEntities || []).find((el) => {
          return (el || {}).id === idRelated
        })
        //lookup filter/vocabulary name
        var vocabularyId = ((((term || {}).relationships || {}).vid || {}).data || {}).id
        var filter = (this.state.filterDefintions || []).find((def) => {
          return def.id === vocabularyId
        })
        //return filter/value
        var name = (filter || {}).name
        var value = ((term || {}).attributes || {}).name
        return {name: name, value: value}
      }
    }
    return null
  }

  render() {
    //show loading till we have fetched all
    var content

    //build content view when we have all data
    if(this.state.nodeEntity) {

      var title = this.state.nodeEntity.attributes.title || ""

      if(this.state.termEntities) {
        var path = this.state.termEntities[0].path.slice(0, 2).map(x => x + 1).join("-")

        var color
        if (Config.zones[path]) {
          color = Config.zones[path].color
        } else if (Config.zones[path.slice(0, -2)]) {
          path = path.slice(0, -2)
          color = Config.zones[path].color
        }

      }

      const imageMeta = this.state.nodeEntity.relationships.field_image
      const imageEntity = this.state.includedEntities.find(o => o.id === imageMeta.data?.id)
      const image = imageEntity ? {...imageMeta.data?.meta, ...imageEntity?.attributes } : null

      //make tool content
      var body = (this.state.nodeEntity.attributes.body || {}).value || ""
      body = buildJSXFromHTML(body)

      // includes
      var filesMeta = ((this.state.nodeEntity.relationships || {}).field_download || {}).data || []

      var files = (this.state.includedEntities || [])
        .filter((item) => item.type === 'file--file')

      var images = (files || [])
        .filter((item) => item.attributes.filemime === "image/jpeg")
        .map((item) => {
          return this.renderFile(item)
        })

      var downloads = (files || [])
        .filter((item) => item.attributes.filemime === "application/pdf")
        .map((item) => {
          var meta = filesMeta.filter((itemMeta) => itemMeta.id === item.id)[0].meta
          return this.renderFile(item, meta)
        })

      var links = (this.state.nodeEntity.attributes.field_link || [])
        .map((item, key) => {
          return <a className="button" key={key} href={item.uri} target="_blank" rel="noopener noreferrer">{item.title}</a>
        })

      // make flag or unflag button ##include later
      // let flagButton = null
      // if(!this.props.flagged) {
      //   flagButton = <button onClick={this.onFlag.bind(this)}>flag</button>
      // } else {
      //   flagButton = <button onClick={this.onUnflag.bind(this)}>unflag</button>
      // }

      //metadata fields
      var metaDataFields = Object.values(Config.filterFieldMapping).map((fieldName) => {
        var metaData = this.resolveMetaData(fieldName)
        var field = (
          <div key={fieldName} className={"tool-meta " + fieldName.slice(6)}>
            <span className="tool-meta-name">{(metaData || {}).name}</span>
            <span className="tool-meta-value">{(metaData || {}).value}</span>
          </div>
        )
        return metaData ? field : null
      }).filter(metaDataProperty => metaDataProperty)

      content = (
        <div className="tool">
          { (metaDataFields.length > 0 ? <div className="tool-metas">{metaDataFields}</div> : null ) }

          { image && <figure>
            <img src={ApiClient.instance().getFullURL(image.uri.url)} alt={image.alt} />
            { image.title && <figcaption>{ image.title }</figcaption> }
          </figure> }
          {/* { (images.length > 0 ? <div className="tool-images">{images}</div> : null ) } */}

          { body }

          { links.length > 0 && <div className="buttons">
            <h3>links</h3>
            { links }
          </div> }

          { downloads.length > 0 && <div className="buttons">
            <h3>downloads</h3>
            { downloads }
          </div> }
        </div>
      )
    }

    return (
      <InfoPanel zone={path} title={title} color={color}>
        {content}
      </InfoPanel>
    )
  }
}

//connect the status prop to the record for this tool in redux
const mapStateToProps = (state, ownProps) => ({
  flagged: state.tools.find((item) => {return item.id === ownProps.router.params.id})
})
Tool = connect(mapStateToProps)(Tool)

export default withRouter(Tool)
