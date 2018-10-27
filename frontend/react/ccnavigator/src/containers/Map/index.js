import React from 'react'
import sizeMe from 'react-sizeme'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import ApiHelper from 'client/ApiHelper'

import SVGMap from "./SVGMap.js"
import ZoneBox from "./ZoneBox.js"
import Panels from "containers/Panels"

import Theme from "containers/InfoPanel/Theme.js"
import Zone from "containers/InfoPanel/Zone.js"
import Tool from "containers/InfoPanel/Tool.js"
import GlossaryItem from "containers/InfoPanel/GlossaryItem.js"


class Map extends React.Component {

  state = {
    data: null,
    filtersSelected: [],
    dimensions: {
      width: -1,
      height: -1
    }
  }

  componentDidMount() {
    this.update(this.state.filtersSelected)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.filtersSelected !== nextProps.filtersSelected) {
      this.update(nextProps.filtersSelected)
    }
  }

  // flatten all categories in the hierarchy getting the ones that are parent but not grand parent, add a path like "3-1"
  flattenTree(tree) {
    var isGrandParent = function(node) {
      var reducer = (a, elem) => a + elem.children.length
      return node.children.reduce(reducer, 0) > 0
    }
    var goDeeper = function(node, res) {
      if(isGrandParent(node)) {
        for(var i=0; i<node.children.length; i++) {
          goDeeper(node.children[i], res)
        }
        node.grandparent = true
      } else {
        node.grandparent = false
      }
      res.push(node)
    }
    var result = []
    for(var i=0; i<tree.length; i++) {
      goDeeper(tree[i], result)
    }
    return result
  }

  // get the vocabulary with category labels to display on the map
  update(filtersSelected) {
    ApiHelper.instance().clearCaches()
    ApiHelper.instance().buildContentHierarchy(function(hierarchy){
      this.setState({
        data: hierarchy,
        filtersSelected: filtersSelected
      })
    }.bind(this))
  }

  render() {
    //zone boxes
    if(this.state && this.state.data) {
      var zoneBoxes = this.flattenTree(this.state.data).map((termEntity, index) => {
        return <ZoneBox key={termEntity.path} entity={termEntity} filter={this.state.filtersSelected} />
      })
    }

    //component rerenders on resize because of size me, could also be solved with react-measure
    return (
      <div id="container-map" style={{width:"100%", height:"100%"}}>
        <SVGMap width={this.props.size.width} height={this.props.size.height}>
          <g><path d="M255-345c5.5,0,13.18,3.18,17.07,7.07L402.93-207.07C406.82-203.18,410-195.5,410-190V335c0,5.5-3.18,13.18-7.07,17.07l-85.86,85.86C313.18,441.82,310,449.5,310,455V975c0,5.5,3.18,13.18,7.07,17.07l85.86,85.86c3.89,3.89,7.07,11.57,7.07,17.07v115c0,5.5-3.18,13.18-7.07,17.07L267.07,1362.93c-3.89,3.89-11.57,7.07-17.07,7.07H-250c-5.5,0-13.18-3.18-17.07-7.07L-662.93,967.07C-666.82,963.18-670,955.5-670,950V115c0-5.5,3.18-13.18,7.07-17.07l435.86-435.86c3.89-3.89,11.57-7.07,17.07-7.07Zm350,0c-5.5,0-13.18,3.18-17.07,7.07L457.07-207.07C453.18-203.18,450-195.5,450-190V355c0,5.5-3.18,13.18-7.07,17.07l-85.86,85.86C353.18,461.82,350,469.5,350,475V955c0,5.5,3.18,13.18,7.07,17.07l85.86,85.86c3.89,3.89,7.07,11.57,7.07,17.07v135c0,5.5,3.18,13.18,7.07,17.07l135.86,135.86c3.89,3.89,11.57,7.07,17.07,7.07h730c5.5,0,13.18-3.18,17.07-7.07l395.86-395.86c3.89-3.89,7.07-11.57,7.07-17.07V155c0-5.5-3.18-13.18-7.07-17.07L1277.07-337.93c-3.89-3.89-11.57-7.07-17.07-7.07Z" fill="#f2f2f2"/><path d="M-20,295c0-5.5,3.18-13.18,7.07-17.07L277.93-12.93C281.82-16.82,289.5-20,295-20H755c5.5,0,13.18,3.18,17.07,7.07l330.86,330.86c3.89,3.89,7.07,11.57,7.07,17.07V775c0,5.5-3.18,13.18-7.07,17.07L857.07,1037.93c-3.89,3.89-11.57,7.07-17.07,7.07H250c-5.5,0-13.18-3.18-17.07-7.07L-12.93,792.07C-16.82,788.18-20,780.5-20,775Z" fill="#e5e5e5"/><path d="M730,45c5.5,0,13.18,3.18,17.07,7.07l290.86,290.86c3.89,3.89,7.07,11.57,7.07,17.07V750c0,5.5-3.18,13.18-7.07,17.07L832.07,972.93C828.18,976.82,820.5,980,815,980H275c-5.5,0-13.18-3.18-17.07-7.07L62.07,777.07a10,10,0,0,1,0-14.15L202.4,622.08c3.88-3.89,11.56-7.08,17.06-7.08H320a10,10,0,0,0,10-10V465c0-5.5,3.18-13.18,7.07-17.07l85.86-85.86c3.89-3.89,2.57-7.07-2.93-7.07H320c-5.5,0-13.18-3.18-17.07-7.07L162.07,207.07a10,10,0,0,1,0-14.14L302.93,52.07C306.82,48.18,314.5,45,320,45Z" fill="#dbdbdb"/><path d="M972.93,367.93C976.82,371.82,980,379.5,980,385V725c0,5.5-3.18,13.18-7.07,17.07L807.07,907.93C803.18,911.82,795.5,915,790,915H370a10,10,0,0,1-10-10V480c0-5.5,3.18-13.18,7.07-17.07L527.93,302.07C531.82,298.18,539.5,295,545,295H890c5.5,0,13.18,3.18,17.07,7.07Z" fill="#ccc"/><path d="M450,355c0,5.5-3.18,13.18-7.07,17.07l-85.86,85.86C353.18,461.82,350,469.5,350,475V955c0,5.5,3.18,13.18,7.07,17.07l85.86,85.86c3.89,3.89,7.07,11.57,7.07,17.07V2155a10,10,0,0,1-10,10H420a10,10,0,0,1-10-10V1095c0-5.5-3.18-13.18-7.07-17.07l-85.86-85.86C313.18,988.18,310,980.5,310,975V455c0-5.5,3.18-13.18,7.07-17.07l85.86-85.86C406.82,348.18,410,340.5,410,335V-625a10,10,0,0,1,10-10h20a10,10,0,0,1,10,10Z" fill="#bbd5ea"/><path d="M90,495,336.46,248.54A13.91,13.91,0,0,1,345,245H475a13.91,13.91,0,0,1,8.54,3.54L626.46,391.46A13.91,13.91,0,0,1,630,400V640a13.91,13.91,0,0,1-3.54,8.54L363.54,911.46A13.91,13.91,0,0,1,355,915H240a13.91,13.91,0,0,1-8.54-3.54L90,770" fill="none" stroke="#2FB6BC" strokeMiterlimit="10" strokeWidth="6"/><path d="M639.5,602.5V564.14a10,10,0,0,1,2.93-7.07l84.89-84.89a10,10,0,0,0,2.93-7.07V368.89a10,10,0,0,1,2.93-7.07L800,295" fill="none" stroke="#f6a500" strokeMiterlimit="10" strokeWidth="6"/><path d="M648.5,602.5V568.64a10,10,0,0,1,2.93-7.07l23.81-23.81a10,10,0,0,1,7.07-2.93H906a10,10,0,0,0,7.07-2.93L980,465" fill="none" stroke="#522e90" strokeMiterlimit="10" strokeWidth="6"/><path d="M639.5,602.5v38.36a10,10,0,0,0,2.93,7.07L752.25,757.75a10,10,0,0,1,2.92,7.07V866a10,10,0,0,0,2.93,7.07L800,915" fill="none" stroke="#f6a500" strokeMiterlimit="10" strokeWidth="6"/><path d="M648.5,602.5v33.86a10,10,0,0,0,2.93,7.07l37.43,37.43a10,10,0,0,0,7.07,2.93H934.64a10,10,0,0,1,7.08,2.93L980,725" fill="none" stroke="#522e90" strokeMiterlimit="10" strokeWidth="6"/><path d="M621.5,602.5V568.64a10,10,0,0,0-2.93-7.07L582,525a10,10,0,0,0-7.07-2.92H416.25a10,10,0,0,1-7.07-2.93L360,470" fill="none" stroke="#da0812" strokeMiterlimit="10" strokeWidth="6"/><path d="M621.5,602.5v33.86a10,10,0,0,1-2.93,7.07l-55.86,55.86a10,10,0,0,1-7.07,2.93H406.93a10,10,0,0,0-7.08,2.93L360,745" fill="none" stroke="#da0812" strokeMiterlimit="10" strokeWidth="6"/><circle cx="90" cy="495" r="5" fill="#fff" stroke="#000" strokeMiterlimit="10" strokeWidth="3"/><circle cx="270" cy="315" r="5" fill="#fff" stroke="#000" strokeMiterlimit="10" strokeWidth="3"/><circle cx="410" cy="245" r="5" fill="#fff" stroke="#000" strokeMiterlimit="10" strokeWidth="3"/><circle cx="535" cy="300" r="5" fill="#fff" stroke="#000" strokeMiterlimit="10" strokeWidth="3"/><circle cx="360" cy="915" r="5" fill="#fff" stroke="#000" strokeMiterlimit="10" strokeWidth="3"/><circle cx="90" cy="770" r="5" fill="#fff" stroke="#000" strokeMiterlimit="10" strokeWidth="3"/><path d="M655,600a5,5,0,0,1-5,5H620a5,5,0,0,1-5-5h0a5,5,0,0,1,5-5h30a5,5,0,0,1,5,5Z" fill="#fff"/><path d="M655,600a5,5,0,0,1-5,5H620a5,5,0,0,1-5-5h0a5,5,0,0,1,5-5h30a5,5,0,0,1,5,5Z" fill="none" stroke="#000" strokeMiterlimit="10" strokeWidth="3"/><polygon points="180 401 184 401 184 405 180 401"/><polygon points="585 346 585 350 581 350 585 346"/><polygon points="632.83 485 630 487.83 627.17 485 632.83 485"/><polygon points="497.59 519.17 500.41 522 497.59 524.83 497.59 519.17"/><polygon points="494.41 524.83 491.59 522 494.41 519.17 494.41 524.83"/><polygon points="727.17 413.41 730 410.59 732.83 413.41 727.17 413.41"/><polygon points="732.83 416.59 730 419.41 727.17 416.59 732.83 416.59"/><polygon points="752.17 808.41 755 805.59 757.83 808.41 752.17 808.41"/><polygon points="757.83 811.59 755 814.41 752.17 811.59 757.83 811.59"/><polygon points="801.59 532.17 804.41 535 801.59 537.83 801.59 532.17"/><polygon points="798.41 537.83 795.59 535 798.41 532.17 798.41 537.83"/><polygon points="826.59 681.17 829.41 684 826.59 686.83 826.59 681.17"/><polygon points="823.41 686.83 820.59 684 823.41 681.17 823.41 686.83"/><polygon points="482.17 699.17 485 702 482.17 704.83 482.17 699.17"/><polygon points="479 704.83 476.17 702 479 699.17 479 704.83"/><polygon points="514 765 510 765 510 761 514 765"/><polygon points="166 850 166 846 170 846 166 850"/></g>
          {zoneBoxes}
          <foreignObject id="easter-egg" x="185" y="-1475">
            <span role="img" aria-label="Moyai">🗿</span>
            <span role="img" aria-label="Egg">🥚</span>
          </foreignObject>
        </SVGMap>

        <Panels/>

        <Switch>
          <Route path="/navigator/theme/:id" component={Theme} />
          <Route path="/navigator/zone/:id" component={Zone} />
          <Route path="/navigator/tool/:id" component={Tool} />
          <Route path="/navigator/*/taxonomy/term/:id" component={GlossaryItem} />
        </Switch>
      </div>
    )
  }
}

// update when language or filters change
const mapStateToProps = (state, ownProps) => ({
  language: state.language,
  filtersSelected: state.toolFiltersApplied
})

Map = sizeMe({ monitorHeight: true })(Map)
Map = connect(mapStateToProps)(Map)

export default Map