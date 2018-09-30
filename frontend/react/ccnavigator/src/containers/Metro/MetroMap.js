import React from 'react';
import { MetroLayout } from "./MetroMapLayout.js"
import CurvedPolyline from "util/curved_polyline.js"



const generateLineArrows = (points, direction) => {
  return points
    .map((point, index) => {
      var next = index + 1
      var size = 3.5

      if(next < points.length) {
        var dx = points[next][0] - points[index][0];
        var dy = points[next][1] - points[index][1];

        var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        var threshold = 80

        if(d > threshold) {
          var radian = Math.atan2(dy, dx)
          var degree = radian * 180 / Math.PI

          // position at center of treshold
          //var x = points[index][0] + threshold / 2 * Math.cos(radian)
          //var y = points[index][1] + threshold / 2 * Math.sin(radian)

          // position at center of track part
          var x = (points[index][0] + points[next][0]) / 2
          var y = (points[index][1] + points[next][1]) / 2

          const arrowFW = <path d={`M${x} ${y} m${size} 0 l-${size/2} 0 l0 -${size} l${size} ${size} l-${size} ${size} l0 -${size*2}`} transform={`rotate(${degree} ${x} ${y} )`} />
          const arrowBW = <path d={`M${x} ${y} m-${size} 0 l${size/2} 0 l0 ${size} l-${size} -${size} l${size} -${size} l0 ${size*2}`} transform={`rotate(${degree} ${x} ${y} )`} />

          return (
            <g key={index}>
              { direction.indexOf('>') !== -1 ? arrowFW : '' }
              { direction.indexOf('<') !== -1 ? arrowBW : '' }
            </g>
          )
        } else {
          return false
        }
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
  var p1 = [begin[0], (begin[1] + (ySign * (42.5 - (index * strokeWidth * 0.75))))];

  //go 45,135,225 or 315 degr from end
  var len = Math.random() * 30 + 40;
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

  var linePoints = generateSublinePoints(center, point, index, strokeWidth)
  var line = <path d={CurvedPolyline.smoothPolyline(linePoints, 10)} className={`line sub-line-${side}-${index}`} />
  var arrows = generateLineArrows(linePoints, '<>')

  return (
    <g key={index}>
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
      <rect className="station"
        x={x}
        y={y}
        width={MetroLayout.constants.stationSize}
        height={MetroLayout.constants.stationSize}
        rx={MetroLayout.constants.stationSize / 2}
        ry={MetroLayout.constants.stationSize / 2}
      />
      <text className="map-text" x={x} y={y} transform={`rotate(${labelAngle} ${x} ${y+5}) translate(-${label.length * 11} 10)`}>{label}</text>
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
    //var teamAreaClosed = CurvedPolyline.closeLine(MetroLayout.teamArea.points)
    //var teamArea = <path d={CurvedPolyline.smoothPolyline(teamAreaClosed, 20)} className="area" />
    //var communityAreaClosed = CurvedPolyline.closeLine(MetroLayout.communityArea.points)
    //var communityArea = <path d={CurvedPolyline.smoothPolyline(communityAreaClosed, 20)} className="area" />
    //var navigatorAreaClosed = CurvedPolyline.closeLine(MetroLayout.navigatorArea.points)
    //var navigatorArea = <path d={CurvedPolyline.smoothPolyline(navigatorAreaClosed, 20)} className="area" />

    //var cityAreaClosed = CurvedPolyline.closeLine(MetroLayout.cityArea.points)
    //var cityArea = <path d={CurvedPolyline.smoothPolyline(cityAreaClosed, 20)} className="wide-area" />

    //var zone2Closed = CurvedPolyline.closeLine(MetroLayout.zone2.points)
    //var zone2 = <path d={CurvedPolyline.smoothPolyline(zone2Closed, 20)} className="inner-area" />


    //var innerAreaClosed = CurvedPolyline.closeLine(MetroLayout.innerArea.points)
    //var innerArea = <path d={CurvedPolyline.smoothPolyline(innerAreaClosed, 20)} className="inner-area" />

    //var centralAreaClosed = CurvedPolyline.closeLine(MetroLayout.centralArea.points)
    //var centralArea = <path d={CurvedPolyline.smoothPolyline(centralAreaClosed, 20)} className="central-area" />

    //var islandClosed = CurvedPolyline.closeLine(MetroLayout.island.points)
    //var island = <path d={CurvedPolyline.smoothPolyline(islandClosed, 20)} className="area" />

    // make river
    //var closedRiver = CurvedPolyline.closeLine(MetroLayout.river.points)
    //var river = <path d={CurvedPolyline.smoothPolyline(closedRiver, 20)} className="river" />


    // generate the main line and start/end stations
    var mainLine = <path d={CurvedPolyline.smoothPolyline(MetroLayout.mainLine.points, 20)} className="line main-line" />
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
    var centralStation = <rect x={MetroLayout.centralArea.center[0] - centralStationWidth / 2} y={MetroLayout.centralArea.center[1] - 5} width={centralStationWidth} height="10" rx="5" ry="5" className="station" />

    var stations = MetroLayout.mainLine.stations.map((point, index) => {
      return <rect key={index} x={point[0] - 5} y={point[1] - 5} width="10" height="10" rx="5" ry="5" className="station" />
    })

    // {innerArea}
    // {island}
    // {teamArea}
    // {communityArea}
    // {navigatorArea}
    // {cityArea}
    // {zone2}
    // {centralArea}
    // {river}

    //<path d="M80,490,346.46,223.54A13.91,13.91,0,0,1,355,220H485a13.91,13.91,0,0,1,8.54,3.54L636.46,366.46A13.91,13.91,0,0,1,640,375V615a13.91,13.91,0,0,1-3.54,8.54L373.54,886.46A13.91,13.91,0,0,1,365,890H245a13.91,13.91,0,0,1-8.54-3.54L80,730" fill="none" stroke="#29bdbe" strokeMiterlimit="10" strokeWidth="6"/>

    //the composed metro map
    return (
      <g>
        <g><path d="M170-240c5.5,0,13.18,3.18,17.07,7.07L412.93-7.07C416.82-3.18,420,4.5,420,10V310c0,5.5-3.18,13.18-7.07,17.07l-85.86,85.86C323.18,416.82,320,424.5,320,430V950c0,5.5,3.18,13.18,7.07,17.07l85.86,85.86c3.89,3.89,7.07,11.57,7.07,17.07v280c0,5.5-3.18,13.18-7.07,17.07L187.07,1592.93c-3.89,3.89-11.57,7.07-17.07,7.07H-290c-5.5,0-13.18-3.18-17.07-7.07l-225.86-225.86c-3.89-3.89-7.07-11.57-7.07-17.07V10c0-5.5,3.18-13.18,7.07-17.07l225.86-225.86c3.89-3.89,11.57-7.07,17.07-7.07Zm540,0c-5.5,0-13.18,3.18-17.07,7.07L467.07-7.07C463.18-3.18,460,4.5,460,10V330c0,5.5-3.18,13.18-7.07,17.07l-85.86,85.86C363.18,436.82,360,444.5,360,450V930c0,5.5,3.18,13.18,7.07,17.07l85.86,85.86c3.89,3.89,7.07,11.57,7.07,17.07v300c0,5.5,3.18,13.18,7.07,17.07l225.86,225.86c3.89,3.89,11.57,7.07,17.07,7.07h460c5.5,0,13.18-3.18,17.07-7.07l225.86-225.86c3.89-3.89,7.07-11.57,7.07-17.07V1070c0-5.5-3.18-13.18-7.07-17.07l-85.86-85.86c-3.89-3.89-7.07-11.57-7.07-17.07V430c0-5.5,3.18-13.18,7.07-17.07l85.86-85.86c3.89-3.89,7.07-11.57,7.07-17.07V10c0-5.5-3.18-13.18-7.07-17.07L1187.07-232.93c-3.89-3.89-11.57-7.07-17.07-7.07Zm760,0a10,10,0,0,0-10,10V1590a10,10,0,0,0,10,10h520a10,10,0,0,0,10-10V410a10,10,0,0,1,10-10h20a10,10,0,0,1,10,10V1590a10,10,0,0,0,10,10h520a10,10,0,0,0,10-10V-30c0-5.5-3.18-13.18-7.07-17.07L2387.07-232.93c-3.89-3.89-11.57-7.07-17.07-7.07ZM282.5-2663.33a10,10,0,0,0-7.27,12.13l13.34,53.3a10,10,0,0,0,12.13,7.27L354-2604a10,10,0,0,0,7.27-12.13l-13.34-53.3a10,10,0,0,0-12.13-7.27Z" fill="#f2f2f2"/><path d="M-10,190c0-5.5,3.18-13.18,7.07-17.07L152.93,17.07C156.82,13.18,164.5,10,170,10H840c5.5,0,13.08,3.28,16.85,7.28l146.3,155.44c3.77,4,6.85,11.78,6.85,17.28V710c0,5.5-3.18,13.18-7.07,17.07L827.07,902.93C823.18,906.82,815.5,910,810,910H205c-5.5,0-13.22-3.14-17.16-7L-2.84,717C-6.78,713.14-10,705.5-10,700Z" fill="#e5e5e5"/><path d="M750,20c5.5,0,13.18,3.18,17.07,7.07L992.93,252.93c3.89,3.89,7.07,11.57,7.07,17.07V705c0,5.5-3.18,13.18-7.07,17.07L822.07,892.93C818.18,896.82,810.5,900,805,900H230c-5.5,0-13.18-3.18-17.07-7.07L72.07,752.07a10,10,0,0,1,0-14.15L212.4,597.08c3.88-3.89,11.56-7.08,17.06-7.08H330a10,10,0,0,0,10-10V440c0-5.5,3.18-13.18,7.07-17.07l85.86-85.86c3.89-3.89,2.57-7.07-2.93-7.07H330c-5.5,0-13.18-3.18-17.07-7.07L172.07,182.07a10,10,0,0,1,0-14.14L312.93,27.07C316.82,23.18,324.5,20,330,20Z" fill="#dbdbdb"/><path d="M982.93,342.93C986.82,346.82,990,354.5,990,360V700c0,5.5-3.18,13.18-7.07,17.07L817.07,882.93C813.18,886.82,805.5,890,800,890H380a10,10,0,0,1-10-10V455c0-5.5,3.18-13.18,7.07-17.07L537.93,277.07C541.82,273.18,549.5,270,555,270H900c5.5,0,13.18,3.18,17.07,7.07Z" fill="#ccc"/><path d="M460,330c0,5.5-3.18,13.18-7.07,17.07l-85.86,85.86C363.18,436.82,360,444.5,360,450V930c0,5.5,3.18,13.18,7.07,17.07l85.86,85.86c3.89,3.89,7.07,11.57,7.07,17.07V2130a10,10,0,0,1-10,10H430a10,10,0,0,1-10-10V1070c0-5.5-3.18-13.18-7.07-17.07l-85.86-85.86C323.18,963.18,320,955.5,320,950V430c0-5.5,3.18-13.18,7.07-17.07l85.86-85.86C416.82,323.18,420,315.5,420,310V-650a10,10,0,0,1,10-10h20a10,10,0,0,1,10,10Z" fill="#bbd5ea"/></g>
      <g>
        {mainLine}
        {mainLineArrows}
        {startStation}
        {endStation}
        {linesNE}
        {linesSE}
        {linesNW}
        {linesSW}
        {centralStation}
        {stations}
      </g>
    </g>
    )
  }

}


export default MetroMap;
