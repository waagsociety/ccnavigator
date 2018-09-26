import React from 'react';
import { connect } from 'react-redux';
import { setZoomLevelHigh} from 'actions'
import { withRouter, matchPath } from 'react-router-dom';

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
      starty: 0
    }
  }

  componentDidMount() {
    if((this.props.width > 1000) && (this.props.height > 1000)) {
      //adapt the initial viewBox bigger screens zoom out a bit to show more of the map
      var s = Math.min(this.props.width,this.props.height)
      var z = 1000 / s
      //console.log(z)
      this.zoomWith(z)
    }
    //subscribe to location change to be able to block links when dragging
    this.unsubscribeFromHistory = this.props.history.listen(this.handleLocationChange);
  }

  //
  componentDidUnMount() {
    if (this.unsubscribeFromHistory) this.unsubscribeFromHistory();
  }

  //
  handleLocationChange = (location) => {
    if(this.state.didDrag) {
      var match = matchPath(location.pathname, {path:"/navigator/*"});
      if(match && match.url !== "/navigator/") {
        this.props.history.push("/navigator/")
      }
    }

  }

  componentDidUpdate() {
    //var zoomLevel = (this.state.viewBox[2] / 1100) * (this.state.viewBox[2] / this.props.width)
    //var zoomIsHigh = (zoomLevel < 0.7)
    var zoomIsHigh = true
    if(zoomIsHigh !== this.props.zoomLevelHigh) {
      this.props.dispatch(setZoomLevelHigh(zoomIsHigh))
    }
  }

  onZoomIn() {
    this.zoomWith(1.4);
  }
  onZoomOut() {
    this.zoomWith(1/1.4);
  }

  onMousePressed(e) {
    if(this.state.buttonHeld) {console.log("held");}
    if(this.state.dragging) {console.log("dragging");}

    // find start position of drag based on touch/mouse coordinates.
    const startX = typeof e.clientX === 'undefined' ? e.changedTouches[0].clientX : e.clientX;
    const startY = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY;
    const prevStamp = this.state.mousePressedStamp;
    const stamp = (new Date()).getTime();

    // update state with above coordinates, and set buttonHeld to true.
    const state = {
      buttonHeld: true,
      dragging: false,
      didDrag: false,
      startX,
      startY,
      mousePressedStamp: stamp
    };
    this.setState(state);

    // double click
    if((stamp - prevStamp) < 400) {
      // click location is ignored
      //this.animateZoom2();

      // attemp to not ingore click location (:
      const box = this.svgElement.getBoundingClientRect();

      const toZoom = this.props.width / this.state.viewBox[2] * 1.4
      // how to get click location within map? (this is wrong)
      const toX = (startX - box.x) / 1000 * (this.state.viewBox[0] + this.state.viewBox[2])
      const toY = (startY - box.y) / 960 * (this.state.viewBox[1] + this.state.viewBox[3])

      this.animateZoom(toZoom, [toX, toY])
    }
  }

  onMouseMove(e) {
    // first check if the state is buttonHeld, if not we can just return, so we do not move unless the user wants to move
    if (!this.state.buttonHeld) {
      return;
    }
    // get the new x and y coordinates
    const x = typeof e.clientX === 'undefined' ? e.changedTouches[0].clientX : e.clientX;
    const y = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY;
    // take the delta where we are minus where we came from.
    const dx = x - this.state.startX;
    const dy = y - this.state.startY;
    // pan using the deltas from previous position
    this.panWith(dx, dy);
    this.setState({
      startX: x,
      startY: y,
      dragging: true
    });
  }

  onMouseReleased(e) {
    this.setState({ buttonHeld: false, didDrag: this.state.dragging, dragging: false });
  }

  /**
   * animate zoom to a specified center
   */
  animateZoom2(targetCenter) {
    //zoom in n steps to 1.25 times the current zoomlevel
    var n = 5;
    var step = Math.pow(1.5, (1.0/n));
    for(var i=0;i<n;i++) {
      setTimeout(() => { this.zoomWith(step) }, (i * 20));
    }
  }

  /**
   * animate zoom to a specified center
   */
  /**/
  animateZoom(targetZoom, targetCenter) {
    clearInterval(this.runningInterval)

    //calc the current center map coordinate
    const beginZoom = this.props.width / this.state.viewBox[2]
    const beginX = this.state.viewBox[0] + this.state.viewBox[2] * 0.5
    const beginY = this.state.viewBox[1] + this.state.viewBox[3] * 0.5

    const steps = 10
    const stepZoom = (targetZoom - beginZoom) / steps
    const stepX = (targetCenter[0] - beginX) / steps
    const stepY = (targetCenter[1] - beginY) / steps

    //animate to new center
    var step = 1
    this.runningInterval = setInterval(function(){
      if(step === steps) clearInterval(this.runningInterval)

      var toZoom = beginZoom + step * stepZoom
      var toX = beginX + step * stepX
      var toY = beginY + step * stepY

      this.zoomPanTo(toZoom, [toX,toY])

      step++
    }.bind(this), 25);
  }

  /**
   * the svg will have the full size of its container, view box determines crop
   */
  render() {
    //matrix zoom works in ie only if we edit the content of the svg when we modify the transform
    return (
      <div>
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
            cnt = {this.state.animate}
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
    );
  }

  //
  onWheel(e) {
    if (e.deltaY < 0) {
      this.zoomWith(1.05);
    } else {
      this.zoomWith(0.95);
    }
    e.preventDefault();
  }

  zoomWith(scale) {
    if(scale <= 0) return;

    //limit the zoom range
    if(scale > 1 && this.state.viewBox[2] < 300) return;
    if(scale < 1 && this.state.viewBox[2] > 1300) return;

    const nw = this.state.viewBox[2] / scale;
    const nh = this.state.viewBox[3] / scale;
    const nx = this.state.viewBox[0] + (this.state.viewBox[2] - nw) * 0.5;
    const ny = this.state.viewBox[1] + (this.state.viewBox[3] - nh) * 0.5;
    this.setState({ viewBox: [nx, ny, nw, nh]});
  }

  zoomPanTo(zoom, center) {
    if(zoom <= 0) return;
    const nw = this.props.width * 1/zoom;
    const nh = this.props.height * 1/zoom;
    const nx = center[0] - nw * 0.5;
    const ny = center[1] - nh * 0.5;
    this.setState({ viewBox: [nx, ny, nw, nh]});
  }

  panWith(dx, dy) {
    //respect zoomlevel, aspect ratio of container vs aspect ratio of viewbox indicates vertical or horizontal padding
    const box = this.svgElement.getBoundingClientRect();
    const a1 = box.width / box.height; //aspect ratio container
    const a2 = this.state.viewBox[2] / this.state.viewBox[3]; //aspect ratio viewbox
    const s  = (a1 < a2 ? this.state.viewBox[2] / box.width : this.state.viewBox[3] / box.height);  //current zoomlevel

    //
    const nw = this.state.viewBox[2];
    const nh = this.state.viewBox[3];
    const nx = this.state.viewBox[0] - dx * s;
    const ny = this.state.viewBox[1] - dy * s;
    this.setState({ viewBox: [nx, ny, nw, nh]});
  }

}

const mapStateToProps = (state, ownProps) => ({
  zoomLevelHigh: state.zoomLevelHigh
})
SVGMap = connect(mapStateToProps)(SVGMap, null, null, { withRef: true })
SVGMap = withRouter(SVGMap)

export default SVGMap;
