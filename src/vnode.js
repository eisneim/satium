/**
 * Virtual DOM Node
 * @param {String} nodeName   ..
 * @param {Object} attributes ..
 * @param {Object} children   ..
 */
export default function VNode(nodeName, attributes, children) {
  this.nodeName = nodeName

  this.attributes = attributes

  this.children = children
}