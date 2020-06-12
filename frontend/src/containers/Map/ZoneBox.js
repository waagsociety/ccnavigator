import React from 'react'
import Config from 'config/Config'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Label from 'components/Label'
import ThemeLabel from "./ThemeLabel.js"


class ZoneBox extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      id: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.filtersSelected !== state.filtersSelected) {
      return {
        filtersSelected: props.filtersSelected,
      }
    }
    return null
  }

  componentDidMount() {
    var id = (this.props.entity.attributes.field_path ? this.props.entity.attributes.field_path : `/${this.props.entity.id}`)

    this.setState({ id })
  }

  handleClick(e) {
    e.preventDefault()

    if(!this.props.didDrag) {
      this.props.history.push(`${Config.mapPath}zone${this.state.id}`)
    }
  }

  render() {
    var termEntity = this.props.entity
    var path = termEntity.path.map(x => x + 1).join("-")
    var color = Config.zones[path].color

    // render term themes (if not grandparent)
    var termThemes
    if (termEntity.grandparent === false) {
      termThemes = (termEntity.children || []).map(subterm => {
        var name = (subterm.attributes || {}).name
        var count = (subterm.nodes || []).length
        var id = (subterm.attributes.field_path ? subterm.attributes.field_path : `/${subterm.id}`)
        return <ThemeLabel key={subterm.id} id={id} count={count} name={name} filtersSelected={this.props.filtersSelected} />
      })
      termThemes = <div className="themes">{termThemes}</div>
    }

    var classNames = [color, 'zone']
    if (path.length > 1) {
      classNames.push('sub-zone')
    }

    var width = (path.length > 1 ? 170 : 230)

    //return category box
    return (
      <foreignObject className={classNames.join(' ')} width={width} height="130" x={Config.zones[path].x} y={Config.zones[path].y} transform={`rotate(-45 ${Config.zones[path].x},${Config.zones[path].y})`}>
        <a href={`${Config.mapPath}zone${this.state.id}`} className="zone-title-link" onClick={ this.handleClick.bind(this) }>
          <h3 className="zone-title">
            {path.length === 1 &&
              <Label value={path} size={'0.6em'} color="#000"/>
            }
            <span>{termEntity.attributes.name}</span>
          </h3>
        </a>
        {termThemes}
       </foreignObject>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  didDrag: state.didDrag
})
ZoneBox = connect(mapStateToProps)(ZoneBox)

export default withRouter(ZoneBox)