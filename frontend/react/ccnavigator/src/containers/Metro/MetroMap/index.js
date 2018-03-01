import React from 'react';
import { css } from 'util/aphrodite-custom.js';
import { Style, RawStyle } from './style.js';
import { Metro1 as MetroLayout } from "./layout.js"
import CurvedPolyline from "util/curved_polyline.js"


/**
 * generate a metro line from the one point to the other, respecting some rules
 */
const generateLine = (start, end, index, strokeWidth) => {
  //determine direction NE,SE,NW,SW
  var xSign = (end[0] - start[0]) > 0 ? 1 : -1;
  var ySign = (end[1] - start[1]) > 0 ? 1 : -1;

  //begin point east or west offset from center
  var offset = strokeWidth * 0.75 + (index * strokeWidth * 1.5)

  var begin = [start[0] + xSign * offset, start[1]];
  //go up or down from the begin
  var p1 = [begin[0], (begin[1] + (ySign * (40 - (index * strokeWidth * 0.75))))];
  //go 45,135,225 or 315 degr from end
  var len = Math.random() * 40 + 20;
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
  // reserve space for main line
  if(side === 'w') index++;

  var l = generateLine(center, point, index, strokeWidth);
  console.log(l)
  var name = `sub-line-${side}-${index}`;
  return <path key={name} d={CurvedPolyline.smoothPolyline(l, 10)} className={css(Style["line"], Style[name])} />
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

    // make land
    var teamAreaClosed = CurvedPolyline.closeLine(MetroLayout.teamArea.points)
    var teamArea = <path d={CurvedPolyline.smoothPolyline(teamAreaClosed, 20)} className={css(Style["area"])} />
    var communityAreaClosed = CurvedPolyline.closeLine(MetroLayout.communityArea.points)
    var communityArea = <path d={CurvedPolyline.smoothPolyline(communityAreaClosed, 20)} className={css(Style["area"])} />

    var wideAreaClosed = CurvedPolyline.closeLine(MetroLayout.wideArea.points)
    var wideArea = <path d={CurvedPolyline.smoothPolyline(wideAreaClosed, 20)} className={css(Style["wide-area"])} />
    var innerAreaClosed = CurvedPolyline.closeLine(MetroLayout.innerArea.points)
    var innerArea = <path d={CurvedPolyline.smoothPolyline(innerAreaClosed, 20)} className={css(Style["inner-area"])} />

    var centralAreaClosed = CurvedPolyline.closeLine(MetroLayout.centralArea.points)
    var centralArea = <path d={CurvedPolyline.smoothPolyline(centralAreaClosed, 20)} className={css(Style["central-area"])} />

    var islandClosed = CurvedPolyline.closeLine(MetroLayout.island.points)
    var island = <path d={CurvedPolyline.smoothPolyline(islandClosed, 20)} className={css(Style["area"])} />

    // make river
    var closedRiver = CurvedPolyline.closeLine(MetroLayout.river.points)
    var river = <path d={CurvedPolyline.smoothPolyline(closedRiver, 20)} className={css(Style["river"])} />


    // generate the main line
    var mainLine = <path d={CurvedPolyline.smoothPolyline(MetroLayout.mainLine.points, 20)} className={css(Style.line, Style["main-line"])} />
    var mainLineArrows = MetroLayout.mainLine.points
      .map((point, index) => {
        var next = index + 1
        var size = 3.5

        if(next < MetroLayout.mainLine.points.length) {
          var x = (MetroLayout.mainLine.points[index][0] + MetroLayout.mainLine.points[next][0]) / 2
          var y = (MetroLayout.mainLine.points[index][1] + MetroLayout.mainLine.points[next][1]) / 2

          var dx = MetroLayout.mainLine.points[next][0] - MetroLayout.mainLine.points[index][0];
          var dy = MetroLayout.mainLine.points[next][1] - MetroLayout.mainLine.points[index][1];
          var theta = Math.atan2(dy, dx); // range (-PI, PI]
          theta *= 180 / Math.PI; // rads to degs, range (-180, 180]

          return <path key={index} d={`M${x} ${y} l-${size/2} 0 l0 -${size} l${size} ${size} l-${size} ${size} l0 -${size*2}`} transform={`rotate(${theta} ${x} ${y} )`} />
        } else {
          return false
        }
      })
      .filter(value => value !== false)
      var startStationPoint = MetroLayout.mainLine.points[0]
      var startStation = (
        <g>
          <rect x={startStationPoint[0] - 5} y={startStationPoint[1] - 5} width="10" height="10" rx="5" ry="5" className={css(Style["station"])} />
          <text x={startStationPoint[0] - 42} y={startStationPoint[1] - 35} className={css(Style["mapText"])} transform={`rotate(45 ${startStationPoint[0] - 42} ${startStationPoint[1] - 35})`}>start</text>
        </g>
      )
      var endStationPoint = MetroLayout.mainLine.points[MetroLayout.mainLine.points.length - 1]
      var endStation = (
        <g>
          <rect x={endStationPoint[0] - 5} y={endStationPoint[1] - 5} width="10" height="10" rx="5" ry="5" className={css(Style["station"])} />
          <text x={endStationPoint[0] - 30} y={endStationPoint[1] + 37} className={css(Style["mapText"])} transform={`rotate(-45 ${endStationPoint[0] - 30} ${endStationPoint[1] + 37})`}>end</text>
        </g>
      )


    // generate sub lines
    // filter NE end points and sort by eastness
    var endPointsNE = MetroLayout.centralArea.endPoints
      .filter((point) => { return ((point[0] > MetroLayout.centralArea.center[0]) && (point[1] < MetroLayout.centralArea.center[1])) })
      .sort((point1, point2) => { return point1[0] - point2[0] });

    // filter SE end points and sort by eastness
    var endPointsSE = MetroLayout.centralArea.endPoints
      .filter((point) => { return ((point[0] > MetroLayout.centralArea.center[0]) && (point[1] > MetroLayout.centralArea.center[1])) })
      .sort((point1, point2) => { return point1[0] - point2[0] });

    // filter NW end points and sort by westness
    var endPointsNW = MetroLayout.centralArea.endPoints
      .filter((point) => { return ((point[0] < MetroLayout.centralArea.center[0]) && (point[1] < MetroLayout.centralArea.center[1])) })
      .sort((point1, point2) => { return point2[0] - point1[0] });

    // filter SW end points and sort by westness
    var endPointsSW = MetroLayout.centralArea.endPoints
      .filter((point) => { return ((point[0] < MetroLayout.centralArea.center[0]) && (point[1] > MetroLayout.centralArea.center[1])) })
      .sort((point1, point2) => { return point2[0] - point1[0] });

    // make the svg paths
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

    // stations
    var centralStationWidth = (Math.max(endPointsNE.length, endPointsSE.length) + Math.max(endPointsNW.length, endPointsSW.length) + 1) * 10;
    var centralStation = <rect x={MetroLayout.centralArea.center[0] - centralStationWidth / 2} y={MetroLayout.centralArea.center[1]} width={centralStationWidth} height="10" rx="5" ry="5" className={css(Style["station"])} />


    //the composed metro map
    return (
      <g>
        {island}
        {teamArea}
        {communityArea}
        {wideArea}
        {innerArea}
        {centralArea}
        {river}
        {mainLine}
        {mainLineArrows}
        {startStation}
        {endStation}
        {linesNE}
        {linesSE}
        {linesNW}
        {linesSW}
        {centralStation}
      </g>
    )
  }

}


export default MetroMap;
