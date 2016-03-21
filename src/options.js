import {isFunction, isString, styleObjToCss, hashToClassName} from './util'

/**
 * make property of an object to be string
 * @param  {Object}   obj  ..
 * @param  {String}   prop ..
 * @param  {Function} fn   ..
 * @return {void}        ..
 */
function normalize(obj, prop, fn) {
  let val = obj[prop]
  if(val && !isString(val)) {
    obj[prop] = fn(val)
  }
}

export default {
  /**
   * Processes all created VNodes
   * @param  {Object} n A newly-created VNode to normalize/process
   * @return {void}   ..
   */
  vnode(n) {
    let attrs = n.attributes
    if(!attrs || isFunction(n.nodeName)) return
    // change it to class
    let c = attrs.className
    if(c) {
      attrs['class'] = typeof c === 'string' ? c : hashToClassName(c)
      attrs.className = undefined
    }

    // TODO: side effects, should be more functional
    if(attrs.style) normalize(attrs, 'style', styleObjToCss)
  }
}