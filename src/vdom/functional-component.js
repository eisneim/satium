import {EMPTY_BASE} from '../constants'
import {getNodeProps} from '.'
import {isFunction} from '../util'

/**
 * Check if a VNode is a reference to a stateless functional component.
 *  A function component is represented as a VNode 
 *  whose `nodeName` property is a reference to a function.
 *  If that function is not a Component (ie, has no `.render()` method on a prototype), 
 *  it is considered a stateless functional component.
 * @param  {VNode}  options.nodeName ..
 * @return {Boolean}                  ..
 */
export function isFunctionalComponent({nodeName}) {
  // a stateless function don't have a render property
  return isFunction(nodeName) && !nodeName.prototype.render  
}

/**
 * Construct a resultant VNode from a VNode referencing a stateless functional component.
 * @param  {VNode} vnode   A VNode with a `nodeName` property that is a reference to a function.
 * @param  {Object} context ..
 * @return {node}         ..
 */
export function buildFunctionalComponent(vnode, context) {
  return vnode.nodeName(getNodeProps(vnode), context) || EMPTY_BASE
}
