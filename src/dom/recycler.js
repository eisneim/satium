import {ATTR_KEY} from '../constants'
import {memoize} from '../util'
import { ensureNodeData, getNodeType, getRawNodeAttributes} from '.'

/** DOM node pool, keyed on nodeName. */
let nodes = {}

let normalizeName = memoize(name => name.toUpperCase())

// get a node from pool or creat a new DOM node
export function createNode(nodeName) {
  let name = normalizeName(nodeName),
    // this list stores all node with same nodeName
    list = nodes[name],
    // get one at the tail of list  or create a new node
    node = list && list.pop() || document.createElement(nodeName)

  ensureNodeData(node)
  return node
}

/**
 * reset ._component, and resave node's attributes to node[ATTR_KEY]
 * @param  {Node} node ..
 * @return {void}      ..
 */
export function cleanNode(node) {
  const parent = node.parentNode
  if(parent) parent.removeChild(node)

  // 3: Node.TEXT_NODE The actual Text of Element or Attr.
  // 1: An Element node such as <p> or <div>.
  if(getNodeType(node) === 3) return

  // When reclaiming externally created nodes, seed the attribute cache
  if(!node[ATTR_KEY]) {
    // save attributes as plain hashMap object
    node[ATTR_KEY] = getRawNodeAttributes(node)
  }
  // rest component and componentConstructor
  node._component = node._componentConstructor = null
}

// gabage collection: save nodeto nodes poll, 
export function collectNode(node) {
  cleanNode(node)
  let name = normalizeName(node.nodeName),
    list = nodes[name]
  if(list) list.push(node)
  else nodes[name] = [node]
}



