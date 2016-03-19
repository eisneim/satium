import { NON_DIMENSION_PROPS } from './constants'

/**
 * Safe reference to builtin hasOwnProperty
 * @type {Function}
 */
export const hasOwnProperty = {}.hasOwnProperty

/**
 * copy own property from props to obj
 * @param  {object} obj   ..
 * @param  {object} props ..
 * @return {object}       ..
 */
export function extend(obj, props) {
  Object.keys(props).forEach(p => {
    if (hasOwnProperty.call(props, p)) {
      obj[p] = props[p]
    }
  })
  return obj
}

/**
 * Fast clone. Note: does not filter out non-own properties.
 * @param  {object} obj ..
 * @return {object}     ..
 */
export function clone(obj) {
  let out = {}
  Object.keys(obj).forEach(p => { out[p] = obj[p] })
  return out
}

/**
 * Create a caching wrapper for the given function
 * @param  {Function} fn  ..
 * @param  {Object}   mem ..
 * @return {any}       ..
 */
export function memoize(fn, mem) {
  mem = mem || {}
  // return a closour so the returned value of the function will be stored
  return param => hasOwnProperty.call(mem, param) ? mem[param] : (mem[param] = fn(param))
}

/**
 * Get a deep property value from the given object, expressed in dot-notation.
 * var obj = {a:{b:true}}  delve(obj,'a.b') === true
 * @param  {Object} obj ..
 * @param  {Object} key ..
 * @return {Object}     ..
 */
export function delve(obj, key) {
  for (let props = key.split('.'), ii = 0; ii < props.length && obj; ii++) {
    // console.log(obj, props[ii])
    obj = obj[props[ii]]
  }
  // console.log('finnal',obj)
  return obj
}

/**
 * Convert an Array-like object to an Array
 * @param  {Object} obj ..
 * @return {Array}     ..
 */
export function toArray(obj) {
  var arr = [], ii = obj.length
  while (ii--) arr[ii] = obj[ii]
  return arr
}

/**
 * is the given object a Function?
 * @param  {Object}  obj ..
 * @return {Boolean}     ..
 */
export function isFunction(obj) {
  return typeof obj === 'function'
}

/**
 * is the given object a String?
 * @param  {Object} obj ..
 * @return {Boolean}     ..
 */
export const isString = obj => 'string' === typeof obj

/* eslint-disable eqeqeq */
export const empty = x => x == null
/**
 * Check if a value is `null`, `undefined`, or explicitly `false`.
 * @param  {object} value ..
 * @return {boolean}       ..
 */
export const falsey = value => value === false || value === null

/**
 * Convert a JavaScript camel-case CSS property name to a CSS property name
 * @param  {String} s ..
 * @return {String}   ..
 */
export const jsToCss = memoize(s => s.replace(/([A-Z])/g, '-$1').toLowerCase())

/**
 * Convert a hashmap of styles to CSSText
 * @param  {Object} style ..
 * @return {String}       ..
 */
export function styleObjToCss(style = {}) {
  var str = ''
  for (let prop in style) {
    if (!hasOwnProperty.call(style, prop)) continue

    let val = style[prop]
    if (!empty(val)) {
      str += jsToCss(prop)
      str += ': '
      str += val
      if (typeof val === 'number' && !NON_DIMENSION_PROPS[prop]) {
        str += 'px'
      }
      str += '; '
    }
  }// end of for in
  return str
}

/**
 * Convert a hashmap of CSS classes to a space-delimited className string
 * hashToClassName({aClass:1, bClass: false, dd: true}) => 'aClass dd'
 * @param  {Objet} obj ..
 * @return {String}     ..
 */
export function hashToClassName(obj) {
  var str = ''
  for (let prop in obj) {
    if (obj[prop]) {
      if (str) str += ' '
      str += prop
    }
  }
  return str
}

/**
 * Just a memoized String.prototype.toLowerCase
 * @param  {String} s ..
 * @return {String}   ..
 */
export const toLowerCase = memoize(s => s.toLowerCase())

// For animations, rAF is vastly superior. However, it scores poorly on benchmarks :(
// export const setImmediate = typeof requestAnimationFrame==='function' ? requestAnimationFrame : setTimeout;

/* eslint-disable no-empty */
let ch
try {
  ch = new MessageChannel()
} catch (e) {}

/**
 * Call a function asynchronously, as soon as possible.
 * @param  {Function} f ..
 * @return {Function}   ..
 */
export const setImmediate = ch ? f => {
  ch.port1.onmessage = f
  ch.port2.postMessage('')
} : setTimeout


