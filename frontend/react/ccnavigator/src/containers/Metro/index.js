import React from 'react';
import ApiClient from 'client/ApiClient'
import ApiHelper from 'client/ApiHelper'
import { css } from 'aphrodite';
import { connect } from 'react-redux'
import SVGMap from "./SVGMap"
import MetroMap from "./MetroMap"
import CategoryBox from "./CategoryBox"
import { Style } from './style.js';

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
	 * handler for zoom button
	 */
	onZoomIn(s) {
		this.svgMap.onZoomIn()
	}

	/**
	 * handler for zoom button
	 */
	onZoomOut(s) {
		this.svgMap.onZoomOut()
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
	 * update the data required for rendering
	 */
	update() {
		//get the vocabulary with category labels to display on the map
		ApiClient.instance().fetchVocublary("category", function(vocabulary) {
			if(vocabulary) {
				//get all tool nodes
				ApiClient.instance().fetchContent("tool", function(toolData) {
					if(toolData) {
						//restructure / extend the vocabulary data
						var vocabularyWithNodeRefs = ApiHelper.instance().extendVocabularyWithNodeReferences(vocabulary, toolData, "field_category");
						var hierarchicalVocabulary = ApiHelper.instance().makeVocubalaryHierarchical(vocabularyWithNodeRefs);
						console.log("hierarchy", hierarchicalVocabulary);
						this.setState({
							data: hierarchicalVocabulary
						});
					}
				}.bind(this));
			}
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
			<div>
				<div className={css(Style.container)}>
				<SVGMap ref={(elem) => { this.svgMap = elem }} width={1200} height={800} >
								<MetroMap/>
								{categoryBoxes}
				</SVGMap>
				</div>
				<button className={css(Style.button)} onClick={this.onZoomIn.bind(this)}> {"+"} </button>
				<button className={css(Style.button)} onClick={this.onZoomOut.bind(this)}> {"-"} </button>
			</div>
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
