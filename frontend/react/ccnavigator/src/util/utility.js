import React from 'react'
import { Link } from 'react-router-dom'
const parse5 = require('parse5');

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
 * convert simple html (replacing <a> with <link>), limit node types supported
 */

export const buildJSXFromHTML = function(htmlString) {

  const convertAttributes = function(attributes, mapping) {
    return attributes.reduce((result, pair) => {
      switch(pair.name) {
        case "href":
          result["to"] = pair.value;
          break;
        default:
          result[pair.name] = pair.value;
          break;
      }
      return result;
    }, {});
  }

  const convertNode = function(node, childs, index) {
    var converted = null;
    switch(node.nodeName) {
      case "#text":
        converted = node.value
        break;
      case "a":
        var attrs = convertAttributes(node.attrs)
        attrs["key"] = index;
        converted = React.createElement(Link, attrs, childs);
        break;
      case "li":
      case "p":
      case "ul":
      case "span":
        converted = React.createElement(node.nodeName, {key:index}, childs);
        break;
      case "#document-fragment":
        converted = childs
        break;
      default:
        converted = React.createElement("span", {key:index}, childs);
        break;
    }
    return converted;
  }

  var ast = parse5.parseFragment(htmlString)
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
