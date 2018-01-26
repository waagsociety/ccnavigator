import 'whatwg-fetch';
import Config from '../config/Config';
var _ = require('lodash');
var URI = require('urijs');

let instance = null;

class ApiClient {

  static instance(store) {
    if(instance) {
      return instance;
    } else if(store) {
      instance = new ApiClient(store);
      return instance;
    }
    console.log("ERROR : cannot make instance of StoreIO without store")
    return null;
  }

  constructor(store) {
    this.store = store;
    this.store.subscribe(function(a,b){
      this.onStoreChanged();
    }.bind(this));
		this.cache = {};
  }

	onStoreChanged() {
		console.log("ApiClient.onStoreChanged")
  }

	//check a response for being valid
	_checkStatus(response) {
	  if (response.status >= 200 && response.status < 300) {
	    return response
	  } else {
	    var error = new Error(response.statusText)
	    error.response = response
	    throw error
	  }
 	}

	//save user tokens of the logged in user
	_persistUser(user) {
		localStorage.setItem('drupal.user.uid', (user.current_user || {}).uid);
		localStorage.setItem('drupal.user.uuid', (user.current_user || {}).uuid);
		localStorage.setItem('drupal.user.csrf_token', user.csrf_token);
		localStorage.setItem('drupal.user.logout_token', user.logout_token);
	}

	//load user tokens if their is a user logged in
	_loadUser() {
		var user = {};
		user.uid = localStorage.getItem('drupal.user.uid');
		user.uuid = localStorage.getItem('drupal.user.uuid');
		user.csrf_token = localStorage.getItem('drupal.user.csrf_token');
		user.logout_token = localStorage.getItem('drupal.user.logout_token');
		if(user.uid && user.uuid && user.csrf_token && user.logout_token) {
				return user;
		}
		return null;
	}

	_cleanUser() {
		localStorage.removeItem('drupal.user.uid');
		localStorage.removeItem('drupal.user.uuid');
		localStorage.removeItem('drupal.user.csrf_token');
		localStorage.removeItem('drupal.user.logout_token');
	}

	_localizePath(href) {
		var lang = (this.store.getState() || {}).language;
		if(lang === null || lang === "en") {
			return href;
		}
		var uri = new URI(href);
		var dir = uri.directory();
		uri.directory(`/${lang}${dir}`)
		return uri.href();
	}

	//login
	login(user, pass, resultHandler) {
		//compose url
		var uri = new URI({
  		hostname: Config.endPoint.host,
  		path: `/user/login`,
  		query: `_format=json`
		});
    //post body
		var creds = {};
		creds["name"] = user;
		creds["pass"] = pass;
		//login
		this.fetchJSON(uri.href(), function(response){
			if(response.success) {
				var user = response.result;
				this._persistUser(user);
				if(resultHandler) {
					resultHandler(true);
				}
			} else {
				if(resultHandler) {
					resultHandler(null);
				}
			}
		}.bind(this), "POST", creds, true); //true to receive cookie
	}

	//status with drupal, resultHandler gives true or false (logged in or not)
	loginStatus(resultHandler) {
		//compose url
		var uri = new URI({
			hostname: Config.endPoint.host,
			path: `/user/login_status`,
			query: `_format=json`
		});

  	this.fetchJSON(uri.href(), function(response){
			if(response.success) {
				//if the server says we are logged in we should have user data
				if((JSON.parse(response.result) === 1)) {
					if(this._loadUser())
					{
						if(resultHandler) {
							resultHandler(true);
						}
						else {
							console.log("ERROR : user is logged in remotely but has no tokens")
							if(resultHandler) {
								resultHandler(null);
							}
						}
					}
				} else {
					if(resultHandler) {
						//not logged in
						resultHandler(false);
					}
				}
			} else {
				if(resultHandler) {
					resultHandler(null);
				}
			}
		}.bind(this), null, null, true);
	}

