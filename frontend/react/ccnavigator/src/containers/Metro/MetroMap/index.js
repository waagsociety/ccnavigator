import React from 'react';
import { css } from 'util/aphrodite-custom.js';
import { Style, RawStyle } from './style.js';
import { MetroLayout } from "./layout.js"
import CurvedPolyline from "util/curved_polyline.js"



const generateLineArrows = (points, direction) => {
  return points
    .map((point, index) => {
      var next = index + 1
      var size = 3.5

      if(next < points.length) {
        var x = (points[index][0] + points[next][0]) / 2
        var y = (points[index][1] + points[next][1]) / 2

        var dx = points[next][0] - points[index][0];
        var dy = points[next][1] - points[index][1];
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]

        const arrowFW = <path d={`M${x} ${y} m${size} 0 l-${size/2} 0 l0 -${size} l${size} ${size} l-${size} ${size} l0 -${size*2}`} transform={`rotate(${theta} ${x} ${y} )`} />
        const arrowBW = <path d={`M${x} ${y} m-${size} 0 l${size/2} 0 l0 ${size} l-${size} -${size} l${size} -${size} l0 ${size*2}`} transform={`rotate(${theta} ${x} ${y} )`} />

        return (
          <g key={index}>
            { direction.indexOf('>') !== -1 ? arrowFW : '' }
            { direction.indexOf('<') !== -1 ? arrowBW : '' }
          </g>
        )
      } else {
        return false
      }
    })
    .filter(value => value !== false)
}

/**
 * generate a metro line from the one point to the other, respecting some rules
 */
const generateSublinePoints = (start, end, index, strokeWidth) => {
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
const generateSubline = (center, point, index, strokeWidth, side) => {
  // reserve space for main line
  if(side === 'w') index++

  var name = `sub-line-${side}-${index}`
  var linePoints = generateSublinePoints(center, point, index, strokeWidth)
  var line = <path d={CurvedPolyline.smoothPolyline(linePoints, 10)} className={css(Style["line"], Style[name])} />
  var arrows = generateLineArrows(linePoints, '<>')

  return (
    <g key={name}>
      {line}
      {arrows}
    </g>
  )
}

/**
 * generate a station
 */
const generateStation = (x, y, label, labelAngle) => {
  x = x - MetroLayout.constants.lineWidth
  y = y - MetroLayout.constants.lineWidth

  return (
    <g>
      <rect className={css(Style["station"])}
        x={x}
        y={y}
        width={MetroLayout.constants.stationSize}
        height={MetroLayout.constants.stationSize}
        rx={MetroLayout.constants.stationSize / 2}
        ry={MetroLayout.constants.stationSize / 2}
      />
      <text className={css(Style["mapText"])} x={x} y={y} transform={`rotate(${labelAngle} ${x} ${y+5}) translate(-${label.length * 11} 10)`}>{label}</text>
    </g>
  )
}


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


    // generate the main line and start/end stations
    var mainLine = <path d={CurvedPolyline.smoothPolyline(MetroLayout.mainLine.points, 20)} className={css(Style.line, Style["main-line"])} />
    var mainLineArrows = generateLineArrows(MetroLayout.mainLine.points, '>')

    var startStationPoint = MetroLayout.mainLine.points[0]
    var startStation = generateStation(startStationPoint[0], startStationPoint[1], 'start', '45')

    var endStationPoint = MetroLayout.mainLine.points[MetroLayout.mainLine.points.length - 1]
    var endStation = generateStation(endStationPoint[0], endStationPoint[1], ' end', '-45')

    // generate sub lines
    // filter NE end points, sort by eastness and make svg paths
    var linesNE = MetroLayout.centralArea.endPoints
      .filter((point) => { return ((point[0] > MetroLayout.centralArea.center[0]) && (point[1] < MetroLayout.centralArea.center[1])) })
      .sort((point1, point2) => { return point1[0] - point2[0] })
      .map((point, index) => { return generateSubline(MetroLayout.centralArea.center, point, index, MetroLayout.constants.lineWidth, "e") })

    // filter SE end points, sort by eastness and make svg paths
    var linesSE = MetroLayout.centralArea.endPoints
      .filter((point) => { return ((point[0] > MetroLayout.centralArea.center[0]) && (point[1] > MetroLayout.centralArea.center[1])) })
      .sort((point1, point2) => { return point1[0] - point2[0] })
      .map((point, index) => { return generateSubline(MetroLayout.centralArea.center, point, index, MetroLayout.constants.lineWidth, "e") })

    // filter NW end points, sort by westness and make svg paths
    var linesNW = MetroLayout.centralArea.endPoints
      .filter((point) => { return ((point[0] < MetroLayout.centralArea.center[0]) && (point[1] < MetroLayout.centralArea.center[1])) })
      .sort((point1, point2) => { return point2[0] - point1[0] })
      .map((point, index) => { return generateSubline(MetroLayout.centralArea.center, point, index, MetroLayout.constants.lineWidth, "w") })

    // filter SW end points, sort by westness and make svg paths
    var linesSW = MetroLayout.centralArea.endPoints
      .filter((point) => { return ((point[0] < MetroLayout.centralArea.center[0]) && (point[1] > MetroLayout.centralArea.center[1])) })
      .sort((point1, point2) => { return point2[0] - point1[0] })
      .map((point, index) => { return generateSubline(MetroLayout.centralArea.center, point, index, MetroLayout.constants.lineWidth, "w") })


    // make stations
    var centralStationWidth = (Math.max(linesNE.length, linesSE.length) + Math.max(linesNW.length, linesSW.length) + 1) * 10;
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
