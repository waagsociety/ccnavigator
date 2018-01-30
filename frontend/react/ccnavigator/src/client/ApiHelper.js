// entity cache??
// hash mapping uuid => data
//
var _ = require('lodash');

let instance = null;

class ApiHelper {

  static instance() {
    if(instance) {
      return instance;
    } else {
      instance = new ApiHelper();
      return instance;
    }
  }

  constructor() {
		this.cache = {};
  }

  /**
   * get one entity by its id from an array of entities
   */
	getEntityDataById(id, list) {
		var data = list || [];
		return data.filter(function(entry){ return entry.id  === id})[0];
	}

  /**
	  * make a structured hierarchy map from raw result, with entityId as reference
		*/
	getHierachy(vocabulary) {
		//use data as we received it from drupal
		var data = vocabulary || [];
		//get the parent of an item
		var getParent = function(item, allItems) {
			var parentId = ((((item.relationships || {}).parent || {}).data || [])[0] || {}).id;
			if(parentId) {
				const parentItem = allItems.filter(function(entry){ return entry.id === parentId })[0];
				return parentItem;
			}
			return null;
		};
		//recursively get parent term, recursively add current hierarchy to parent
		var getPathInHierachy = function(item, allItems, tree) {
			var t1 = {};
			t1[item.id] = tree;
			var parent = getParent(item, allItems);
			if(parent) {
				var t2 = getPathInHierachy(parent, allItems, t1);
				return t2;
			}
			return t1; //top level
		}
		//restructure the data in a hierarchical form
		var tree = {};
		for(var i=0;i<data.length;i++) {
			var item = data[i];
			//get the hierarchy of each term and merge it with those of other terms
			var hierarchyPath = getPathInHierachy(item, data, {});// || [];
			tree = _.merge({}, tree, hierarchyPath);
		}
		return tree;
	}

  /**
	  * get the terms in a hierarchy by referencing children
		*/
	makeVocubalaryHierarchical(vocabulary) {
		var tree = this.getHierachy(vocabulary || []);
		var result = [];
		var walkTree = function(tree, newTree, path) {
      var index = 0;
      for(var key in tree) {
				var node = this.getEntityDataById(key, vocabulary);
        node.children = []; //add array of references to children
        node.path = [...path,index]
        newTree.push(node);
				walkTree(tree[key], node.children, node.path);
        index += 1;
			}
			newTree.sort(function(a,b) {
        var wA = (a.attributes || {}).weight || 0;
				var wB = (b.attributes || {}).weight || 0;
				return wA - wB;
			});
		}.bind(this);
		walkTree(tree, result, []);
		return result;
	}

  /**
   *  from an array of nodes index the referenced taxonomy terms, return a mapping of taxonomy termId => array<nodeId>
   */
  getContentNodesPerTerm(nodes, termField = "field_category") {
    var mapping = nodes.reduce(function(table, node) {
      var terms = ((node.relationships || {})[termField] || {}).data || []
      for(var i=0;i<terms.length;i++) {
        var id = terms[i].id;
        var nodes = table[id] || [];
        table[id] = [...nodes, node];
      }
      return table;
    }, {});
    return mapping;
  }

  /**
   *
   */
  extendVocabularyWithNodeReferences(vocabulary, nodes, termField) {
    var table = this.getContentNodesPerTerm(nodes, termField)
    return vocabulary.map((term) => {
      term.nodes = table[term.id] || [];
      return term;
    });
  }

}

export default ApiHelper

;
