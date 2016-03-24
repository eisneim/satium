import {compose} from '../util'

/**
 * store enhancer, apply middleware to dispatch method
 * @param  {...Function} middlewares currying function md = ({getState,dispatch}) => next => action => {next(action)}
 * @return {Function}    store enhancer
 */
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, initialState) => {
    var store = createStore(reducer, initialState)
    var dispatch = store.dispatch
    var chain = []

    var middlewareAPI = {
      getState: store.getState,
      // we need t ocompose dispatch, so create a new function
      dispatch: action => dispatch(action),
    }
    // [fn1, fn2, fn3] becomes: [fn1(middlewareAPI), fn2(middlewareAPI), fn3(middlewareAPI)]
    chain = middlewares.map(md => md(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)
    /*
    now: fn1(middlewareAPI)(
      fn2(middlewareAPI)(
        fn3(middlewareAPI)(store.dispatch)
      )
    )

    fn1 = middlewareAPI => next => action => {
      // do something
      next(compose(...chain))
    }
    */

    // manipulated store: dispatch has been intercepted
    return {
      ...store,
      dispatch
    }
  }
}