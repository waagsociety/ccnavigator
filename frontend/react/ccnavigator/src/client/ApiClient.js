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

  _localizePath(uri) {
    // current host if host not configured
    if(Config.endPoint.host === null || Config.endPoint.host === "") {
      var host = window.location.hostname;
      uri.host(host);
    } else {
      uri.host(Config.endPoint.host);
    }
    // set port if configured
    if(Config.endPoint.port !== null && Config.endPoint.port !== "") {
      uri.port(Config.endPoint.port);
    }
    // localize the path if not default lang
    var dir = uri.directory();
    if(this.language !== null && this.language !== "en") {
      uri.directory(`/${this.language}${dir}`);
    }
    // set path to api end point if configured
    dir = uri.directory();
    if(Config.endPoint.path !== null && Config.endPoint.path !== "") {
      uri.directory(`/${Config.endPoint.path}${dir}`);
    }
    return uri.href();
  }

  //login
  login(user, pass, resultHandler) {
    //compose url
    var uri = new URI({
      path: `/user/login`,
      query: `_format=json`,
    });
    //post body
    var creds = {};
    creds["name"] = user;
    creds["pass"] = pass;
    //login
    this.fetchJSON(uri, function(response){
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
      path: `/user/login_status`,
      query: `_format=json`,
    });

    this.fetchJSON(uri, function(response){
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
        path: `/user/logout`,
        query: `_format=json&token=${token}`,
      });

      //fetch
      this.fetchPlain(uri, function(response){
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
        uri: localized,
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
    fetch(localized, opts)
    .then(this._checkStatus)
    .then(function(data) {
      var response = {
        uri: localized,
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
   * fetch all the content of a specific content, page by page till there is no more
   *
   */
  fetchContentAll(type, filter, fields, include, resultHandler) {
    //
    var allData = [];
    //var allIncluded = [];

    //call the result handler when no more pages
    function fetchMoreContent(type, filter, fields, include, offset, resultHandler) {
      ApiClient.instance().fetchContent(type, filter, fields, include, offset, function(content, included, nextOffset) {
        allData = allData.concat(content)
        if(nextOffset) {
          fetchMoreContent(type, filter, fields, include, nextOffset, resultHandler)
        } else {
          //TODO: also all included content
          resultHandler(allData);
        }
      });
    }

    //start with offset 0
    fetchMoreContent(type, filter, fields, include, 0, resultHandler);
  }

  /**
   * fetch nodes/terms of a type/vocabulary
   * get array of content by type
   * - apply filter
   * - limit returned fields (if specified) to reduce data amount
   * - include related items
   * like : /jsonapi/taxonomy_term/category?filter[parent.uuid][value]=6cec371d-6597-4332-a300-c6fed37b3ab0&include=parent&fields[taxonomy_term--category]=name,parent
   *
   * filter can be entity id like "6cec371d-6597-4332-a30" or property like : {"parent.uuid":"6cec371d-6597-4332-a30"}
   *
   * resultHandler function arguments: data, included, offset for more pages of data
   *
   */
  fetchContent(type, filter, fields, include, offset, resultHandler) {

    //
    var pathParts = type.split("--");
    if(filter && typeof(filter) === "string") {
      pathParts.push(filter);
    }

    //filter content by property
    var queryParts = [];
    if(filter && typeof(filter) === "object") {
      var prop = Object.keys(filter)[0];
      var val = Object.values(filter)[0];
      var filterQuery = `filter[${prop}][value]=${val}`;
      queryParts.push(filterQuery);
    }

    //get specific fields only
    if(fields && fields.length > 0) {
      var fieldsQuery = `fields[${type}]=${fields.join(",")}`;
      queryParts.push(fieldsQuery);
    }

    //include related entities
    if(include && include.length > 0) {
      var includeQuery = `include=${include.join(",")}`;
      queryParts.push(includeQuery);
    }

    //offset for pagination
    if(offset !== null) {
      var offsetQuery = `page[offset]=${offset}`;
      queryParts.push(offsetQuery);
    }

    //combine all
    var query = queryParts.length > 0 ? queryParts.join("&") : ""
    var uri = new URI({
      path: `/jsonapi/${pathParts.join("/")}`,
      query: query
    });

    //
    this.fetchJSON(uri, function(response){
      if(response.success) {
        var data = response.result.data || [];
        var included = response.result.included;
        var next = (response.result.links || {}).next;
        var nextOffset = null;

        //check if there is more and parse to find offset
        if(next) {
          var nextURI = new URI(next);
          var nextParams = URI.parseQuery(nextURI.query());
          nextOffset = parseInt(nextParams["page[offset]"], 10)
          //console.log("uri", uri)
          //console.log("next", next)
        }

        if(resultHandler) {
          resultHandler(data, included, nextOffset);
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
        path: `/jsonapi/user/user/${uuid}`
      });

      this.fetchJSON(uri, function(response){
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
        path: `/jsonapi/user/user/${uuid}`,
      });
      this.fetchJSON(uri, function(response){
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
      path: url,
    });
    return uri.href();
  }


}

export default ApiClient;
