import React from 'react';
import ApiHelper from 'client/ApiHelper'
import { connect } from 'react-redux'
import SVGMap from "./SVGMap.js"
import MetroMap from "./MetroMap.js"
import CategoryBox from "./Zone.js"
import sizeMe from 'react-sizeme'

class Metro extends React.Component {

  state = {
    dimensions: {
      width: -1,
      height: -1
    }
  }

  componentDidMount() {
    this.update();
  }

  /**
   * when language changes render the map content again
   */
  componentWillReceiveProps(nextProps) {
    if(this.props.language !== nextProps.language) {
      this.update();
    }
  }

  /**
   * flatten all categories in the hierarchy getting the ones that are parent but not grand parent, add a path like "3-1"
   */
  flattenTree(tree) {
    var isGrandParent = function(node) {
      var reducer = (a, elem) => a + elem.children.length;
      return node.children.reduce(reducer, 0) > 0;
    }
    var goDeeper = function(node, res) {
      if(isGrandParent(node)) {
        for(var i=0; i<node.children.length; i++) {
          goDeeper(node.children[i], res);
        }
        node.grandparent = true
      } else {
        node.grandparent = false
      }
      res.push(node);
    }
    var result = [];
    for(var i=0; i<tree.length; i++) {
      goDeeper(tree[i], result);
    }
    return result;
  }

  /**
   * get the vocabulary with category labels to display on the map
   */
  update() {
    //console.log("rebuild map");
    ApiHelper.instance().buildContentHierarchy(function(hierarchy){
      this.setState({
        data: hierarchy
      });
    }.bind(this));
  }

  /**
   * mix the static map with rendered labels/category boxes
   */
  render() {

    //content boxes
    if(this.state && this.state.data) {
      var categoryBoxes = this.flattenTree(this.state.data).map((termEntity, index) => {
        return <CategoryBox key={termEntity.path} entity={termEntity} />
      });
    }
    //component rerenders on resize because of size me, could also be solved with react-measure
    return (

        <div id="container-map" style={{width:"100%", height:"100%"}} >
          <SVGMap width={this.props.size.width} height={this.props.size.height} >
            <MetroMap/>
            {categoryBoxes}
          </SVGMap>
        </div>

    )


  }
}

/**
 * update when language changes
 */
const mapStateToProps = (state, ownProps) => ({
  language: state.language
})

Metro = sizeMe({ monitorHeight: true })(Metro)
Metro = connect(mapStateToProps)(Metro)

export default Metro;
