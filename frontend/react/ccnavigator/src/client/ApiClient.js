import 'whatwg-fetch';
import Config from '../config/Config';
var URI = require('urijs');

let instance = null;

class ApiClient {

  static instance() {
    if(instance) {
      return instance;
    } else {
      instance = new ApiClient();
      return instance;
    }
  }

  constructor() {
    this.language = "en";
    this.cache = {};
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
		if(this.language === null || this.language === "en") {
			return href;
		}
		var uri = new URI(href);
		var dir = uri.directory();
		uri.directory(`/${this.language}${dir}`);
    uri.port(Config.endPoint.port);
		return uri.href();
	}

	//login
	login(user, pass, resultHandler) {
		//compose url
		var uri = new URI({
  		hostname: Config.endPoint.host,
  		path: `/user/login`,
  		query: `_format=json`,
      port: Config.endPoint.port
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
			query: `_format=json`,
      port: Config.endPoint.port
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
							console.error("user is logged in remotely but has no tokens")
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
				query: `_format=json&token=${token}`,
        port: Config.endPoint.port
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
			console.error("no logout_token found to do proper REST logout, try /user/logout")
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
    console.debug("fetch", localized);
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
			console.error(exception);
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
    var localized = this._localizePath(uri);
    console.debug("fetch", localized);
		fetch(this._localizePath(localized), opts)
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
			console.error(exception);
			resultHandler(response);
		})
	}

  /**
	 * fetch nodes/terms of a type/vocabulary
   * get array of content with node type,
   * - apply filter to
   * - limit returned fields (if specified) to reduce data amount
   * - include related items
   * like : /jsonapi/taxonomy_term/category?filter[parent.uuid][value]=6cec371d-6597-4332-a300-c6fed37b3ab0&include=parent&fields[taxonomy_term--category]=name,parent
   *
   * filter can be entity id like "6cec371d-6597-4332-a30" or property like : {"parent.uuid":"6cec371d-6597-4332-a30"}
   *
   */
	fetchContent(type, filter, fields, include, resultHandler) {

    //
    var pathParts = type.split("--");
    if(filter && typeof(filter) === "string") {
      pathParts.push(filter);
    }

    //
    var queryParts = [];
    if(filter && typeof(filter) === "object") {
      var prop = Object.keys(filter)[0];
      var val = Object.values(filter)[0];
      var filterQuery = `filter[${prop}][value]=${val}`;
      queryParts.push(filterQuery);
    }

    if(fields && fields.length > 0) {
      var fieldsQuery = `fields[${type}]=${fields.join(",")}`;
      queryParts.push(fieldsQuery);
    }

    if(include && include.length > 0) {
      var includeQuery = `include=${include.join(",")}`;
      queryParts.push(includeQuery);
    }

    //combine all
    var query = queryParts.length > 0 ? queryParts.join("&") : ""
    var uri = new URI({
			hostname: Config.endPoint.host,
			path: `/jsonapi/${pathParts.join("/")}`,
      query: query,
      port: Config.endPoint.port
		});

		//
		this.fetchJSON(uri.href(), function(response){
			if(response.success) {
				var data = response.result.data || [];
        var included = response.result.included;
				if(resultHandler) {
					resultHandler(data, included);
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
				path: `/jsonapi/user/user/${uuid}`,
        port: Config.endPoint.port
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
			console.error("could not load info on user, there is no uuid known here");
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
				path: `/jsonapi/user/user/${uuid}`,
        port: Config.endPoint.port
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
				console.error("need to have uuid to be able to save");
				resultHandler(null);
			}
		}
	}

	getFullURL(url) {
		var uri = new URI({
  		hostname: Config.endPoint.host,
  		path: url,
      port: Config.endPoint.port
		});
		return uri.href();
	}


}

export default ApiClient;
