import assert from 'assert'
import {isPlainObject} from '../util'
/**
 * These are private action types
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 */
export var ActionTypes = {
  INIT: '@@satium/INIT'
}

export default function createStore(reducer, initialState) {
  assert(typeof reducer === 'function', 'reducer must be an function')

  var currentReducer = reducer
  var currentState = initialState
  var listeners = []
  var isDispatching = false

  /**
   * Adds a change listener, it will be called whenever state tree changes
   * @param  {Function} listener ..
   * @return {Function}          ..
   */
  function subscribe(listener) {
    assert.ok(typeof listener === 'function', 'subscribe: listener must be an function')

    listeners.push(listener)
    var isSubscribed = true

    return function unsubscribe() {
      if(!isSubscribed) return

      isSubscribed = false
      var index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  /**
   * dispatch an action to trigger state change
   * @param  {Object} action plain object with type and payload property
   * @return {Object}        the same action object
   */
  function dispatch(action) {
    assert.ok(isPlainObject(action), 
      'action must be an plain object,'+
      'use custom middleware for async actions'
    )

    assert.notEqual(typeof action.type, 
      'undefined','action must have an "type" property, have you misspelled a constant?'
    )

    assert.ok(!isDispatching, 'reducer may not dispatch actions')
    
    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    // creates an new array, and invoke each listener
    listeners.slice()
      .forEach(listener => listener(currentState))

    return action
  }

  /**
   * replace current reducer with new reducer
   * @param  {Function} nextReducer ..
   * @return {void}             
   */
  function replaceReducer(nextReducer) {
    currentReducer = nextReducer
    dispatch({ type: ActionTypes.INIT })
  }

  // when store is created, dispatch this init action, so state tree can be 
  // initialized by reducer
  dispatch({ type: ActionTypes.INIT })

  return {
    getState: () => currentState,
    dispatch,
    subscribe,
    replaceReducer,
  }
}

