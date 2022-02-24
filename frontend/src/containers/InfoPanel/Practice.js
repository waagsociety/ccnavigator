import React from 'react'
import { Link } from 'react-router-dom'
import Config from 'config/Config'
import ApiClient from 'client/ApiClient'
import { buildJSXFromHTML, inIframe } from 'util/utility'
import { connect } from 'react-redux'

import { withRouter } from 'util/withRouter'

import InfoPanel from "containers/InfoPanel/index.js"

import { IconClose } from 'util/icons'


class Practice extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title: null,
      body: null,
      tags: [],
      currentItem: null,
    }

    this.viewport = React.createRef();
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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.router.params.id !== prevProps.router.params.id) {
      this.update(this.props.router.params.id)
    }
  }


  update(id) {
    const filter = { "field_path": "/" + id }
    const includes = ["field_timeline_items, field_theme, field_project"]

    ApiClient.instance().fetchContent("node--practice", filter, null, includes, 0, function(node, included) {
      if(node) {
        node = node[0]

        const title = node.attributes.title
        const body = node.attributes.body ? buildJSXFromHTML(node.attributes.body.value) : ''

        const includedEntities = {}
        for (let i = 0; i < included.length; i++) { includedEntities[included[i].id] = included[i] }

        const tags = []
        Config.practiceTaxonomies.forEach(taxonomy => {
          if(node.relationships['field_'+taxonomy]) {
            if(node.relationships['field_'+taxonomy].data) {
              node.relationships['field_'+taxonomy].data.forEach(item => {
                tags.push(includedEntities[item.id].attributes.name)
              })
            }
          }
        })
        const timelineItems = ((node.relationships.field_timeline_items || {}).data || []).map(timelineItem => includedEntities[timelineItem.id])

        this.setState({
          title,
          body,
          tags,
          timelineItems
        })
      }
    }.bind(this))
  }

  toggleTimelineItem(i) {
    if(this.state.currentItem === i) {
      this.setState({
        currentItem: null,
      })
    } else {
      this.setState({
        currentItem: i,
        viewport: this.viewport
      })
    }
  }

  closeTimelineItem() {
    this.setState({
      currentItem: null,
    })
  }

  render() {
    const { title, body, tags, timelineItems, currentItem, viewport } = this.state

    return (
      <InfoPanel label={'practice timeline'} title={title} subtitle={tags.join(' | ')} color={'color-1'} type="practice">
        <div id="practice-body" ref={this.viewport}>
          <ul id="practice-items">
            { timelineItems &&
              timelineItems.map((item, i) => {
                return <li key={item.id} className={currentItem === i ? "current" : ""} >
                  <div className="practice-item-toggle" onClick={ () => { this.toggleTimelineItem(i) }}>
                    <h2>{item.attributes.field_title}</h2>
                    <span className="subtitle">{item.attributes.field_subtitle}</span>
                  </div>
                  { currentItem === i &&
                    <div id="practice-item" className="content" style={{ width: viewport ? viewport.current.clientWidth - 320 : 400 }}>
                      <div className="button-close" onClick={() => { this.closeTimelineItem()}}>{ IconClose }</div>
                      <h1>{item.attributes.field_title}</h1>
                      { buildJSXFromHTML(item.attributes.field_body ? item.attributes.field_body.value : "No content...") }
                      { item.attributes.field_links.map((link, i) => {
                          if (link.uri.includes('internal:') && !inIframe()) {
                            //console.log(link.uri)
                            const to = link.uri.replace('internal:/', Config.mapPath)
                            return <Link className="button button-next" key={`link-${i}`} to={to}>{link.title}</Link>
                          } else {
                            const href = link.uri.includes('internal:') ? Config.root + link.uri.replace('internal:', '') : link.uri
                            return <a className="button button-next" key={`link-${i}`} href={href} target="_blank" rel="noopener noreferrer">{link.title}</a>
                          }
                        })
                      }
                    </div>
                  }
                </li>
            })
          }
          </ul>
          <div id="practice-intro" className="content" onClick={() => { this.closeTimelineItem()}}>{body}</div>
        </div>
      </InfoPanel>
    )
  }
}


const mapStateToProps = (state, ownProps) => ({
  //infoPanel: state.infoPanel
})

Practice = connect(mapStateToProps)(Practice)


export default withRouter(Practice)
