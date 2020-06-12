import React from 'react'
import ApiClient from 'client/ApiClient'
import Config from 'config/Config.js'

import { Link } from 'react-router-dom'




class Practices extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      toggled: false,
      practices: [],
      titlePrefixField: Config.practicesPanelTitlePrefixTaxonomy ? "field_"+Config.practicesPanelTitlePrefixTaxonomy : null
    }
  }

  componentDidMount() {
    const { titlePrefixField } = this.state
    const include = titlePrefixField ? [titlePrefixField] : []

    ApiClient.instance().fetchContent("node--practice", '', null, include, 0, function(nodeEntities, included) {
      const includedEntities = {}
      if(included) {
        for (let i = 0; i < included.length; i++) {
          includedEntities[included[i].id] = included[i]
        }
      }

      const practices = nodeEntities.map(practice => {
        return {
          id : practice.id,
          titlePrefix: practice.relationships[titlePrefixField] ? includedEntities[practice.relationships[titlePrefixField].data[0].id].attributes.name + ": " : '',
          title: practice.attributes.title,
          link: `${Config.mapPath}practice${practice.attributes.field_path}`
        }
      })

      practices.sort(function(a, b){
        if(a.title < b.title) { return -1; }
        if(a.title > b.title) { return 1; }
        return 0;
      })

      this.setState({
        practices
      })
    }.bind(this))
  }

  onTogglePracticesDisplay() {
    this.setState({
      toggled: !this.state.toggled
    })
  }

  render() {
    const { toggled, practices} = this.state

    var className = "panel practices toggle"
    if(toggled) {
      className += " toggled"
    }
    return (
      <div className={className}>
        <h3 className="toggle-button" onClick={() => {this.onTogglePracticesDisplay()}}><span className="icon"></span>practice timelines</h3>
        <div className="toggle-content">
          { practices.map(practice => {
            return <Link key={practice.id} to={practice.link}><h4>{practice.titlePrefix}{practice.title}</h4></Link>
          }) }
        </div>
      </div>
    );
  }

}

export default Practices