	//logout, return true or null (failure)
	logout(resultHandler) {
		//compose url
		var user = this._loadUser();
		var token = (user || {}).logout_token;
		if(token) {
			//compose url
			var uri = new URI({
				hostname: Config.endPoint.host,
				path: `/user/logout`,
				query: `_format=json&token=${token}`
			});

			//fetch
			this.fetchPlain(uri.href(), function(response){
				if(response.success) {
					this._cleanUser();
					if(resultHandler) {
						resultHandler(true);
					}
				} else {
					if(resultHandler) {
						resultHandler(null);
					}
				}
			}.bind(this), "POST", null, true); //WTF, moet het nu POST of GET zijn
		} else {
			//
			console.log("ERROR : no logout_token found to do proper REST logout, try /user/logout")
			if(resultHandler) {
				resultHandler(null);
			}
		}
	}

	//AJAX request to backend, expect JSON, send JSON (body), wrap into result object
	fetchJSON(uri, resultHandler, method, body, creds, allowCached) {
		var localized = this._localizePath(uri);
		if(allowCached === true) {
			var cache = this.cache[localized];
			if(cache) {
				resultHandler(cache);
				return;
			}
		}
		var opts = {
			headers: {
				"Accept" : "application/vnd.api+json",
				"Content-Type" : "application/vnd.api+json"
		  }
		}
		if(method) {
			opts["method"] = method;
		}
		if(body) {
			opts["body"] = JSON.stringify(body);
		}
		if(creds) {
			opts["credentials"] = 'include';
		}
		//fetch
		fetch(localized, opts)
		.then(this._checkStatus)
		.then(function(response) {
			return response.json()
		})
		.then(function(json) {
			var response = {
				uri: uri,
				success: true,
				error: "",
				result: json,
			}
			this.cache[localized] = response;
			resultHandler(response);
		}.bind(this))
		.catch (function(exception) {
			var response = {
				uri: uri,
				success: false,
				error: exception,
				result: null
			}
			console.log("ERROR: ", exception);
			resultHandler(response);
		})
	}

	/**
	 * request to backend, wrap into result object
	 */
	fetchPlain(uri, resultHandler, method, body, creds) {
		var opts = {};
		if(method) {
			opts["method"] = method;
		}
		if(body) {
			opts["body"] = body;
		}
		if(creds) {
			opts["credentials"] = 'include';
		}
		//fetch
		fetch(this._localizePath(uri), opts)
		.then(this._checkStatus)
		.then(function(data) {
			var response = {
				uri: uri,
				success: true,
				error: "",
				result: data,
			}
			resultHandler(response);
		})
		.catch (function(exception) {
			var response = {
				uri: uri,
				success: false,
				error: exception,
				result: null
			}
			console.log("ERROR: ", exception);
			resultHandler(response);
		})
	}

	/**
	  * request all data from drupal taxonomy vocabulary by name
		* returns JSON data object
		*/
	fetchVocublary(name, resultHandler) {
		//get a complete hierarchy of all terms
		var uri = new URI({
			hostname: Config.endPoint.host,
			path: `/jsonapi/taxonomy_term/${name}`
		});
		//
		this.fetchJSON(uri.href(), function(response){
			if(response.success) {
				var data = response.result.data || [];
				if(resultHandler) {
					resultHandler(data);
				}
			} else {
				if(resultHandler) {
					resultHandler(null);
				}
			}
		}, "GET", null, null, true);
	}

	/**
	 * fetch all tools
	 */
	fetchContent(type, resultHandler) {
		//get a complete hierarchy of all terms
		var uri = new URI({
			hostname: Config.endPoint.host,
			path: `/jsonapi/node/${type}`
		});
		//
		this.fetchJSON(uri.href(), function(response){
			if(response.success) {
				var data = response.result.data || [];
				if(resultHandler) {
					resultHandler(data);
				}
			} else {
				if(resultHandler) {
					resultHandler(null);
				}
			}
		}, "GET", null, null, true);
	}

