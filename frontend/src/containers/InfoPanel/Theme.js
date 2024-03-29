import React from 'react'
import Config from 'config/Config'
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { connect } from 'react-redux'
import { buildJSXFromHTML, isID } from 'util/utility.js'

import { withRouter } from 'util/withRouter'

import InfoPanel from "containers/InfoPanel/index.js"
import InfoPanelItems from 'components/InfoPanelItems'


class Theme extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      id: props.router.params.id,
      filtersSelected: props.filtersSelected,
      termHierachy: null,
      termEntity: null,
      nodeEntities: null,
      includedEntities: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.router.params.id !== state.id) {
      return {
        id: props.router.params.id,
      }
    }
    if (props.filtersSelected !== state.filtersSelected) {
      return {
        filtersSelected: props.filtersSelected,
      }
    }
    return null
  }

  componentDidMount() {
    this.update(this.state.id)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.router.params.id !== prevProps.router.params.id) {
      this.update(this.props.router.params.id)
    }
    if (this.props.filtersSelected !== prevProps.filtersSelected) {
      this.update(this.state.id)
    }
  }

  update(id) {
    ApiHelper.instance().clearCaches()

    // set filter based we have a id or path
    var filter = (isID(id) ? id : { "field_path": "/" + id })

    //full info on this entity
    ApiClient.instance().fetchContent("taxonomy_term--category", filter, null, null, 0, function(termEntity) {
      if(typeof(filter) !== "string") {
        termEntity = termEntity[0]
      }
      this.setState({termEntity: termEntity})

      //get hierarchy path of this term
      ApiHelper.instance().findTermInContentHierarchy(termEntity.id, function(term) {
        this.setState({termHierachy: term})
      }.bind(this))

      //full info on all nodes that have this term
      ApiHelper.instance().buildFilter((filter) => {
        filter["field_category.id"] = termEntity.id
        ApiClient.instance().fetchContent("node--tool", filter, null, Object.values(Config.filterFieldMapping), 0, function(nodeEntities, included) {
          //connect relationships to include in entity
          this.setState({
            nodeEntities: nodeEntities,
            includedEntities: included
          })
        }.bind(this))
      })

    }.bind(this))

  }

  onToolSelected(item) {
    if(this.props.onToolSelected) {
      this.props.onToolSelected(item.props.data.id) //pass entity data obj
    }
  }

  resolveRelationship(tool, relationshipName, includes) {
    var idRelated = (((tool["relationships"] || {})[relationshipName] || {})["data"] || {})["id"]
    if(idRelated) {
      var found = (includes || []).find((el) => {
        return (el || {}).id === idRelated
      })
      return (found.attributes || {}).name
    }
    return null
  }

  render() {
    var content

    //build content view when we have all data
    if(this.state.termHierachy && this.state.termEntity && this.state.nodeEntities) {

      //make header
      var path = this.state.termHierachy.path.slice(0, 2).map(x => x + 1).join("-")
      var color
      if (Config.zones[path]) {
        color = Config.zones[path].color
      } else if (Config.zones[path.slice(0, -2)]) {
        color = Config.zones[path.slice(0, -2)].color
      }

      var zone
      if (Config.zones[path]) {
        zone = path
      } else if (Config.zones[path.slice(0, -2)]) {
        zone = path.slice(0, -2)
      }

      var title = this.state.termEntity.attributes.name || ""
      var subtitle = this.state.termEntity.attributes.field_subtitle || ""

      //make body
      var description = (this.state.termEntity.attributes.description || {}).value || ""
      description = buildJSXFromHTML(description)

      const stickyItems = this.state.nodeEntities.filter(node => node.attributes.sticky)
      const normalItems = this.state.nodeEntities.filter(node => !node.attributes.sticky)
      const items = [...stickyItems, ...normalItems].map((node) => {
        var description = node.attributes.field_short_description ? <p>{node.attributes.field_short_description}</p> : ''

        //metadata fields
        var metaDataFields = Object.values(Config.filterFieldMapping).map((fieldName) => {
          var fieldValue = this.resolveRelationship(node,fieldName,this.state.includedEntities)
          var className = "short-tool-meta " + fieldName.slice(6)
          return (fieldValue ? <span key={fieldName} className={className}>{fieldValue}</span> : null)
        })

        var metaData = (
          <div className="short-tool-metas">
            {metaDataFields}
          </div>
        )

        var id = (node.attributes.field_path ? node.attributes.field_path : `/${node.id}`)

        return {
          link: `${Config.mapPath}tool${id}`,
          title: node.attributes.title,
          content: <div className="box-body">{description}{metaData}</div>
        }
      })

      var itemsTitle = (items.length > 0 ? "tools" : "no tools")
      if((this.props.filtersSelected || []).length > 0) {
        itemsTitle += " (matching current tool filters)"
      }

      content = (
        <div>
          {description ? <div className="description">{description}</div> : ''}
          <InfoPanelItems itemsType="tools" itemsTitle={itemsTitle} items={items} />
        </div>
        )
    }


    return (
      <InfoPanel zone={zone} title={title} subtitle={subtitle} color={color}>
        {content}
      </InfoPanel>
    )

  }

}

// update when language or filters change
const mapStateToProps = (state, ownProps) => ({
  language: state.language,
  filtersSelected: state.toolFiltersApplied
})

Theme = connect(mapStateToProps)(Theme)

export default withRouter(Theme)
