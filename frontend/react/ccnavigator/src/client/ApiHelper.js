import ApiClient from 'client/ApiClient'
import Constants from 'config/Constants'
//import {flattenArray} from 'util/utility'
var _ = require('lodash');

let instance = null;

/**
 * Higher level function that use API calls to retrieve data structures
 * ApiHelper has access to the REDUX store
 * TODO:
 * - refactor : make something like a vocabulary class, which is instantiated with a vocabulary and has functions like buildHierarchy
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
    this.store.subscribe(function(){
      this.onStoreChanged();
    }.bind(this));
    this.clearCaches();
  }

  /**
   * This should happen before connected componets receive their props
   */
  onStoreChanged() {
    var lang = this.store.getState().language;
    if(ApiClient.instance().language !== lang) {
      //console.log("APIHelper: language changed", lang);
      ApiClient.instance().language = lang;
      this.clearCaches();
    }
    //when filters are changed (diff state ???)
    //rebuild filters, after that components should update
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
    var tree = this._getHierachy(vocabulary || []); //get tree of ids
    var result = [];
    var walkTree = function(tree, newTree, path) {
      var index = 0;
      for(var key in tree) {
        var node = this._getEntityDataById(key, vocabulary); //get the object for this id
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
    walkTree(tree, result, []); //resolve all ids in the tree to objects
    return result;
  }

  /**
   * Remove end nodes in the hierarchy that have no content (for example because of filter settings).
   */
  _cleanEndNodes(tree) {
    var walkTree = function(node) {
      var newChildren = node.children.filter((child) => {
        var childHasChildren = (child.children.length !== 0);
        var childHasContent = (child.nodes.length !== 0);
        return (childHasContent || childHasChildren)
      });
      for(var i=0; i<node.children.length; i++) {
        walkTree(node.children[i]);
      }
      node.children = newChildren
    }
    for(var i=0; i<tree.length; i++) {
      walkTree(tree[i]);
    }
    return tree;
  }

  /**
   * From an array of nodes index the referenced taxonomy terms, return a mapping of taxonomy termId => array<nodeId>.
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
   * Add array of node refs to each term.
   */
  _extendVocabularyWithNodeReferences(vocabulary, nodes, termField) {
    var table = this._getContentNodesPerTerm(nodes, termField)
    return vocabulary.map((term) => {
      term.nodes = table[term.id] || [];
      return term;
    });
  }

  /**
   * Get the vocabulary named category in a hierarchical way, complete with node references, build the tree if it's not cached.
   */
  buildContentHierarchy(resultHandler) {
    //return cache if available
    if(this.cache.contentHierarchy) {
      resultHandler(this.cache.contentHierarchy);
      return;
    }
    //fetch and process the data
    this.buildFilter((filter) => {
      //console.log("f", filter);
      ApiClient.instance().fetchContentAll("taxonomy_term--category", null, ["name", "parent", "field_subtitle", "weight"], null, function(vocabulary) {
        if(vocabulary) {
          //get all tool nodes
          //var filter = {} // {"field_group_size.uuid":"1dce75e9-929d-4071-a91e-a5d6db08d2f5"}
          //filter["field_duration.uuid"] = "e81db573-9cdf-458f-930d-d5942d13b1e0";

          ApiClient.instance().fetchContentAll("node--tool", filter, ["title", "field_category"], null, function(toolData) {
            //console.log("tooldata", toolData)
            if(toolData) {
              //restructure / extend the vocabulary data
              var vocabularyWithNodeRefs = ApiHelper.instance()._extendVocabularyWithNodeReferences(vocabulary, toolData, "field_category");
              var hierarchicalVocabulary = ApiHelper.instance()._makeVocubalaryHierarchical(vocabularyWithNodeRefs);
              //var cleanHierarchicalVocabulary = ApiHelper.instance()._cleanEndNodes(hierarchicalVocabulary);
              this.cache.contentHierarchy = hierarchicalVocabulary;
              resultHandler(hierarchicalVocabulary);
            }
          }.bind(this));
        }
      }.bind(this));
    });
  }

  /**
   * Find a term or terms in the tree, build if necessary.
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
   * Find a node or nodes in the content hierarchy, build if necessary
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

  /**
   * Retrieve taxonomy_terms we use as metadata for filtering content (tools).
   * Return as simplified array of filter defintions.
   */
  getFilterDefintions(resultHandler) {
    //return cache if available
    if(this.cache.getFilterDefintions) {
      resultHandler(this.cache.getFilterDefintions);
      return;
    }
    //retrieve filters from backend
    var filterFields = Object.keys(Constants.filterFieldMapping);
    var filters = [];
    for(var i=0;i<filterFields.length;i++) {
      var resource = `taxonomy_term--${filterFields[i]}`
      ApiClient.instance().fetchContent(resource, null, null, ["vid"], 0, function(terms, vocabulary) {
        var filter = {};
        filter.name = (((vocabulary || [])[0] || {}).attributes || {}).name;
        filter.uuid = (((vocabulary || [])[0] || {}).attributes || {}).uuid;
        filter.vid = (((vocabulary || [])[0] || {}).attributes || {}).vid;
        filter.weight = (((vocabulary || [])[0] || {}).attributes || {}).weight || 0;
        filter.options = [];
        for(var i=0;i<terms.length;i++) {
          var option = {};
          option.name = ((terms[i]).attributes || {}).name;
          option.uuid = ((terms[i]).attributes || {}).uuid;
          filter.options.push(option);
        }
        filters.push(filter);
        if(filters.length === filterFields.length) {
          var sorted = filters.sort(function(a,b) {
            return a.weight - b.weight;
          });
          this.cache.getFilterDefintions = sorted;
          resultHandler(sorted);
        }
      }.bind(this));
    }
  }

  /**
   * Build a filter query based upon applied filters (in REDUX store) and filter defintions
   * Group filter settings (taxonomy_terms) that are in the same metadata field (vocabulary)
   * Like: (duration IS 2m OR 5m) AND (group_size IS 2 OR 4)
   */
  buildFilter(resultHandler) {

    this.getFilterDefintions((defs) => {
      //find which group this option is in
      var findGroup = function(uuidOption) {
        return defs.filter((group) => {
          var found = group.options.find((option) => {
            return option.uuid === uuidOption
          });
          return (found !== undefined)
        })[0];
      };
      //group the selected options by field (vocabulary)
      var state = this.store.getState();
      var applied = state.toolFiltersApplied;
      var grouped = applied.reduce(function(groups, item) {
        var group = findGroup(item);
        if(group && group.vid) {
          var filterPath = `${Constants.filterFieldMapping[group.vid]}.uuid`;
          var opts = groups[filterPath] || [];
          opts.push(item);
          groups[filterPath] = opts;
        }
        return groups
      }, {});
      //
      resultHandler(grouped);


      //build query for JSONAPI
      /*var parts = Object.keys(grouped).map((filterPath,index) => {
        var c = String.fromCharCode('a'.charCodeAt(0)+index);//a,b,c...
        var opts = grouped[filterPath];
        var parts = opts.map((value, index) => {
          var cn = c + (index + 1)
          var parts = [];
          parts.push(`filter[${cn}][condition][path]=${filterPath}`)
          parts.push(`filter[${cn}][condition][value]=${value}`)
          parts.push(`filter[${cn}][condition][memberOf]=${c}`)
          return parts;
        });
        var conjunction = `filter[${c}][group][conjunction]=OR`;
        return [conjunction, ...parts];
      });
      flattenArray(parts).join("&"));*/

      /*var query = grouped.reduce(function(queryString, item) {
        queryString +=
      }, "")
      console.log("applied f", grouped);*/

    });
  }

}

export default ApiHelper;
