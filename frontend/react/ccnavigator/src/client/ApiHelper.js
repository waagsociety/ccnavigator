import ApiClient from 'client/ApiClient'
var _ = require('lodash');

let instance = null;

/**
TODO:
- refactor : make something like a vocabulary class, which is instantiated with a vocabulary and has functions like buildHierarchy
*/

class ApiHelper {

  static instance(store) {
    if(instance) {
      return instance;
    } else if(store) {
      instance = new ApiHelper(store);
      return instance;
    }
    console.error("cannot make instance of StoreIO without store")
    return null;
  }

  constructor(store) {
    this.store = store;
    this.store.subscribe(function(a,b){
      this.onStoreChanged();
    }.bind(this));
    this.clearCaches();
  }

  onStoreChanged() {
    var lang = this.store.getState().language;
    if(ApiClient.instance().language !== lang) {
      console.log("APIHelper: language changed", lang);
      ApiClient.instance().language = lang;
      this.clearCaches();
    }
  }

  clearCaches() {
    this.cache = {};
  }

  /**
   * get one entity by its id from an array of entities
   */
  _getEntityDataById(id, list) {
    var data = list || [];
    return data.filter(function(entry){ return entry.id  === id})[0];
  }

  /**
    * make a structured simple hierarchy map from raw vocabulary result, with entityId as reference to to term
    */
  _getHierachy(vocabulary) {
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
    * convert the structure of a flat vocabulary of terms into a hierarchy by referencing children, order by weight
    */
  _makeVocubalaryHierarchical(vocabulary) {
    var tree = this._getHierachy(vocabulary || []);
    var result = [];
    var walkTree = function(tree, newTree, path) {
      var index = 0;
      for(var key in tree) {
        var node = this._getEntityDataById(key, vocabulary);
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
   * from an array of nodes index the referenced taxonomy terms, return a mapping of taxonomy termId => array<nodeId>
   */
  _getContentNodesPerTerm(nodes, termField = "field_category") {
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
   * add array of node refs to each term
   */
  _extendVocabularyWithNodeReferences(vocabulary, nodes, termField) {
    var table = this._getContentNodesPerTerm(nodes, termField)
    return vocabulary.map((term) => {
      term.nodes = table[term.id] || [];
      return term;
    });
  }

  /**
   * get the vocabulary named category in a hierarchical way, complete with node references, build the tree if it's not cached
   */
  buildContentHierarchy(resultHandler) {
    //console.log("buildContentHierarchy")
    //return cache if available
    if(this.cache.contentHierarchy) {
      resultHandler(this.cache.contentHierarchy);
      return;
    }
    //fetch and process the data
    ApiClient.instance().fetchContentAll("taxonomy_term--category", null, ["name", "parent", "field_subtitle"], null, function(vocabulary) {
      if(vocabulary) {
        //get all tool nodes
        ApiClient.instance().fetchContentAll("node--tool", null, ["title", "field_category"], null, function(toolData) {
          //console.log("tooldata", toolData)
          if(toolData) {
            //restructure / extend the vocabulary data
            var vocabularyWithNodeRefs = ApiHelper.instance()._extendVocabularyWithNodeReferences(vocabulary, toolData, "field_category");
            var hierarchicalVocabulary = ApiHelper.instance()._makeVocubalaryHierarchical(vocabularyWithNodeRefs);
            this.cache.contentHierarchy = hierarchicalVocabulary;
            resultHandler(hierarchicalVocabulary);
          }
        }.bind(this));
      }
    }.bind(this));
  }

  /**
   * find a term or terms in the tree
   */
  findTermInContentHierarchy(entityIds, resultHandler) {
    //recursively walkHierarchy
    var walkHierarchy = function(terms, search) {
      var found = null;
      for(var i=0;i<terms.length;i++) {
        //find here
        if(terms[i].id === search) {
          return terms[i];
        }
        //find deeper
        found = walkHierarchy(terms[i].children, search);
        if(found) {
          return found;
        }
      }
      return null;
    }
    //
    this.buildContentHierarchy(function(hierarchy){
      var result = null;
      if(Array.isArray(entityIds)) {
        result = entityIds.map((id) => {
          return walkHierarchy(hierarchy, id);
        });
        result = result.filter(function(t){ return t !== null });
      } else {
        result = walkHierarchy(hierarchy, entityIds);
      }
      resultHandler(result);
    });
  }

  /**
   * find a node in the content hierarchy
   */
  findNodeInContentHierarchy(entityIds, resultHandler) {
    //recursively walkHierarchy
    var walkHierarchy = function(terms, search) {
      var found = null;
      for(var i=0;i<terms.length;i++) {
        var nodes = terms[i].nodes || []
        //find here
        found = nodes.filter((node) => { return (node.id === search) })[0]
        if(found) {
          return found;
        }
        //find deeper
        found = walkHierarchy(terms[i].children, search);
        if(found) {
          return found;
        }
      }
      return null;
    }
    //
    this.buildContentHierarchy(function(hierarchy){
      var result = null;
      if(Array.isArray(entityIds)) {
        result = entityIds.map((id) => {
          return walkHierarchy(hierarchy, id);
        });
        result = result.filter(function(n){ return n !== null });
      } else {
        result = walkHierarchy(hierarchy, entityIds);
      }
      resultHandler(result);
    });
  }

}

export default ApiHelper;
