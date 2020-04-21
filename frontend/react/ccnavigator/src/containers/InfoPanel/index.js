import React from 'react'
import Config from 'config/Config.js'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { setTitle, setInfoPanel, setZone } from 'actions'

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
      children: props.children
    }

    this.infoPanelViewport = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.title !== state.title) {
      
      return {
        id: props.id,
        //icon: props.icon,
        color: props.color,
        //images: props.images,
        zone: props.zone,
        title: props.title,
        subtitle: props.subtitle,
        infoPanel: true
      }
    }
    if (props.zone !== state.zone) {
      return {
        zone: props.zone
      }
    }
    if (props.color !== state.color) {
      return {
        color: props.color
      }
    }
    if (props.children !== state.children) {
      return {
        children: props.children
      }
    }
    return null
  }

  componentDidUpdate() {
    if(this.state.title) this.props.dispatch(setTitle(this.state.title))
    if(this.state.infoPanel) this.props.dispatch(setInfoPanel(this.state.infoPanel))
    if(this.state.zone) this.props.dispatch(setZone(this.state.zone))
    this.infoPanelViewport.current.scrollTop = 0
  }

  toggleInfoPanel() {
    this.setState({
      infoPanel: !this.state.infoPanel
    })
  }

  handleViewportClick() {
    // only if smaller than info panel breakpoint ($info-panel-breakpoint in scss)
    if(window.innerWidth < Config.infoPanel.breakpoint) {
      this.props.history.push('/navigator/')
    }
  }

  handleContentClick(e) {
    e.stopPropagation()
  }

  closeInfoPanel() {
    this.props.dispatch(setTitle(''))
    this.props.dispatch(setInfoPanel(false))
    this.props.history.push('/navigator/')
  }


  render() {
    const className = (this.state.infoPanel === false ? `collapsed ${this.state.color}` : this.state.color)

    const subtitle = this.state.subtitle ? <h2 className="subtitle">{this.state.subtitle}</h2> : null
    const label = this.state.zone ? <Label value={`zone ${this.state.zone}`} /> : null

    return (
      <div id="info-panel" className={className} onClick={ this.handleViewportClick.bind(this) }>
        <div id="info-panel-inner">

          <div id="info-panel-buttons" ref="infoPanelButtons"><div>
            <span className="button-info-panel button-back" onClick={ this.props.history.goBack}>{IconBack} <span className="text">back</span></span>
            <span className="button-info-panel button-close" onClick={ this.closeInfoPanel.bind(this) }>{IconClose}</span>
            <span className="button-info-panel button-collapse" onClick={ this.toggleInfoPanel.bind(this)}>{IconCollapse}</span>
          </div></div>

          <div id="info-panel-viewport" ref={this.infoPanelViewport}>
            <div id="info-panel-content" onClick={ this.handleContentClick.bind(this) }>
              <div id="info-panel-header">
                <h1 className="info-panel-title">
                  {label}
                  <span>{this.state.title}</span>
                </h1>
                {subtitle}
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