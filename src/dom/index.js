import {ATTR_KEY, EMPTY} from '../constants'
import {hasOwnProperty, memoize, falsey} from '../util'
import {optionsHook} from '../hooks'

export function ensureNodeData(node) {
  return node[ATTR_KEY] || (node[ATTR_KEY]={})
}

export function getNodeType(node) {
  return node.nodeType
}

/**
 * Append multiple children to a Node.
 * Uses a Document Fragment to batch when appending 2 or more children
 * @param  {Node} parent   ..
 * @param  {Node} children ..
 * @return {void}          ..
 */
export function appendChildren(parent, children) {
  let len = children.length,
    isMany = len > 2,
    into = isMany ? document.createDocumentFragment() : parent
  for(let ii=0; ii< len; ii++) {
    into.appendChild(children[ii])
  }
  if(isMany) parent.appendChild(into)
}

// "onClick" => "click"
const normalizeEventName = memoize(t => t.replace(/^on/i,'').toLowerCase())

/**
 * Proxy an event to hooked event handlers
 * @param  {Object} e ..
 * @return {any}   ..
 */
function eventProxy(e) {
  let fn = this._listeners[normalizeEventName(e.type)]
  if(fn) 
    return fn.call(this, optionsHook('event', e) ||e)
}

/**
 * Retrieve the value of a rendered attribute
 * @param  {Object} node  ..
 * @param  {String} name  ..
 * @param  {Object} value ..
 * @param  {Boolean} cache ..
 * @return {Object}       ..
 */
export function getAccessor(node, name, value, cache) {
  if(name!=='type' && name!=='style' && name in node) 
    return node[name]

  let attrs = node[ATTR_KEY]
  if(cache!==false && attrs && hasOwnProperty.call(attrs, name))
    return attrs[name]
  if(name === 'style') return node.style.cssText
  if(name ==='class') return node.className

  return value
}

/**
 * Set a named attribute on the given Node, 
 * with special behavior for some names and event handlers.
 * If `value` is `null`, the attribute/handler will be removed.
 * @param {Node} node  ..
 * @param {String} name  ..
 * @param {any} value ..
 */
export function setAccessor(node, name, value) {
  if(name === 'class') {
    node.className = value || ''
  } else if(name === 'style') {
    node.style.cssText = value || ''
  } else if(name ==='dangerouslySetInnerHTML') {
    if(value && value.__html) node.innerHTML = value.__html
  }else if(name ==='key' || (name in node && name!=='type')) {
    node[name] = value
    if(falsey(value)) node.removeAttribute(name)
  } else {
    setComplexAccessor(node,name,value)
  }
  // TOCHECK
  ensureNodeData(node)[name] = value
  // console.log('ensureNodeData:', name, typeof value)
}

/**
 * For props without explicit behavior, apply to a Node as event handlers or attributes.
 * @param {Object} node  ..
 * @param {String} name  ..
 * @param {Object} value ..
 */
export function setComplexAccessor(node,name,value) {
  // event handlers
  if(name.substring(0,2) === 'on') {
    let eventname = normalizeEventName(name),
      l = node._listeners || (node._listeners = {}),
      // if not xx listener, add it; if exists and no value provided, remove it
      fn = !l[eventname] ? 'add' : (!value ? 'remove' : null)

    if(fn) 
      node[fn+'EventListener'](eventname, eventProxy) // maybey eventProxy.bind(node) ?
    // save this handler to ._listeners
    l[eventname] = value
    return 
  }

  let type = typeof value
  if(falsey(value)){
    node.removeAttribute(name)
  } else if(type !=='function' && type!== 'object') {
    node.setAttribute(name, value)
  }
}

//developer.mozilla.org/en-US/docs/Web/API/Attr.html
export function getNodeAttributes(node) {
  return node[ATTR_KEY] || getRawNodeAttributes(node) || EMPTY
}
/**
 * Get a node's attributes as a hashmap, regardless of type.
 * @param  {Node} node ..
 * @return {Object}      ..
 */
export function getRawNodeAttributes(node) {
  let list = node.attributes 
  //developer.mozilla.org/en-US/docs/Web/API/Attr.html
  if(!list || !list.getNamedItem) return list
  return getAttributesAsObject(list)
}
/**
 * Convert a DOM `.attributes` NamedNodeMap to a hashmap.
 * @param  {Object} list ..
 * @return {Object}      ..
 */
function getAttributesAsObject(list) {
  let attrs = {}
  for(let ii = list.length; ii--; ) {
    let item = list[ii]
    attrs[item.name] = item.value
  }
  return attrs
}


