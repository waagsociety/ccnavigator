import React from 'react'
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { connect } from 'react-redux'
import { buildJSXFromHTML } from 'util/utility.js'
import { Constants } from 'config/Constants.js'

import InfoPanel from "containers/InfoPanel/index.js"
import InfoPanelItems from 'components/InfoPanelItems'


class Theme extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      id: props.match.params.id,
      filtersSelected: props.filtersSelected,
      termHierachy: null,
      termEntity: null,
      nodeEntities: null,
      includedEntities: null
    }
  }

  componentDidMount() {
    this.update(this.state.id)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.match.params.id !== nextProps.match.params.id) {
      this.setState({ id: nextProps.match.params.id })
      this.update(nextProps.match.params.id)
    }
    if(this.props.filtersSelected !== nextProps.filtersSelected) {
      this.setState({ filtersSelected: nextProps.filtersSelected })
      this.update(this.state.id)
    }
  }

  update(entityId) {
    ApiHelper.instance().clearCaches()

    //get hierarchy path of this term
    ApiHelper.instance().findTermInContentHierarchy(entityId, function(term) {
      this.setState({termHierachy: term})
    }.bind(this))

    //full info on this entity
    ApiClient.instance().fetchContent("taxonomy_term--category", entityId, null, null, 0, function(termEntity) {
      this.setState({termEntity: termEntity})
    }.bind(this))

    //full info on all nodes that have this term
    ApiHelper.instance().buildFilter((filter) => {
      filter["field_category.uuid"] = entityId
      ApiClient.instance().fetchContent("node--tool", filter, null, Object.values(Constants.filterFieldMapping), 0, function(nodeEntities, included) {
        //connect relationships to include in entity
        this.setState({
          nodeEntities: nodeEntities,
          includedEntities: included
        })
      }.bind(this))
    })
  }

  onToolSelected(item) {
    if(this.props.onToolSelected) {
      this.props.onToolSelected(item.props.data.id) //pass entity data obj
    }
  }

  resolveRelationship(tool, relationshipName, includes) {
    var uuidRelated = (((tool["relationships"] || {})[relationshipName] || {})["data"] || {})["id"]
    if(uuidRelated) {
      var found = (includes || []).find((el) => {
        return (el || {}).id === uuidRelated
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
      if (Constants.zones[path]) {
        color = Constants.zones[path].color
      } else if (Constants.zones[path.slice(0, -2)]) {
        color = Constants.zones[path.slice(0, -2)].color
      }

      var zone
      if (Constants.zones[path]) {
        zone = path
      } else if (Constants.zones[path.slice(0, -2)]) {
        zone = path.slice(0, -2)
      }

      var title =  this.state.termEntity.attributes.name || ""
      var subtitle = this.state.termEntity.attributes.field_subtitle || ""

      //make body
      var description = (this.state.termEntity.attributes.description || {}).value || ""
      description = buildJSXFromHTML(description)

      var items = this.state.nodeEntities.map((node) => {
        var description = node.attributes.field_short_description ? <p>{node.attributes.field_short_description}</p> : ''

        //metadata fields
        var metaDataFields = Object.values(Constants.filterFieldMapping).map((fieldName) => {
          var fieldValue = this.resolveRelationship(node,fieldName,this.state.includedEntities)
          var className = "short-tool-meta " + fieldName.slice(6)
          return (fieldValue ? <span key={fieldName} className={className}>{fieldValue}</span> : null)
        })

        var metaData = (
          <div className="short-tool-metas">
            {metaDataFields}
          </div>
        )

        return {
          link: `/navigator/tool/${node.id}`,
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

export default Theme
