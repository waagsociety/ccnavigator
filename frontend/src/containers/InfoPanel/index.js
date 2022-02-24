import React from 'react'
import Config from 'config/Config.js'
import { withRouter } from 'util/withRouter'

import { connect } from 'react-redux'
import { setTitle, setInfoPanel, setZone } from 'actions'

import { inIframe } from "util/utility"

import Label from 'components/Label'
import { IconBack, IconClose, IconCollapse } from "util/icons"


class InfoPanel extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      infoPanel: true,
      color: props.color,
      zone: '',
      title: props.title,
      subtitle: props.subtitle,
      children: props.children,
      vp: React.createRef()
    }

    this.infoPanelViewport = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.title !== state.title) {
      if(state.infoPanelViewport) state.infoPanelViewport.current.scrollTop = 0
      return {
        id: props.id,
        color: props.color,
        zone: props.zone,
        title: props.title,
        subtitle: props.subtitle,
        infoPanel: true
      }
    }
    if (props.zone !== state.zone) {
      return { zone: props.zone }
    }
    if (props.color !== state.color) {
      return { color: props.color }
    }
    if (props.children !== state.children) {
      return { children: props.children }
    }
    return null
  }

  componentDidUpdate() {
    if(this.state.title) this.props.dispatch(setTitle(this.state.title))
    if(this.state.infoPanel) this.props.dispatch(setInfoPanel(this.state.infoPanel))
    if(this.state.zone) this.props.dispatch(setZone(this.state.zone))
  }

  toggleInfoPanel() {
    this.setState({
      infoPanel: !this.state.infoPanel
    })
  }

  handleViewportClick() {
    // only if smaller than info panel breakpoint ($info-panel-breakpoint in scss)
    if(window.innerWidth < Config.infoPanel.breakpoint) {
      this.props.history.push(Config.mapPath)
    }
  }

  handleContentClick(e) {
    e.stopPropagation()
  }

  closeInfoPanel() {
    this.props.dispatch(setTitle(''))
    this.props.dispatch(setInfoPanel(false))
    this.props.router.navigate(Config.mapPath)
  }


  render() {
    const { infoPanel, title, subtitle, zone } = this.state
    const { color, type, label } = this.props

    const className = [color]
    if(infoPanel === false) {
      className.push('collapsed')
    }
    if(type) {
      className.push(type)
    }
    if(inIframe()) {
      className.push('embedded')
    } else {
      className.push('non-embedded')
    }

    return (
      <div id="info-panel" className={className.join(' ')} onClick={ this.handleViewportClick.bind(this) }>
        <div id="info-panel-inner">

          { !inIframe() &&
            <div id="buttons-bar"><div>
              <span className="bar-button button-back" onClick={ () => { this.props.router.navigate(-1) }}>{IconBack} <span className="text">back</span></span>
              <span className="bar-button button-close" onClick={ this.closeInfoPanel.bind(this) }>{IconClose}</span>
              <span className="bar-button button-collapse" onClick={ this.toggleInfoPanel.bind(this)}>{IconCollapse}</span>
            </div></div>
          }

          <div id="info-panel-viewport" className="scrollable" ref={this.state.infoPanelViewport}>
            <div id="info-panel-content" onClick={ this.handleContentClick.bind(this) }>
              <div id="info-panel-header">
                {label && <div className="label label-bar">{label}</div>}
                <h1 className="info-panel-title">
                  {zone && <Label value={`zone ${zone}`} />}
                  <span>{title}</span>
                </h1>
                {subtitle && <h2 className="subtitle">{subtitle}</h2>}
              </div>
              <div id="info-panel-body">{this.state.children}</div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => ({
  //infoPanel: state.infoPanel
})
InfoPanel = connect(mapStateToProps)(InfoPanel)

export default withRouter(InfoPanel)