import React from 'react';
import { css } from 'util/aphrodite-custom.js';
import { Style } from './style.js';
import { connect } from 'react-redux';
import { setZoomLevelHigh} from 'actions'

class SVGMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      matrix: [1, 0, 0, 1, 0, 0],
      viewBox: [100, -100, 1100, 950], /* default view box */
      buttonHeld: false,
      dragging: false,
      mousePressedStamp: 0,
      startX: 0,
      starty: 0
    }

    console.log("svg map next props a", this.props)
  }

  //adapt the initial viewBox bigger screens zoom out a bit to show more of the map
  componentDidMount() {
    if((this.props.width > 900) && (this.props.height > 900)) {
      var s = Math.min(this.props.width,this.props.height);
      var z = 900 / s;
      //var z = 200 / s;
      this.zoomWith(z);
    }
  }

  componentDidUpdate() {
    var currentZoom = this.props.width / this.state.viewBox[2];
    //console.log('zoom', currentZoom)
    var zoomIsHigh = (currentZoom > 1.75);
    if(zoomIsHigh !== this.props.zoomLevelHigh) {
      this.props.dispatch(setZoomLevelHigh(zoomIsHigh));
    }
  }

  getZoom() {
    return this.state.matrix[0];
  }

  onZoomIn() {
    this.zoomWith(1.5);
  }
  onZoomOut() {
    this.zoomWith(1/1.5);
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
      startX,
      startY,
      mousePressedStamp: stamp
    };
    this.setState(state);

    // double click
    if((stamp - prevStamp) < 400) {
      var viewRect = this.svgElement.getBoundingClientRect();
      var viewX = e.clientX - viewRect.x;
      var viewY = e.clientY - viewRect.y;
      // click location is ignored
      this.animateZoom2();
    }

    //
    e.preventDefault();
  }

  onMouseMove(e) {
    console.log("move")

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
    this.setState({ buttonHeld: false, dragging: false });
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
  /*
  animateZoom(targetCenter) {
    //
    var targetZoom = 2;

    //transform click coordinates to svgmap coordinates respecting current viewbox
    var cz = this.props.width / this.state.viewBox[2]; //vertical en horizontal zoom are the same
    var mapX = (targetCenter[0] / cz) + this.state.viewBox[0];
    var mapY = (targetCenter[1] / cz) + this.state.viewBox[1];
    //calc the current center map coordinate
    const beginZoom = this.props.width / this.state.viewBox[2];
    const beginX = this.state.viewBox[0] + this.state.viewBox[2] * 0.5;
    const beginY = this.state.viewBox[1] + this.state.viewBox[3] * 0.5;
    //calc the distance in map coordinates to travel
    const dx = mapX - beginX;
    const dy = mapY - beginY;
    //animate to new center
    this.runningInterval = setInterval(function(){
      var currentZoom = this.props.width / this.state.viewBox[2];
      var progress = (currentZoom - beginZoom) / (targetZoom - beginZoom);
      var x = beginX + dx * progress;
      var y = beginY + dy * progress;
      var z = 1;
      if(currentZoom === targetZoom) {
        clearInterval(this.runningInterval);
      } else if(currentZoom < targetZoom) {
        z = 1.1;
        if(z * currentZoom >= targetZoom) { //stop if interval if next zoom level reaches target
          clearInterval(this.runningInterval);
        }
      } else if(currentZoom > targetZoom) {
        z = 0.90;
        if(z * currentZoom <= targetZoom) { //stop if interval if next zoom level reaches target
          clearInterval(this.runningInterval);
        }
      }
      this.zoomPanTo(z * currentZoom, [x,y])
    }.bind(this), 50);
  }
  */

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
            className={css(Style.svg)}
        >
          {this.props.children}
        </svg>
        <div className={css(Style.buttons)}>
          <button className={css(Style.button)} onClick={this.onZoomIn.bind(this)}> {"+"} </button>
          <button className={css(Style.button)} onClick={this.onZoomOut.bind(this)}> {"-"} </button>
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
    var currentZoom = this.props.width / this.state.viewBox[2];
    if(scale < 1 && currentZoom < 0.6) return;
    if(scale > 1 && currentZoom > 4) return;

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

export default SVGMap;