	/**
	  * load information on logged in user
		*/
	getUser(resultHandler) {
		var user = this._loadUser();
		var uuid = (user || {}).uuid;
		if(uuid) {
			var uri = new URI({
				hostname: Config.endPoint.host,
				path: `/jsonapi/user/user/${uuid}`
			});

			this.fetchJSON(uri.href(), function(response){
				if(response.success) {
					if(resultHandler) {
						var userData = response.result.data || {};
						var prefs = (userData.attributes || {}).field_data || "{}";
						try {
							var stored = JSON.parse(prefs);
							(userData.attributes || {}).field_data = stored;
						} catch(e) {
							console.log("could not parse stored user data from server");
						}
						resultHandler(response.result);
					}
				} else {
					if(resultHandler) {
						resultHandler(null);
					}
				}
			}, "GET", null, true);
		} else {
			console.log("ERROR : could not load info on user, there is no uuid known here");
			if(resultHandler) {
				resultHandler(null);
			}
		}
	}

	/**
	  * load information on logged in user
		*/
	saveUser(data, resultHandler) {
		var user = this._loadUser();
		var uuid = (user || {}).uuid;
		if(uuid) {
			//need to insert id into data
			(data.data || {}).id = uuid;
			//need to convert preferences to string
			var obj = ((data.data || {}).attributes || {}).field_data;
			((data.data || {}).attributes || {}).field_data = JSON.stringify(obj)
			//store it
			var uri = new URI({
				hostname: Config.endPoint.host,
				path: `/jsonapi/user/user/${uuid}`
			});
			this.fetchJSON(uri.href(), function(response){
				if(response.success) {
					if(resultHandler) {
						resultHandler(true);
					}
				} else {
					if(resultHandler) {
						resultHandler(null);
					}
				}
			}, "PATCH", data, true);
		} else {
			if(resultHandler) {
				console.log("ERROR : need to have uuid to be able to save");
				resultHandler(null);
			}
		}
	}

	//get all data from a specific
	getTermDataById(id, vocabulary) {
		var data = vocabulary || [];
		return data.filter(function(entry){ return entry.id  === id})[0];
	}

	//get all content for a term like : http://127.0.0.1/jsonapi/node/tool_block?filter[field_cat.uuid][value]=ba6de7a6-b720-42a0-ae8a-737563f20398
	fetchContentWithTerm(termId, resultHandler) {
		var uri = new URI({
		  hostname: Config.endPoint.host,
		  path: `/jsonapi/node/tool`,
		  query: `filter[field_category.uuid][value]=${termId}`
		});
    //
		this.fetchJSON(uri.href(), function(response){
			if(response.success) {
				if(resultHandler) {
					resultHandler(response.result);
				}
			} else {
				if(resultHandler) {
					resultHandler(null);
				}
			}
		});
	}

	//
	fetchEntity(entityId, type, resultHandler) {
	  var uri = new URI({
			hostname: Config.endPoint.host,
			path: `/jsonapi/${type}/${entityId}`
		});
    //
		this.fetchJSON(uri.href(), function(response){
			if(response.success) {
				if(resultHandler) {
					resultHandler(response.result);
				}
			} else {
				if(resultHandler) {
					resultHandler(null);
				}
			}
		});
	}

	getFullImageURL(url) {
		var uri = new URI({
  		hostname: Config.endPoint.host,
  		path: url
		});
		return uri.href();
	}

	/**
	  * make a structured hierarchy map from drupal its raw result
		* TODO : refactor put in API Util or , subclass ApiClient??
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

	// get the hierarchy of terms in simplified format, todo: combine with getHierachy to optimize
	getHierachyWithDetails(vocabulary) {
		var tree = this.getHierachy(vocabulary || []);
		var result = [];
		var walkTree = function(tree, newTree) {
			for(var key in tree) {
				var node = this.getTermDataById(key, vocabulary);
				var simpleNode = {};
				simpleNode.name = node.attributes.name;
				simpleNode.id = node.id;
				simpleNode.weight = node.attributes.weight;
				simpleNode.cssClass = ((node.attributes.path || {}).alias || "").split("/").join(""); //make a css class from the path
				simpleNode.children = [];
				newTree.push(simpleNode);
				walkTree(tree[key], simpleNode.children);
			}
			newTree.sort(function(a,b) {
				var wA = a.weight || 0;
				var wB = b.weight || 0;
				return wA - wB;
			});
		}.bind(this);
		walkTree(tree, result);
		return result;
	}
}

export default ApiClient;
