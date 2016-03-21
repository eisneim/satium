import options from './options'

/**
 * Invoke a "hook" method with arguments if it exists.
 * @param  {Object}    obj  ..
 * @param  {string}    name ..
 * @param  {args} args ..
 * @return {any}         ..
 */
export function hook(obj, name, ...args) {
  let fn = obj[name]
  if(fn && typeof fn === 'function') 
    return fn.call(obj, ...args)
}

/**
 * recursively Invoke hook() on a component and child components
 * @param  {Object} obj  ..
 * @param  {String} name ..
 * @return {Void}      ..
 */
export function deepHook(obj, name, ...args) {
  do {
    hook(obj, name, ...args)
  } while((obj = obj._component)) // reAssign itself to achive recursive
}
/**
 * Invoke a hook on the `options` export.
 * optionsObject is : { vnode(n){} }
 * @param  {args} args ..
 * @return {any}         ..
 */
export function optionsHook(...args) {
  return hook(options, ...args)
}