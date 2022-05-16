import React from 'react'
import ApiClient from 'client/ApiClient'
import Config from 'config/Config.js'

import { Link } from 'react-router-dom'


class Practices extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      toggled: false,
      practicesGroupedByProject: {},
    }
  }

  componentDidMount() {

    ApiClient.instance().fetchContent("node--practice", Config.practicesPanelFilter, null, ["field_project"], 0, function(nodeEntities, included) {
      const includedEntities = {}
      if(included) {
        for (let i = 0; i < included.length; i++) {
          includedEntities[included[i].id] = included[i]
        }
      }

      const practicesGroupedByProject = {}
      nodeEntities.reverse().forEach(practice => {
        const project = includedEntities[practice.relationships.field_project.data[0].id].attributes.name
        if(!practicesGroupedByProject[project]) practicesGroupedByProject[project] = []

        practicesGroupedByProject[project].push({
          id : practice.id,
          title: practice.attributes.title,
          link: `${Config.mapPath}practice${practice.attributes.field_path}`
        })
      })

      this.setState({
        practicesGroupedByProject
      })
    }.bind(this))
  }

  onTogglePracticesDisplay() {
    this.setState({
      toggled: !this.state.toggled
    })
  }

  render() {
    const { toggled, practicesGroupedByProject } = this.state

    var className = "panel practices toggle"
    if(toggled) {
      className += " toggled"
    }
    return (
      <div className={className}>
        <h3 className="toggle-button" onClick={() => {this.onTogglePracticesDisplay()}}><span className="icon"></span>practice timelines</h3>
        <div className="toggle-content">
          { Object.keys(practicesGroupedByProject).map(project => {
            return <div key={project}>
              <h4>{ project } project</h4>
              <ul>
              { practicesGroupedByProject[project].map(practice => {
                return <li key={practice.id}><Link to={practice.link}>{practice.title}</Link></li>
              }) }
              </ul>
            </div>
          }) }
        </div>
      </div>
    );
  }

}

export default Practices