import diff from './vdom/diff'
import {deepHook} from './hooks'

/**
 * Render JSX into a `parent` Element.
 * @param  {VNode} vnode  ..
 * @param  {Node} parent ..
 * @param  {Node} merge  ..
 * @return {Node}        ..
 */
export default function render(vnode, parent, merge) {
  let existing =  merge && merge._component && merge._componentConstructor === vnode.nodeName,
    built = diff(merge, vnode),
    c = !existing && built._component

  if(c) deepHook(c, 'componentWillMount')

  if(built.parentNode !== parent) {
    parent.appendChild(built)
  }

  if(c) deepHook(c, 'componentDidMount')

  return built
}