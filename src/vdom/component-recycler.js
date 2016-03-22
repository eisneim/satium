/**
 * Retains a pool of Components for re-use, keyed on component name.
 * Note: since component names are not unique or even necessarily available, 
 * these are primarily a form of sharding.
 * @type {Object}
 */
const components = {}

export function collectComponent(component) {
  let name = component.constructor.name,
    list = components[name]
  if(list) list.push(component)
  else components[name] = [component]
}

export function createComponent(ctor, props, context) {
  let list = components[ctor.name],
    len = list && list.length,
    c
    
  for(let ii=0; ii<len; ii++) {
    c = list[ii]
    // have same constructor
    if(c.constructor === ctor) {
      list.splice(ii, 1) // remove it from list
      return c
    }
  }  
  return new ctor(props, context)
}