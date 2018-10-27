import React from 'react'
import { connect } from 'react-redux'
import { setDidDrag } from 'actions'
import { withRouter } from 'react-router-dom'
import { ease } from "util/utility"
import { Constants } from 'config/Constants.js'

class SVGMap extends React.Component {

  constructor(props) {
    super(props)
    window.svgmap = this
    this.state = {
      matrix: [1, 0, 0, 1, 0, 0],
      viewBox: [0, 0, 1000, 960], /* default view box */
      buttonHeld: false,
      dragging: false,
      didDrag: false,
      mousePressedStamp: 0,
      startX: 0,
      starty: 0,
      infoPanel: false,
      zone: ''
    }
  }

  componentDidMount() {
    //adapt the initial viewBox bigger screens zoom out a bit to show more of the map
    if((this.props.width > 1000) && (this.props.height > 960)) {
      this.zoomWith(1000 / (Math.min(this.props.width,this.props.height)))
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.infoPanel !== nextProps.infoPanel) {
      this.setState({ infoPanel: nextProps.infoPanel })

      // if(nextProps.infoPanel === false) {
      //   this.panWith(-Constants.infoPanel.width/2, 0)
      // }
      // if(nextProps.infoPanel === true) {
      //   this.panWith(Constants.infoPanel.width/2, 0)
      // }
    }
    if(this.props.zone !== nextProps.zone && nextProps.zone !== '') {
      // only if larger than info panel breakpoint ($info-panel-breakpoint in scss)
      if(window.innerWidth > Constants.infoPanel.breakpoint) {
        this.animateZoomPan(1.5, [Constants['zones'][nextProps.zone]['x'] + 75, Constants['zones'][nextProps.zone]['y'] + 15])
      }
    }
  }

  componentDidUpdate() {
    this.props.dispatch(setDidDrag(this.state.didDrag))
  }

  getCenterX() {
    if(this.state.infoPanel) {
      return Constants.infoPanel.width / window.innerWidth + (window.innerWidth - Constants.infoPanel.width) / window.innerWidth / 2
    } else {
      return 0.5
    }
  }

  onZoomIn() {
    this.zoomWith(1.4)
  }
  onZoomOut() {
    this.zoomWith(1/1.4)
  }

  onMousePressed(e) {
    // find start position of drag based on touch/mouse coordinates.
    const startX = typeof e.clientX === 'undefined' ? e.changedTouches[0].clientX : e.clientX
    const startY = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY
    const prevStamp = this.state.mousePressedStamp
    const stamp = (new Date()).getTime()

    // update state with above coordinates, and set buttonHeld to true.
    const state = {
      buttonHeld: true,
      dragging: false,
      didDrag: false,
      startX,
      startY,
      mousePressedStamp: stamp
    }
    this.setState(state)

    // double click
    if((stamp - prevStamp) < 400) {
      // click location is ignored
      this.animateZoom()

      // attemp to not ingore click location (this is wrong :) (:
      // const box = this.svgElement.getBoundingClientRect()
      // const toZoom = this.props.width / this.state.viewBox[2] * 1.4
      // const toX = (startX - box.x) / 1000 * (this.state.viewBox[0] + this.state.viewBox[2])
      // const toY = (startY - box.y) / 960 * (this.state.viewBox[1] + this.state.viewBox[3])
      // this.animateZoomPan(toZoom, [toX, toY])
    }
  }

  onMouseMove(e) {
    // first check if the state is buttonHeld, if not we can just return, so we do not move unless the user wants to move
    if (!this.state.buttonHeld) {
      return
    }

    // get the new x and y coordinates
    const x = typeof e.clientX === 'undefined' ? e.changedTouches[0].clientX : e.clientX
    const y = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY

    // take the delta where we are, minus where we came from.
    const dx = x - this.state.startX
    const dy = y - this.state.startY

    // pan using the deltas from previous position, if above threshold to accomodate for nervous clickers (:
    const threshold = 1
    if(Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      this.panWith(dx, dy)
      this.setState({
        startX: x,
        startY: y,
        dragging: true
      })
    }
  }

  onMouseReleased(e) {
    this.setState({ buttonHeld: false, didDrag: this.state.dragging, dragging: false })
  }

  // animate zoom to a specified center
  animateZoom(targetCenter) {
    //zoom in n steps to 1.25 times the current zoomlevel
    var n = 5
    var step = Math.pow(1.5, (1.0/n))
    for(var i=0; i<n; i++) {
      setTimeout(() => { this.zoomWith(step) }, (i * 20))
    }
  }

