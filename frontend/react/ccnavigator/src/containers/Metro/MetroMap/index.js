import React from 'react';
import { css } from 'util/aphrodite-custom.js';
import { Style, RawStyle } from './style.js';
import { Metro1 as MetroLayout } from "./layout.js"
import CurvedPolyline from "util/curved_polyline.js"


/**
 * generate a metro line from the one point to the other, respecting some rules
 */
const generateLine = (start, end, index, strokeWidth) => {
  //determine direction NE,SE,NE,SW
  var xSign = (end[0] - start[0]) > 0 ? 1 : -1;
  var ySign = (end[1] - start[1]) > 0 ? 1 : -1;
  //begin point east or west offset from center
  var offset = strokeWidth * 0.75 + (index * strokeWidth * 1.5)
  var begin = [start[0] + xSign * offset, start[1]];
  //go up or down from the begin
  var p1 = [begin[0], (begin[1] + (ySign * (40 - (index * strokeWidth * 0.75))))];
  //go 45,135,225 or 315 degr from end
  var len = Math.random() * 40 + 10;
  var p3 = [(end[0] + (xSign * - len)),(end[1] + (ySign * - len))]
  //then go 45,135,225 or 315 degr for a minimal length
  var dX = Math.abs(p3[0] - p1[0]);
  var dY = Math.abs(p3[1] - p1[1]);
  var dM = Math.min(dX,dY);
  var p2 = [(p1[0] + dM * xSign), (p1[1] + dM * ySign)];
  //return polyline points
  return [begin,p1,p2,p3,end];
}

/**
 * return a path from center to point, index and side are user for composing css class
 */
const subLine = (center, point, index, strokeWidth, side) => {
  var l = generateLine(center, point, index, strokeWidth);
  var name = `sub-line-${side}-${index}`;
  return <path key={name} d={CurvedPolyline.smoothPolyline(l, 10)} className={css(Style["line"], Style[name])}  />
};


class MetroMap extends React.Component {

  /**
   * we have some random values to generated the map, it should only be created once
   */
  shouldComponentUpdate() {
    return false;
  }

  /**
   * return a SVG structure representing a metro map using a layout to generate it
   */
  render() {
    //generate the central area
    var closedPath = CurvedPolyline.closeLine(MetroLayout.centralArea.points)
    var centralArea = <path d={CurvedPolyline.smoothPolyline(closedPath, 40)} className={css(Style["area"])}  />
    //generate the main line
    var mainLineIn = <path d={CurvedPolyline.smoothPolyline(MetroLayout.mainLineIn.points, 20)} className={css(Style.line, Style["main-line"])}  />
    var mainLineOut = <path d={CurvedPolyline.smoothPolyline(MetroLayout.mainLineOut.points, 20)} className={css(Style.line, Style["main-line"])}  />
    //filter end point lies north east
    var endPointsNE = MetroLayout.centralArea.points.filter((point) => {
      return ((point[0] < MetroLayout.centralArea.center[0]) && (point[1] < MetroLayout.centralArea.center[1]));
    });
    //sort by eastness
    endPointsNE = endPointsNE.sort((point1, point2) => {
      return point2[0] - point1[0];
    });
    //filter end point lies south east of center
    var endPointsSE = MetroLayout.centralArea.points.filter((point) => {
      return ((point[0] < MetroLayout.centralArea.center[0]) && (point[1] > MetroLayout.centralArea.center[1]));
    });
    //sort by eastness
    endPointsSE = endPointsSE.sort((point1, point2) => {
      return point2[0] - point1[0];
    });
    //filter end point lies north west
    var endPointsNW = MetroLayout.centralArea.points.filter((point) => {
      return ((point[0] > MetroLayout.centralArea.center[0]) && (point[1] < MetroLayout.centralArea.center[1]));
    });
    //sort by westness
    endPointsNW = endPointsNW.sort((point1, point2) => {
      return point1[0] - point2[0];
    });
    //filter end point lies south west of center
    var endPointsSW = MetroLayout.centralArea.points.filter((point) => {
      return ((point[0] > MetroLayout.centralArea.center[0]) && (point[1] > MetroLayout.centralArea.center[1]));
    });
    //sort by westness
    endPointsSW = endPointsSW.sort((point1, point2) => {
      return point1[0] - point2[0];
    });
    //make the svg paths
    var strokeWidth = parseFloat(RawStyle.line["strokeWidth"]);
    var linesNE = endPointsNE.map((point, index) => {
      return subLine(MetroLayout.centralArea.center, point, index, strokeWidth, "e");
    });
    var linesSE = endPointsSE.map((point, index) => {
      return subLine(MetroLayout.centralArea.center, point, index, strokeWidth, "e");
    });
    var linesNW = endPointsNW.map((point, index) => {
      return subLine(MetroLayout.centralArea.center, point, index, strokeWidth, "w");
    });
    var linesSW = endPointsSW.map((point, index) => {
      return subLine(MetroLayout.centralArea.center, point, index, strokeWidth, "w");
    });
    //make the river
    var closedRiver = CurvedPolyline.closeLine(MetroLayout.river.points)
    var river = <path d={CurvedPolyline.smoothPolyline(closedRiver, 20)} className={css(Style["river"])}  />
    //make the wide area
    var closedWideArea = CurvedPolyline.closeLine(MetroLayout.wideArea.points)
    var wideArea = <path d={CurvedPolyline.smoothPolyline(closedWideArea, 20)} className={css(Style["wide-area"])}  />
    var closedInnerArea = CurvedPolyline.closeLine(MetroLayout.innerArea.points)
    var innerArea = <path d={CurvedPolyline.smoothPolyline(closedInnerArea, 20)} className={css(Style["inner-area"])}  />
    //the composed metro map
    return (
      <g>
        {wideArea}
        {innerArea}
        {centralArea}
        {river}
        {mainLineIn}
        {mainLineOut}
        <rect x={MetroLayout.centralArea.center[0] - 5 } y={MetroLayout.centralArea.center[1] - 15} width="10" height="30" rx="5" ry="5" fill={"#000"}/>
        {linesNE}
        {linesSE}
        {linesNW}
        {linesSW}
      </g>
    )
  }

}


export default MetroMap;
