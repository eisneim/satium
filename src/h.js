import VNode from './vnode'
import { falsey } from './util'
import {optionsHook} from './hooks'

// just an optimization, not to create new array for vdom
const SHARED_TEMP_ARRAY = []

export default function h(nodeName, attributes) {
  let len = arguments.length,
    children, arr, isPreviousPlain
  if (len > 2) {
    children = []
    for (let ii = 2; ii < len; ii++) {
      let arg = arguments[ii]
      // console.log(ii, arg)
      if (falsey(arg)) continue

      // handle arry of children
      if (Array.isArray(arg)) {
        arr = arg
      } else {
        // just an optimization
        arr = SHARED_TEMP_ARRAY
        arr[0] = arg
      }

      for (let jj = 0; jj < arr.length; jj++) {
        let child = arr[jj],
          // this is a simple child not VNode, Not Dom
          // child should not be function
          isPlainTarget = !falsey(child) && !(child instanceof VNode)
        //  make is as a string, : string,array,object,boolean,
        if (isPlainTarget)
          child = String(child)

        if (isPlainTarget && isPreviousPlain) {
          // optimization: merge adjacent text children:
          // [a,b, string, string, c,d] => [a,b, string+string, c,d]
          children[children.length - 1] += child
        } else if (!falsey(child)) {
          // add to children array
          children.push(child)
        }
        isPreviousPlain = isPlainTarget
      }// end of jj for loop
    } // end of ii for loop
  }// end of if check

  if (attributes && attributes.children) {
    // delete might be slow...
    // delete attributes.children
    attributes.children = undefined
  }
  let node = new VNode(nodeName, attributes || undefined, children || undefined)
  // convert attr.style, attr.className from object to string
  optionsHook('vnode', node)
  return node
}

/* a vnode should be like:
{
  nodeName: "div",
  attributes: {
    "id": "foo"
  },
  children: ["Hello!"]
}
 */

export function simpleRender(vnode) {
  // string to textnode
  if (vnode.split) return document.createTextNode(vnode)

  // create DOM element
  let n = document.createElment(vnode.nodeName)

  let attr = vnode.attributes || {}
  Object.keys(attr).forEach(k => n.setAttribute(k, attr[k]));

  (vnode.children || []).forEach(c => n.appendChild(render(c)))

  return n
}