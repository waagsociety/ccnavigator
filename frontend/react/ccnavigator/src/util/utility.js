import React from 'react'
import { Link } from 'react-router-dom'

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
 * convert simple html (replacing <a> with <link>), limit node types supported
 * func convertNode (node, childs) => switch node.nodeName case a: convertA
 */
const parse5 = require('parse5');
export const buildJSXFromHTML = function(htmlString) {

  const convertAttributes = function(attributes, mapping) {
    return attributes.reduce((result, pair) => {
      switch(pair.name) {
        case "href":
          result["to"] = pair.value;
        default:
          result[pair.name] = pair.value;
      }
      return result;
    }, {});
  }

  const convertNode = function(node, childs) {
    var converted = null;
    switch(node.nodeName) {
      case "#text":
        converted = node.value
        break;
      case "p":
        converted = <p>{childs}</p>
        break;
      case "a":
        var attrs = convertAttributes(node.attrs)
        converted = <Link {...attrs}>{childs}</Link>
        break;
      case "li":
        converted = <li>{childs}</li>
        break;
      case "ul":
        converted = <ul>{childs}</ul>
        break;
      case "#document-fragment":
        converted = childs
        break;
      case "span":
        converted = <span>{childs}</span>
        break;
      default:
        converted = <div>{childs}</div>
        break;
    }
    return converted;
  }

  var ast = parse5.parseFragment(htmlString)
  var buildJSX = function(node) {
    var childs = [];
    if(node.childNodes) {
      childs = node.childNodes.map((child) => {
        return buildJSX(child);
      });
    }
    return convertNode(node, childs)
  }

  return buildJSX(ast);
}
