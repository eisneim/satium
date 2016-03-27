import { hook } from './hooks';
import { extend, clone, isFunction } from './util';
// import { createLinkedState } from './linked-state';
import { triggerComponentRender, renderComponent } from './vdom/component';

/**
 * Base Component class, for he ES6 Class method of creating Components
 * @param {Object} props   ..
 * @param {Object} context ..
 */
export default function Component(props= {}, context={}) {
  this._dirty = this._disableRendering = false

  this._linkedStates = {}

  this._renderCallbacks = []

  this.prevState = this.prevProps = this.prevContext = this.base = this._parentComponent = this._component = null

  this.context = context
  this.props = props

  this.state = hook(this, 'getInitialState') || {}
}

extend(Component.prototype, {
  /**
   * Update component state by copying properties from `state` to `this.state`.
   * @param {Object}   state    ..
   * @param {Function} callback ..
   */
  setState(state, callback) {
    let s = this.state
    if(!this.prevState) this.prevState = clone(s)
    extend(s, isFunction(state) ? state(s, this.props) : state)
    if(callback) this._renderCallbacks.push(callback)
    triggerComponentRender(this)
  },

  forceUpdate() {
    renderComponent(this) 
  },

  render() {
    return null
  },
})
