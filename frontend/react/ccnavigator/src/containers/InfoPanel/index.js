import React from 'react'
import { connect } from 'react-redux'
import { setTitle, setInfoPanel, setZone } from 'actions'
import { Constants } from 'config/Constants.js'
import Label from 'components/Label'
import { IconBack, IconClose, IconCollapse } from "util/icons"


class InfoPanel extends React.Component {

  static contextTypes = {
    router: () => null
  }

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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ infoPanel: true })

    if(this.props.color !== nextProps.color) {
      this.setState({ color: nextProps.color })
    }
    if(this.props.zone !== nextProps.zone) {
      this.setState({ zone: nextProps.zone })
    }
    if(this.props.title !== nextProps.title) {
      this.setState({ title: nextProps.title })
    }
    if(this.props.subtitle !== nextProps.subtitle) {
      this.setState({ subtitle: nextProps.subtitle })
    }
    if(this.props.children !== nextProps.children) {
      this.setState({ children: nextProps.children })
    }
  }

  componentDidUpdate() {
    this.props.dispatch(setTitle(this.state.title))
    this.props.dispatch(setInfoPanel(this.state.infoPanel))
    this.props.dispatch(setZone(this.state.zone))
  }

  toggleInfoPanel() {
    this.setState({
      infoPanel: !this.state.infoPanel
    })
  }

  handleViewportClick() {
    // only if smaller than info panel breakpoint ($info-panel-breakpoint in scss)
    if(window.innerWidth < Constants.infoPanel.breakpoint) {
      this.context.router.history.push('/navigator/')
    }
  }

  handleContentClick(e) {
    e.stopPropagation()
  }

  closeInfoPanel() {
    this.props.dispatch(setTitle(''))
    this.props.dispatch(setInfoPanel(false))
    this.context.router.history.push('/navigator/')
  }


  render() {
    const className = (this.state.infoPanel === false ? `collapsed ${this.state.color}` : this.state.color)

    const subtitle = this.state.subtitle ? <h2 className="subtitle">{this.state.subtitle}</h2> : null
    const label = this.state.zone ? <Label value={`zone ${this.state.zone}`} /> : null

    return (
      <div id="info-panel" className={className} onClick={ this.handleViewportClick.bind(this) }>
        <div id="info-panel-inner">

          <div id="info-panel-buttons" ref="infoPanelButtons"><div>
            <span className="button-info-panel button-back" onClick={ this.context.router.history.goBack}>{IconBack} <span className="text">back</span></span>
            <span className="button-info-panel button-close" onClick={ this.closeInfoPanel.bind(this) }>{IconClose}</span>
            <span className="button-info-panel button-collapse" onClick={ this.toggleInfoPanel.bind(this)}>{IconCollapse}</span>
          </div></div>

          <div id="info-panel-viewport" ref="infoPanelViewport" >
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

export default InfoPanel