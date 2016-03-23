import {hook, deepHook } from '../hooks'
import {clone, isFunction} from '../util'
import options from '../options'
import {EMPTY,SYNC_RENDER, DOM_RENDER, NO_RENDER, EMPTY_BASE} from '../constants'
import {getNodeProps} from '.'
import {createComponent,collectComponent} from './component-recycler'

const debug = require('debug')('sa:vdom/component')

/**
 * Set a component's `props` (generally derived from JSX attributes).
 * @param {Object} component ..
 * @param {Object} props     ..
 * @param {Object} opts      ..
 * @param {Object} context   ..
 */
export function setComponentProps(component, props, opts=EMPTY, context) {
  // save rendering state temperarily
  let d = component._disableRendering
  // component should not be rendering when changing context and props
  component._disableRendering = true

  if(context) {
    // save previous context
    if(!component.prevContext)
      component.prevContext = clone(component.context)
    // set new context if preovided
    component.context = context
  }

  if(component.base) {
    hook(component, 'componentWillReceiveProps', props, component.context)
  }

  if(!component.prevProps) 
    component.prevProps = clone(component.props)
  component.props = props
  // set prop,context is done, restore rendering state back
  component._disableRendering = d

  if(opts.render !== false) {
    // synchoniously render
    if(opts.renderSync || options.syncComponentUpdates !== false) {
      renderComponent(component)
    } else { // async render
      triggerComponentRender(component)
    }
  }

  // which require props.ref is a function
  hook(props,'ref', component)
}

/**
 * Render a Component, 
 * triggering necessary lifecycle events and taking High-Order Components into account.
 * @param  {Object} component ..
 * @param  {Object} opts      ..
 * @return {VNode}           ..
 */
export function renderComponent(component, opts={}) {
  if(component._disableRendering) return

  let skip,rendered
  // this is acctually the newState/newProp/newContext
  let {props, state, context} = component.state
  let prevProps = component.prevProps || props
  let prevState = component.prevState || state 
  let prevContext = component.prevContext || context
  let isUpdate = component.base // base is the domNode (or VNode )?

  // just an update operation, domNode is already there, so need update
  if(isUpdate) {
    // set currentState/Props to be prev
    component.props = prevProps
    component.state = prevState
    component.context = prevContext
    if(hook(component,'shouldComponentUpdate',props,state,context) === false) {
      skip = true
    } else {
      hook(component, 'componentWillUpdate', props,state,context)
    }
    // should update, so set new props
    component.props = props
    component.state = state
    component.context = context
  } // end of update check

  // GC, delete old state/prop/context
  component.prevProps = component.prevState = component.prevContext = null
  component._dirty = false

  // ----------- starting the render phase -------------
  if(!skip) {
    // rendered is a VNode ?
    rendered = hook(component, 'render', props, state, context)
    debug('rendered:', rendered)

    // a VNode is return by render()
    let childComponent = rendered && rendered.nodeName,
      childContext = component.getChildContext ? component.getChildContext() : context,
      toUnmount, 
      // dom node
      base

    if(isFunction(childComponent) && childComponent.prototype.render) {
      // set up higher order component link
      // !!! this is should named component._childComponent
      let instance = component._component 
      // ??? what does this mean?
      if(instance && instance.constructor !== childComponent) {
        toUnmount = instance
        instance = null
      }

      let childProps = getNodeProps(node)

      if(instance) {
        // render child 
        setComponentProps(instance, childProps,SYNC_RENDER, childContext)

        // not instance, get a new one form recycler -------------------------------
      } else { 
        instance = createComponent(childComponent, childProps, childContext)
        // save parent for reference
        instance._parentComponent = component
        // save this childComponentInstance
        component._component = instance

        // ??? why always check 'component.base' ?
        if(component.base) // should this be 'isUpdate' ??
          deepHook(instance, 'componentWillMount')
        // no render, but just to trigger "componentWillReceiveProps" for child
        setComponentProps(instance, childProps, NO_RENDER, childContext)
        // do the actual dom render check
        renderComponent(instance, DOM_RENDER)
        
        // ??? why always check 'component.base' ?
        if(component.base) 
          deepHook(instance, 'componentDidMount')

      } // end of : !instance, get a new one form recycler
      base = instance.base

    } else { 
      debug('not a function or no render method')
      // ------------ not a function or no render method ======================
      // ------------ this is a real dom node ? ------------
      let cbase = component.base
      // destroy higher order component lik
      toUnmount = component._component
      if(toUnmount) {
        cbase = component._component = null
      }
      // do virtual dom diff
      if(component.base || (opts && opts.build)) {
        // diff(dom, VNode, context)
        base = diff(cbase, rendered || EMPTY_BASE, childContext)
      }
    } // !(isFunction(childComponent) && childComponent.prototype.render)

    debug('base is:', base)
    if(component.base && base !== component.base) {
      debug('domNode is differient')
      let parent = component.base.parentNode
      debug('replace old DOMNode with newly rendered')
      // parentNode.replaceChild(newChild, oldChild);
      if(parent) parent.repaceChild(base, component.base)
    }

    if(toUnmount) {
      unmountComponent(toUnmount.base, toUnmount, true)
    }
    // save reference to new rended DOMNode
    component.base = base

    if(base) {
      let componentRef = component
        t = component
      // recursive upWards
      while((t=t._parentComponent)) {
        componentRef = t
      }
      // now we got top level component ?
      base._component = componentRef
      base._componentConstructor = componentRef.constructor
      debug('get topLevel component and save it to base?')
    }

    if(isUpdate) {
      debug('fir up componentDidUpdate')
      hook(component, 'componentDidUpdate', prevProps, prevState, prevContext)
    }

  } //end of render phase

  let cb = component._renderCallbacks, fn 

  if(cb && Array.isArray(cb)) {
    debug('invoke all _renderCallbacks of this component',cb.length)
    while((fn=cb.pop())) fn.call(component)
  }
  
  return rendered // the VNode
}


export function unmountComponent(dom, component, remove) {

}






