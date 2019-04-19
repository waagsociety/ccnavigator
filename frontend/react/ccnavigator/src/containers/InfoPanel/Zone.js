import React from 'react'
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { buildJSXFromHTML, isID } from 'util/utility.js'
import { connect } from 'react-redux'
import { Constants } from 'config/Constants.js'

import InfoPanel from "containers/InfoPanel/index.js"
import InfoPanelItems from 'components/InfoPanelItems'
import Label from 'components/Label'


/**
 * Get a list of tools in this category
 */
class Zone extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      id: props.match.params.id,
      filtersSelected: props.filtersSelected,
      termHierachy: null,
      termEntity: null,
      nodeEntities: null
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

  update(id) {
    ApiHelper.instance().clearCaches()

    // set filter based we have a uuid or path
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

      //full info on all nodes that have this term its child terms as term
      ApiHelper.instance().buildFilter((filter) => {
        filter["field_category.parent.id"] = termEntity.id
        ApiClient.instance().fetchContent("node--tool", filter, null, null, 0, function(nodeEntities) {
          this.setState({nodeEntities: nodeEntities})
        }.bind(this))
      })
    }.bind(this))
  }


  render() {
    //show loading till we have fetched all
    var content

    //build content view when we have all data
    if(this.state.termHierachy && this.state.termEntity && this.state.nodeEntities) {

      //make header
      var path = this.state.termHierachy.path.slice(0, 2).map(x => x + 1).join("-")
      var color = Constants.zones[path].color

      var zone = this.state.termHierachy.path.map(x => x + 1).join("-")
      var title =  this.state.termEntity.attributes.name || ""
      var subtitle = this.state.termEntity.attributes.field_subtitle || ""


      //make content
      var description = (this.state.termEntity.attributes.description || {}).value || ""
      description = buildJSXFromHTML(description)

      //use the concise term with hierarchy to build the term box
      var	itemsTitle

      // if not grandparent, do items..
      if (this.state.termHierachy.children.length > 0) {
        if (this.state.termHierachy.children[0].children.length === 0) {
          var items = this.state.termHierachy.children.map((term, index) => {

            var tools
            if (term.nodes.length > 0) {
              var toolNodes = term.nodes.slice(0,5)
              tools = toolNodes.map(tool => {
                return <Label key={tool.id} value={tool.attributes.title} size={'0.7em'} />
              })
              if (term.nodes.length > 5) {
                tools.push(<Label key="more" value={`...and ${term.nodes.length - 5} more`} size={'0.7em'} />)
              }
            } else {
              tools = <Label value="no tools" size={'0.7em'} />
            }

            var toolsNote = ((this.props.filtersSelected || []).length > 0 ? <small className="nowrap">(matching current filters)</small> : null)

            var content = (
              <div className="box-body">
                <p>{term.attributes.field_subtitle}</p>
                <div>{tools} {toolsNote}</div>
              </div>
            ) // todo: make translatable

            var id = (term.attributes.field_path ? term.attributes.field_path : `/${term.id}`)

            return {
              link: `/navigator/theme${id}`,
              title: term.attributes.name,
              content: content
            }
          })
          if (items.length > 0) {
            itemsTitle = 'themes:'
          }
        }
      }

      content = (
        <div>
          {description ? <div className="description">{description}</div> : ''}
          <InfoPanelItems itemsType="themes" itemsTitle={itemsTitle} items={items} />
        </div>
        )
    }

    //return the content in a modal view
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

Zone = connect(mapStateToProps)(Zone)


export default Zone
