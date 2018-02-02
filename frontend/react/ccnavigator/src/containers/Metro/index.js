import React from 'react';
import ApiHelper from 'client/ApiHelper'
import { connect } from 'react-redux'
import SVGMap from "./SVGMap"
import MetroMap from "./MetroMap"
import CategoryBox from "./CategoryBox"

class Metro extends React.Component {

	/**
	 *
	 */
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
				for(var i=0;i<node.children.length;i++) {
					goDeeper(node.children[i], res);
				}
			} else {
				res.push(node);
			}
		}
		var result = [];
		for(var i=0;i<tree.length;i++) {
			goDeeper(tree[i], result);
		}
		return result;
	}

	/**
	 * get the vocabulary with category labels to display on the map
	 */
	update() {
		console.log("rebuild map");
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
		if(this.state && this.state.data) {
			var categoryBoxes = this.flattenTree(this.state.data).map((termEntity, index) => {
				return <CategoryBox key={termEntity.path} entity={termEntity} />
			});
		}
		return (
			<SVGMap ref={(elem) => { this.svgMap = elem }} width={this.props.width} height={this.props.height} >
							<MetroMap/>
							{categoryBoxes}
			</SVGMap>
    );
	}
}

/**
 * update when language changes
 */
const mapStateToProps = (state, ownProps) => ({
  language: state.language
})

Metro = connect(mapStateToProps)(Metro)

export default Metro;
