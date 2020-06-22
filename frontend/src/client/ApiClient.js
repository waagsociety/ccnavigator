import 'whatwg-fetch';
import Config from '../config/Config';
import {flattenArray} from 'util/utility'
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

  /**
   *
   *
   */
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
    if(user.uid) {
      localStorage.setItem('drupal.user.uid', user.uid);
    }
    if(user.uuid) {
      localStorage.setItem('drupal.user.uuid', user.uuid);
    }
    if(user.csrf_token) {
      localStorage.setItem('drupal.user.csrf_token', user.csrf_token);
    }
    if(user.logout_token) {
      localStorage.setItem('drupal.user.logout_token', user.logout_token);
    }
  }

  //load user tokens if their is a user logged in
  _loadUser() {
    var user = {};
    var uid = localStorage.getItem('drupal.user.uid');
    var uuid = localStorage.getItem('drupal.user.uuid');
    var csrf_token = localStorage.getItem('drupal.user.csrf_token');
    var logout_token = localStorage.getItem('drupal.user.logout_token');
    if(uid !== "undefined") {
      user.uid = uid;
    }
    if(uuid !== "undefined") {
      user.uuid = uuid;
    }
    if(csrf_token !== "undefined") {
      user.csrf_token = csrf_token;
    }
    if(logout_token !== "undefined") {
      user.logout_token = logout_token;
    }
    return user;
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
    // set protocol if configured
    if(Config.endPoint.protocol !== null && Config.endPoint.protocol !== "") {
      uri.protocol(Config.endPoint.protocol);
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
      path: "/user/login",
      query: "_format=json",
    });
    //post body
    var creds = {};
    creds["name"] = user;
    creds["pass"] = pass;
    //login
    this.fetchJSON(uri, function(response){
      if(response.success) {
        var user = response.result;
        var store = {
          uid: (user.current_user || {}).uid,
          uuid: (user.current_user || {}).uuid,
          csrf_token: user.csrf_token,
          logout_token: user.logout_token
        }
        this._persistUser(store);
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
      console.log("fetching user status", response)
      if(response.success) {
        //if the server says we are logged in we should have user data
        if((JSON.parse(response.result) === 1)) {
          var user = this._loadUser()
          if(user.logout_token)
          {
            if(resultHandler) {
              resultHandler(true);
            }
          }
          else {
            //this can happen if we are logged in via drupal normal interface
            console.warn("user is logged in remotely but has logout token, probably logged in with drupal directly")
            if(resultHandler) {
              resultHandler(true);
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

  //logout, return true or try fallback via non REST layout
  logout(resultHandler) {
    //compose url
    var user = this._loadUser();
    if(user.logout_token) {
      //compose url
      var uri = new URI({
        path: `/user/logout`,
        query: `_format=json&token=${user.logout_token}`,
      });
      //fetch
      this.fetchPlain(uri, function(response){
        if(response.success) {
          console.log("logged out successfully");
          this._cleanUser();
          if(resultHandler) {
            resultHandler(true);
          }
        } else {
          console.error("failed logout, trying /user/logout")
          this.logout2(resultHandler) //try the other way
        }
      }.bind(this), "POST", null, true); //WTF, moet het nu POST of GET zijn
    } else {
      console.warn("no logout_token found to do proper REST logout, trying /user/logout")
      this.logout2(resultHandler)
    }
  }

  //non REST layout
  logout2(resultHandler) {
    var uri = new URI({
      path: `/user/logout`
    });
    this.fetchPlain(uri, function(response){
      if(response.success) {
        console.log("logged out successfully");
        this._cleanUser();
        if(resultHandler) {
          resultHandler(true);
        }
      } else {
        console.error("failed logout")
        if(resultHandler) {
          resultHandler(null);
        }
      }
    }.bind(this), "GET", null, true);
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
      if(method === "PATCH") {
        var user = this._loadUser();
        opts.headers["X-CSRF-Token"] = user.csrf_token || ""
      }
    }
    if(body) {
      opts["body"] = JSON.stringify(body);
    }
    if(creds) {
      opts["credentials"] = 'include';
    }
    //fetch
    console.debug("fetch", localized);
    var resp = fetch(localized, opts)
    .then(this._checkStatus)
    var payload = resp
    .then(function(r) {
      return r.json();
    })
    //split the chain of promises to keep both text and result, seems a bit to complicated
    Promise
    .all([resp, payload]).then(function(results) {
      var response = {
        uri: localized,
        redirectUri: (results[0].redirected ? results[0].url : null),
        success: true,
        error: "",
        result: results[1]
      }
      this.cache[localized] = response;
      resultHandler(response);
    }.bind(this))
    .catch (function(exception) {
      var response = {
        uri: localized,
        redirectUri: null,
        success: false,
        error: exception,
        result: null
      }
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
    var resp = fetch(localized, opts)
    .then(this._checkStatus)
    var payload = resp
    .then(function(r) {
        return r.text();
    })
    //split the chain of promises to keep both text and result, seems a bit to complicated
    Promise
    .all([resp, payload]).then(function(results) {
      var response = {
        uri: localized,
        redirectUri: (results[0].redirected ? results[0].url : null),
        success: true,
        error: "",
        result: results[1]
      }
      resultHandler(response);
    })
    .catch (function(exception) {
      var response = {
        uri: localized,
        redirectUri: null,
        success: false,
        error: exception,
        result: null
      }
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
   * filter can be entity id like:
   * "6cec371d-6597-4332-a30"
   * or property map like:
   * {"parent.uuid":"6cec371d-6597-4332-a30"}
   * or even:
   * {
   *  "field_duration.uuid": ["1ad5f89e-bb30-4dc2-9e72-03d4dbe9ec33", "72208106-699f-4a29-870a-1bd0f6d9ea1c"],
   *  "field_group_size.uuid": ["1dce75e9-929d-4071-a91e-a5d6db08d2f5"]
   * }
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
      //build query for JSONAPI
      var parts = Object.keys(filter).map((filterPath,index) => {
        var c = String.fromCharCode('a'.charCodeAt(0)+index);//a,b,c...
        var opts = filter[filterPath];
        if(typeof(opts) === "string") {
          opts = [opts];
        }
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
      queryParts = flattenArray(parts);
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
          var nextLink = next.href;
          if(!nextLink) {
            nextLink = next; //older version of JSONAPI
          }
          var nextURI = new URI(nextLink);
          var nextParams = URI.parseQuery(nextURI.query());
          nextOffset = parseInt(nextParams["page[offset]"], 10)
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
    * load information on logged in user from server, either by uuid (preferred) or by uid, get csrf_token if not yet known
    */
  getUser(resultHandler) {
    //check if the data in the field_data is sane
    var processUser = function(userData, resultHandler) {
      var prefs = (userData.attributes || {}).field_data || "{}";
      try {
        var stored = JSON.parse(prefs);
        (userData.attributes || {}).field_data = stored;
      } catch(e) {
        console.log("could not parse stored user data from server");
      }
      resultHandler(userData);
    };
    //when we have uuid and token we are fine for the rest of this session
    var user = this._loadUser();
    if(user.uuid && user.csrf_token) {
      var uri = new URI({
        path: `/jsonapi/user/user/${user.uuid}`
      });
      this.fetchJSON(uri, function(response){
        if(response.success) {
          if(resultHandler) {
            processUser(response.result.data || {}, resultHandler);
          }
        } else {
          if(resultHandler) {
            resultHandler(null);
          }
        }
      }, "GET", null, true);
    //user propably not logged in via REST, resolve uuid and csrf_token via another way, finally get user data from jsonapi
    } else {
      console.log("trying to resolve user info");
      //fetch user data in two steps
      var userUrl = new URI({
        path: `/user`
      });
      this.fetchPlain(userUrl, function(response){
        //if we are logged in we get a redirect to canonical user path
        if(response.success) {
          if(response.redirectUri) {
            var redirectUri = new URI(response.redirectUri)
            //retrieve the uid from the redirect path
            var uid = parseInt(redirectUri.filename(), 10)
            console.debug("found uid", uid)
            if(!isNaN(uid)) {
              var uri = new URI({
                path: `/jsonapi/user/user?filter[uid][value]=${uid}`
              });
              //fetch full user data
              this.fetchJSON(uri, function(response){
                if(response.success) {
                  var userData = (response.result.data || [])[0] || {}
                  this._persistUser({
                    "uid" : (userData.attributes || {}).uid,
                    "uuid" : (userData.attributes || {}).uuid
                  })
                  if(resultHandler) {
                    processUser(userData || [], resultHandler);
                  }
                } else {
                  if(resultHandler) {
                    resultHandler(null);
                  }
                }
              }.bind(this), "GET", null, true);
            } else {
              console.error("unexpected uid from response", uri)
              if(resultHandler) {
                resultHandler(null);
              }
            }
          } else {
            console.error("unexpected response from uri:", uri)
            if(resultHandler) {
              resultHandler(null);
            }
          }
        } else {
          console.error("unexpected response from uri:", uri)
          if(resultHandler) {
            resultHandler(null);
          }
        }
      }.bind(this), "GET", null, true);
      //fetch token
      var sessionUrl = new URI({
        path: `/session/token`
      });
      this.fetchPlain(sessionUrl, function(response){
        if(response.success && response.result) {
          console.log("session", response.result);
          this._persistUser({
            csrf_token : response.result
          })
        } else {
          console.error("could not get session token, user will no be able to save", response.error);
        }
      }.bind(this), "GET", null, true);
    }
  }


  /**
    * save data for logged in user
    */
  saveUser(data, resultHandler) {
    //
    var user = this._loadUser();
    if(user.uuid) {
      //need to insert id into data
      data.data = data.data || {};
      data.data.id = user.uuid;
      data.data.type = "user--user";
      //need to convert preferences to string
      var obj = ((data.data || {}).attributes || {}).field_data;
      ((data.data || {}).attributes || {}).field_data = JSON.stringify(obj)
      //store it
      var uri = new URI({
        path: `/jsonapi/user/user/${user.uuid}`,
      });
      this.fetchJSON(uri, function(response){
        if(response.success) {
          if(resultHandler) {
            resultHandler(true);
          }
        } else {
          console.error("response", response);
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
      hostname: "ccn.waag.org"
    });
    return uri.href();
  }


}

export default ApiClient;
