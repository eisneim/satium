import { ATTR_KEY, TEXT_CONTENT, UNDEFINED_ELEMENT, EMPTY } from '../constants';
import { hasOwnProperty, toArray, empty, toLowerCase, isString, isFunction } from '../util';
import { hook, deepHook } from '../hooks';
import { isSameNodeType } from '.';
import { isFunctionalComponent, buildFunctionalComponent } from './functional-component';
import { buildComponentFromVNode } from './component';
import { appendChildren, getAccessor, setAccessor, getNodeAttributes, getNodeType } from '../dom';
import { unmountComponent } from './component';
import { createNode, collectNode } from '../dom/recycler';
const debug = require('debug')('sa:diff')

/**
 * Apply differences in attributes from a VNode to the given DOM Node.
 * @param  {Node} dom   ..
 * @param  {VNode} vnode ..
 * @return {void}       ..
 */
export function diffAttributes(dom, vnode) {
  let old = getNodeAttributes(dom) || EMPTY,
    attrs = vnode.attributes || EMPTY,
    name, value
  // removed
  for(name in old) {
    if(empty(attrs[name])) {
      setAccessor(dom, name, null)
    }
  }
  // new & updated
  if(attrs !== EMPTY) {
    for(name in attrs) {
      if(!hasOwnProperty.call(attrs, name)) continue
      value = attrs[name]
      if(!empty(name) && value != getAccessor(dom, name)) {
        setAccessor(dom, name, value)
      }
    } //end for
  }
}

/**
 * Reclaim an entire tree of nodes, starting at the root.
 * @param  {node} node        ..
 * @param  {boolean} unmountOnly ..
 * @return {void}             ..
 */
export function recollectNodeTree(node, unmountOnly) {
  debug('recollectNodeTree')
  let attrs = node[ATTR_KEY]
  if(attrs) hook(attrs, 'ref', null)

  let component = node._component
  if(component) {
    unmountComponent(node, component, !unmountOnly)
  } else { 
    debug('component not exists')
    if(!unmountOnly) {
      if(getNodeType(node) !== 1) {
        debug('not elementNode, remove it')
        let p = node.parentNode
        if(p) p.removeChild(node)
        return
      }
      debug('collect this node',node)
      collectNode(node)
    }
    let c = node.childNodes
    if(c && c.length) {
      removeOrphanedChildren(node, c, unmountOnly)
    }
  }

}

/**
 * reclaim children that were unreferenced in the desired vtree
 * @param  {Object} out         ..
 * @param  {Node} children    ..
 * @param  {Boolean} unmountOnly ..
 * @return {void}             ..
 */
export function removeOrphanedChildren(out, children, unmountOnly) {
  for(let ii = children.length; ii--; ) {
    let child = children[ii]
    if(child) recollectNodeTree(child, unmountOnly)
  }
}

/**
 * Apply child and attribute changes between a VNode and a DOM Node to the DOM. 
 * @param  {Node} dom     ..
 * @param  {VNode} vnode   ..
 * @param  {Object} context ..
 * @return {void}         ..
 */
export function innerDiffNode(dom, vnode, context) {
  let children,
    keyed,
    keyedLen,
    len = dom.childNodes.length,
    childrenLen = 0
  debug('innerDiffNode, len: %d', len)

  if(len) {
    children = []
    for(let ii = 0; ii< len; ii++) {
      let child = dom.childNodes[ii],
        props = child._component && child._component.props,
        key = props ? props.key : getAccessor(child, 'key')
      
      if(!empty(key)) {
        if(!keyed) keyed = {}
          // save keyed children
          keyed[key] = child
          keyedLen++
      } else {
        debug('empty key, save it to temp children array')
        children[childrenLen++] = child
      }
    } // end of for
  } // end of if(len)

  let vchildren = vnode.children,
    vlen = vchildren&& vchildren.length,
    min = 0
  if(vlen) {
    for(var ii=0; ii< vlen; ii++) {
      let vchild = vchildren[ii],
        child

      // attempt to find a node based on key matching
      if(keyedLen) {
        let attrs = vchild.attributes, 
          key = attrs && attrs.key
        if(!empty(key) && hasOwnProperty.call(keyed, key)) {
          debug('dom key matched vnode key:', key)
          child = keyed[key]
          keyed[key] = null
          keyedLen--
        }
      } // end of keylen

      // attemp to pluck a node of the same type from the existing children
      if(!child && min < childrenLen) {
        for(let jj= min; jj< childrenLen; jj++) {
          let c = children[jj]
          if(c&& isSameNodeType(c, vchild)) {
            children[jj] = null
            if(jj == childrenLen-1) childrenLen--
            if(jj==min) min++
            break;
          }
        }
      }// end of !child check

      // morph the matchd/found/created DOM child to match vchild(deep)
      child = diff(child, vchild, context)

      if(dom.childNodes[ii]!== child) {
        debug('keyed dom node not equal dom.childNodes[ii] ',ii)
        let c = child.parentNode !== dom && child._component,
          next = dom.childNodes[i+1]
        if(c) deepHook(c, 'componentWillMount')
        if(next) {
          dom.insertBefore(child, next)
        } else {
          dom.appendChild(child)
        }
        if(c) deepHook(c, 'componentDidMount')
      }// end of child!==

    }
  }// end of vlen

  if(keyedLen) {
    debug('keyedLen',keyedLen, 'move keyed to tmp children array')
    for(let ii in keyed) if(hasOwnProperty.call(keyed, ii) && keyed[ii]) {
      children[min=childrenLen++] = keyed[ii]
    }
  }

  // remove orphaned children
  if(min<childrenLen) {
    removeOrphanedChildren(dom, children)
  }

  diffAttributes(dom, vnode)
}
/**
 * Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 * @param  {Node} dom     ..
 * @param  {VNode} vnode   ..
 * @param  {Object} context ..
 * @return {Node}         ..
 */
export default function diff(dom, vnode, context) {
  debug('diff: ')
  let originalAttributes = vnode.attributes

  while(isFunctionalComponent(vnode)) {
    vnode = buildFunctionalComponent(vnode, context)
  }

  if(isFunction(vnode.nodeName)) {
    debug('isFunction(vnode.nodeName)')
    return buildComponentFromVNode(dom, vnode, context)
  }

  if(isString(vnode)) {
    debug('vnode isString', vnode)
    if(dom) {
      let type = getNodeType(dom)
      if(type === 3) {
        dom[TEXT_CONTENT] = vnode
        return dom
      } else if(type === 1) { // elementNode
        // recycle the dom 
        collectNode(dom)
      }
    } // end of if(dom)
    return document.createTextNode(vnode)
  }

  // Morph a DOM node to look like the given VNode. Creates DOM if it doesn't exist. 
  let out = dom,
    nodeName = vnode.nodeName || UNDEFINED_ELEMENT

  if(!dom) {
    out = createNode(nodeName)
  } else if(toLowerCase(dom.nodeName)!== nodeName) {
    out = createNode(nodeName)
    // move children into the replacement node
    appendChildren(out, toArray(dom.childNodes))
    // reclaim element nodes
    recollectNodeTree(dom)
  }

  innerDiffNode(out, vnode, context)

  if(originalAttributes && originalAttributes.ref) {
    (out[ATTR_KEY].ref = originalAttributes.ref)(out);
  }

  return out
}


