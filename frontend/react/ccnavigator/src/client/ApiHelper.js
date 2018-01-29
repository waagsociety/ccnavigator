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
	extendVocubalaryWithHierachy(vocabulary) {
		var tree = this.getHierachy(vocabulary || []);
		var result = [];
		var walkTree = function(tree, newTree) {
			for(var key in tree) {
				var node = this.getEntityDataById(key, vocabulary);
        node.children = []; //add array of references to children
        newTree.push(node);
				walkTree(tree[key], node.children);
			}
			newTree.sort(function(a,b) {
        var wA = (a.attributes || {}).weight || 0;
				var wB = (b.attributes || {}).weight || 0;
				return wA - wB;
			});
		}.bind(this);
		walkTree(tree, result);
		return result;
	}

  /**
   *  from an array of nodes count the appearance of a taxonomy term, return a mapping of taxonomy term id => count
   */
  countContentNodesPerTerm(nodes, termField = "field_category") {
    //count the categories linked in each tool node
    var mapping = nodes.reduce(function(table, tool) {
      var terms = ((tool.relationships || {})[termField] || {}).data || []
      for(var i=0;i<terms.length;i++) {
        //raise the cnt for linked category id
        var id = terms[i].id;
        var cnt = table[id] || 0;
        table[id] = cnt + 1;
      }
      return table;
    }, {});
    return mapping;
  }

  /**
   *
   */
  extendVocabularyWithReferenceCount(vocabulary, nodes, termField) {
    var table = this.countContentNodesPerTerm(nodes, termField);
    return vocabulary.map((term) => {
      term.count = table[term.id] || 0;
      return term;
    });

  }


}

export default ApiHelper

;
