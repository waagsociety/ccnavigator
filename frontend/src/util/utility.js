import React from 'react'
import Config from 'config/Config';
const parse5 = require('parse5');
const URI = require('urijs');

/**
  * groups the items in an array like [0,1,2,3,4] with len == 2 becomes [[0,1],[2,3],[4]]
  */
export const groupBy = function(ar, len) {
  return ar.reduce(function(rv, x) {
    var current = rv.pop();
    if(current == null) {
      current = [];
    } else if(current.length === len) {
      rv.push(current); //put back
      current = [];
    }
    current.push(x)
    rv.push(current);
    return rv;
  }, []);
};

/**
  * convert a string to a abbrivated string with first letter of every word
  */
export const firstLettersString = function(string = "") {
  var words = string.split(/[^a-zA-Z0-9]+/);
  var firstLetters = words.map((word) => {
    return word.charAt(0);
  });

  return firstLetters.join("").toUpperCase();
};

/**
  * convert a string to a abbrivated string with padding, like "bla bla bla" to "  BBB  "
  */
export const abbreviateString = function(string = "") {
  var words = string.split(/[^a-zA-Z0-9]+/);
  var a = words.map((word) => {
    return word.charAt(0);
  });
  var result = new Array(string.length);
  result = result.fill(" ");
  var offset = Math.floor((string.length - a.length) / 2);
  for(var i=0;i<a.length;i++) {
    result[i+offset] = a[i];
  }
  return result.join("").toUpperCase();
};

/**
 * for text animation with space padding
 */
export const abbreviateString2 = function(string = "", transitionState) {
  if(transitionState === 1) {
    return string;
  }
  var t = transitionState * 0.95;
  var words = string.split(/[^a-zA-Z0-9]+/);
  var a = words.map((word) => { //begin letters, original position
    return [word.charAt(0), string.indexOf(word)];
  });
  var result = new Array(string.length);
  result = result.fill(" ");
  var offset = Math.floor((string.length - a.length) / 2);
  for(var i=0;i<a.length;i++) {
    var newPosition = Math.floor(((i+offset) * (1 - t)) + (t * a[i][1]))
    result[newPosition] = a[i][0];
  }
  return result.join("").toUpperCase();
};

/**
 * rebuild user formatted HTML string from CMS
 * - convert simple html (replacing <a> with <link>), limited node types supported
 * - endpoint config need for resolving relative paths from CMS
 */

export const buildJSXFromHTML = function(htmlString, endPointConfig = null) {
  console.log(htmlString)

  //
  var endPoint = endPointConfig;
  if(endPointConfig === null) {
    endPoint = Config.endPoint;
  }

  const resolveRelativePathIfRelative = function(oldPath) {
    var uri = URI(oldPath);
    if(uri.is("absolute")) {
      return oldPath;
    }
    //console.log(endPoint)
    if(endPoint !== null) {
      if(endPoint.host === null || endPoint.host === "") {
        var host = window.location.hostname;
        uri.host(host);
      } else {
        uri.host(endPoint.host);
      }
      // set port if configured
      if(endPoint.port !== null && endPoint.port !== "") {
        uri.port(endPoint.port);
      }
      /* mmm drupal puts its own endpoint in the path
      // set path to api end point if configured
      var dir = uri.directory();
      if(endPoint.path !== null && endPoint.path !== "") {
        uri.directory(`/${endPoint.path}${dir}`);
      }
      */
    }
    return uri.href();
  }

  const convertAttributes = function(attributes, mapping) {
    return attributes.reduce((result, pair) => {
      switch(pair.name) {
        case "class":
          result["className"] = pair.value;
          break;
        case "href":
          result["href"] = resolveRelativePathIfRelative(pair.value);
          break;
        case "src":
          var path = resolveRelativePathIfRelative(pair.value);
          result["src"] = path;
          break;
        // for images
        case "data-align":
          result["className"] = "align-" + pair.value;
          break;
        // for video
        case "frameborder":
          result["frameBorder"] = pair.value;
          break;
        case "allowfullscreen":
          result["allowFullScreen"] = pair.value;
          break;
        default:
          result[pair.name] = pair.value;
          break;
      }
      return result;
    }, {});
  }

  const convertNode = function(node, childs, index) {
    var attrs
    var converted = null;
    switch(node.nodeName) {
      case "#text":
        converted = node.value
        if (!converted.replace(/\s/g, '').length) {
          return null;// string only contained whitespace
        }
        break;
      case "br":
        converted = React.createElement("br", { key: index })
        break;
      case "a":
        attrs = convertAttributes(node.attrs)
        attrs["target"] = "_blank"
        attrs["key"] = index
        converted = React.createElement("a", attrs, childs)
        break;

      case "div":
        attrs = convertAttributes(node.attrs)
        attrs["key"] = index
        attrs['className'] += " childs-" + childs.length
        converted = React.createElement(node.nodeName, attrs, childs)
        break;

      case "iframe":
        const iframe = React.createElement("iframe", convertAttributes(node.attrs), childs)
        converted = React.createElement("span", { key: index, className: 'video' }, iframe)
        break;
      case "img":
        attrs = convertAttributes(node.attrs)
        attrs["key"] = `image=${index}`
        const contents = [ React.createElement("img", attrs) ]
        if(attrs["data-caption"]) { contents.push(React.createElement("figcaption", { key: `caption-${index}` }, attrs["data-caption"])) }
        converted = React.createElement("figure", { key: index }, contents)
        break;
      case "table":
      case "tr":
      case "thead":
      case "tbody":
      case "th":
      case "td":
      case "ol":
      case "ul":
      case "li":
      case "h3":
      case "p":
      case "small":
      case "span":
        // attrs = convertAttributes(node.attrs)
        // attrs["key"] = index
        converted = React.createElement(node.nodeName, {key:index}, childs)
        break;
      case "#document-fragment":
        converted = childs
        break;
      default:
        converted = React.createElement("span", {key:index}, childs)
        break;
    }
    return converted;
  }

  var ast = parse5.parseFragment(htmlString)
  //console.log(ast);
  var buildJSX = function(node, index) {
    var childs = [];
    if(node.childNodes) {
      childs = node.childNodes.map((child, index) => {
        return buildJSX(child, index);
      });
    }
    return convertNode(node, childs, index)
  }

  return buildJSX(ast);
}

export const flattenArray = function(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
  }, []);
}

export const ease = function(step, steps) {
  step = step/steps
  //step = step*step
  step = step<.5 ? 2*step*step : -1+(4-2*step)*step //easeInOutQuad
  step = step*steps
  return step
}


export const isID = function(id) {
  const idPattern = /[0-9a-f/-]{36}/g

  if(idPattern.test(id)) {
    return true
  } else {
    return false
  }
}

export function inIframe () {
  try {
      return window.self !== window.top;
  } catch (e) {
      return true;
  }
}