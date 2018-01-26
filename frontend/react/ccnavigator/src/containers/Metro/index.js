import React from 'react';
import ApiClient from 'client/ApiClient'
import { css } from 'aphrodite';
import { connect } from 'react-redux'
import SVGMap from "./SVGMap"
import MetroMap from "./MetroMap"
import CategoryBox from "./CategoryBox"
import { Style } from './style.js';

class Metro extends React.Component {

	//
	componentDidMount() {
		this.update();
	}

	//
	componentWillReceiveProps(nextProps) {
		if(this.props.language !== nextProps.language) {
			this.update();
		}
	}

	// a label in the map was clicked
	onLabelClicked(evt) {
		this.props.onTermClicked(evt.target.dataset.entityId);
	}

	// ask map container to zoom
	onZoomIn(s) {
		this.svgMap.onZoomIn()
	}

	// ask map container to zoom out
	onZoomOut(s) {
		this.svgMap.onZoomOut()
	}

	// update the data required for rendering
	update() {
		ApiClient.instance().fetchVocublary("category", function(data) {
			if(data) {
				var hierarchy = ApiClient.instance().getHierachyWithDetails(data);
				this.setState({
					data: hierarchy
				});
			}
		}.bind(this));
	}

	render() {
		//when the data was received from the server we can make the boxes
		if(this.state && this.state.data) {
			//TODO: move to helper, flatten all categories in the hierarchy getting the ones that are parent but not grand parent, adding a path
			var flattenTree = function(tree) {
				var isGrandParent = function(node) {
					var reducer = (a, elem) => a + elem.children.length;
					return node.children.reduce(reducer, 0) > 0;
				}
				var goDeeper = function(node, res, path) {
					if(isGrandParent(node)) {
						for(var i=0;i<node.children.length;i++) {
							goDeeper(node.children[i], res, [...path,i]);
						}
					} else {
						node.path = path.join("-");
						res.push(node);
					}
				}
				var result = [];
				for(var i=0;i<tree.length;i++) {
					goDeeper(tree[i], result, [i]);
				}
				return result;
			}

			//
			var categoryBoxes = flattenTree(this.state.data).map((cat, index) => {
				return <CategoryBox key={cat.path} data={cat} path={cat.path} />
			});

		}
		//zoom works in ie only if we edit the content of the svg when we modify the transform
		//var r = Math.round(Math.random() * 1000);
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

//when language changes we need to do stuff
const mapStateToProps = (state, ownProps) => ({
  language: state.language
})

Metro = connect(mapStateToProps)(Metro)

export default Metro;
