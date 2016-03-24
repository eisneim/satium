import {mapValues} from '../util'
import assert from 'assert'
 
function bindActionCreator(actionCreator, dispatch) {
  return (...args) => dispatch(actionCreator(...args))
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * @param  {Function|Object} actionCreators {someAction:fn,otherAction:fn}
 * @param  {Funtion} dispatch       store.dispatch
 * @return {Function|Object}        ..
 */
export default function bindActionCreators(actionCreators, dispatch) {
  assert.ok(typeof dispatch === 'function', 'dispatch must be an function')

  if(typeof actionCreators === 'function')
    return bindActionCreator(actionCreators, dispatch)

  assert.ok(
    !(typeof actionCreators !== 'object' || 
        actionCreators === null || 
        actionCreators === undefined),
    `bindActionCreators expect an Object or a function, but received: ${actionCreators}`
  )

  return mapValues(actionCreators, ac => bindActionCreator(ac, dispatch))
}
