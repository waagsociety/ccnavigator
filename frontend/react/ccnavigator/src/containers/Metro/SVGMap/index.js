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
      viewBox: [180, -80, 900, 900], /* default view box */
      buttonHeld: false,
      dragging: false,
      startX: 0,
      starty: 0
    }

    console.log("svg map next props a", this.props)
  }

  //adapt the initial viewBox bigger screens zoom out a bit to show more of the map 
  componentDidMount() {
    if((this.props.width > 900) && (this.props.height > 900)) {
      var s = Math.min(this.props.width,this.props.height);
      //var z = 900 / s;
      var z = 800 / s;
      this.zoomWith(z);
    }
  }

  componentDidUpdate() {
    var currentZoom = this.props.width / this.state.viewBox[2];
    var zoomIsHigh = (currentZoom > 1.5);
    if(zoomIsHigh !== this.props.zoomLevelHigh) {
      this.props.dispatch(setZoomLevelHigh(zoomIsHigh));
    }
  }

  getZoom() {
    return this.state.matrix[0];
  }

  onZoomIn() {
    this.zoomWith(1.1);
  }
  onZoomOut() {
    this.zoomWith(0.909);
  }

  onMousePressed(e) {
    // find start position of drag based on touch/mouse coordinates.
    const startX = typeof e.clientX === 'undefined' ? e.changedTouches[0].clientX : e.clientX;
    const startY = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY;
    // update state with above coordinates, and set buttonHeld to true.
    const state = {
      buttonHeld: true,
      dragging: false,
      startX,
      startY,
    };
    this.setState(state);
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
    if((!this.state.dragging) && this.state.buttonHeld) {
      var viewRect = this.svgElement.getBoundingClientRect();
      var viewX = e.clientX - viewRect.x;
      var viewY = e.clientY - viewRect.y;
      this.animateZoom(2, [viewX, viewY]); //animate to zoom level and center position
    }
    this.setState({ buttonHeld: false, dragging: false });
  }

  animateZoom(targetZoom, targetCenter) {
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

    // todo better
    if(scale < 1 && this.state.viewBox[2] > 3600) return;
    if(scale > 1 && this.state.viewBox[2] < 300) return;

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
    const nw = this.state.viewBox[2];
    const nh = this.state.viewBox[3];
    const nx = this.state.viewBox[0] - dx;
    const ny = this.state.viewBox[1] - dy;
    this.setState({ viewBox: [nx, ny, nw, nh]});
  }

}

const mapStateToProps = (state, ownProps) => ({
  zoomLevelHigh: state.zoomLevelHigh
})
SVGMap = connect(mapStateToProps)(SVGMap, null, null, { withRef: true })

export default SVGMap;
