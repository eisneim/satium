import {clone, toLowerCase, isFunction, isString, hasOwnProperty} from '../util'
import {isFunctionalComponent} from './functional-component.js'
import {getNodeType} from '../dom/index'

/**
 * Check if two node's Type are equivalent.
 * @param  {Object}  node  ..
 * @param  {Object}  vnode ..
 * @return {Boolean}       ..
 */
export function isSameNodeType(node, vnode) {
  if(isFunctionalComponent(vnode)) return true

  let nodeName = vnode.nodeName
  // is an constructor
  if(isFunction(nodeName)) 
    return node._componentConstructor === nodeName

  if(getNodeType(node) === 3)
    return isString(vnode) 

  return toLowerCase(node.nodeName) === nodeName
}


/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 * @param  {VNode} vnode ..
 * @return {Object}       ..
 */
export function getNodeProps(vnode) {
  let props = clone(vnode.attributes),
    c = vnode.children,
    defaultProps = vnode.nodeName.defaultProps

  if(c) props.children = c

  if(defaultProps) {
    for(let pp in defaultProps) {
      if(hasOwnProperty.call(defaultProps, pp) && !(pp in props)) 
        props[pp] = defaultProps[pp]
    }
  }
  return props
}