  // animate zoom to a specified center
  animateZoomPan(targetZoom, targetCenter) {
    clearInterval(this.runningInterval)

    //calc the current center map coordinate
    const beginZoom = this.props.width / this.state.viewBox[2]
    const beginX = this.state.viewBox[0] + this.state.viewBox[2] * this.getCenterX();
    const beginY = this.state.viewBox[1] + this.state.viewBox[3] * 0.5

    const steps = 10
    const stepZoom = (targetZoom - beginZoom) / steps
    const stepX = (targetCenter[0] - beginX) / steps
    const stepY = (targetCenter[1] - beginY) / steps

    //animate to new center
    var step = 1
    this.runningInterval = setInterval(function(){
      if(step === steps) clearInterval(this.runningInterval)

      const stepSize = ease(step, steps)

      var toZoom = beginZoom + stepSize * stepZoom
      var toX = beginX + stepSize * stepX
      var toY = beginY + stepSize * stepY

      this.zoomPanTo(toZoom, [toX,toY])

      step++
    }.bind(this), 25)
  }

  // the svg will have the full size of its container, view box determines crop
  render() {
    //matrix zoom works in ie only if we edit the content of the svg when we modify the transform
    return (
      <div id="container-svg">
        <svg version="1.1"
          width={this.props.width}
          height={this.props.height}
          onMouseDown={this.onMousePressed.bind(this)}
          onTouchStart={this.onMousePressed.bind(this)}
          onMouseMove={this.onMouseMove.bind(this)}
          onTouchMove={this.onMouseMove.bind(this)}
          onMouseUp={this.onMouseReleased.bind(this)}
          onTouchEnd={this.onMouseReleased.bind(this)}
          onWheel={this.onWheel.bind(this)}
          ref={(elem) => { this.svgElement = elem }}
          cnt= {this.state.animate}
          viewBox = {this.state.viewBox.join(" ")}
          className="svg-map"
        >
          {this.props.children}
        </svg>
        <div className="svg-map-zoom-buttons">
          <button onClick={this.onZoomIn.bind(this)}> {"+"} </button>
          <button onClick={this.onZoomOut.bind(this)}> {"-"} </button>
        </div>
      </div>
    )
  }

  onWheel(e) {
    if (e.deltaY < 0) {
      this.zoomWith(1.05)
    } else {
      this.zoomWith(0.95)
    }
    e.preventDefault()
  }

  zoomWith(scale) {
    if(scale <= 0) return

    //limit the zoom range
    if(scale > 1 && this.state.viewBox[2] < 250) return
    if(scale < 1 && this.state.viewBox[2] > 1500) return

    const nw = this.state.viewBox[2] / scale
    const nh = this.state.viewBox[3] / scale
    const nx = this.state.viewBox[0] + (this.state.viewBox[2] - nw) * this.getCenterX()
    const ny = this.state.viewBox[1] + (this.state.viewBox[3] - nh) * 0.5
    this.setState({ viewBox: [nx, ny, nw, nh]})
  }

  zoomPanTo(zoom, center) {
    if(zoom <= 0) return
    const nw = this.props.width * 1/zoom
    const nh = this.props.height * 1/zoom
    const nx = center[0] - nw * this.getCenterX()
    const ny = center[1] - nh * 0.5
    this.setState({ viewBox: [nx, ny, nw, nh]})
  }

  panWith(dx, dy) {
    //respect zoomlevel, aspect ratio of container vs aspect ratio of viewbox indicates vertical or horizontal padding
    const box = this.svgElement.getBoundingClientRect()
    const a1 = box.width / box.height //aspect ratio container
    const a2 = this.state.viewBox[2] / this.state.viewBox[3] //aspect ratio viewbox
    const s  = (a1 < a2 ? this.state.viewBox[2] / box.width : this.state.viewBox[3] / box.height)  //current zoomlevel

    //
    const nw = this.state.viewBox[2]
    const nh = this.state.viewBox[3]
    const nx = this.state.viewBox[0] - dx * s
    const ny = this.state.viewBox[1] - dy * s
    this.setState({ viewBox: [nx, ny, nw, nh]})
  }

}

const mapStateToProps = (state, ownProps) => ({
  infoPanel: state.infoPanel,
  zone: state.zone
})
SVGMap = connect(mapStateToProps)(SVGMap, null, null, { withRef: true })
SVGMap = withRouter(SVGMap)

export default SVGMap
