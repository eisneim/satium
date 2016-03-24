import { expect } from 'chai'
import createStore from '../../src/reducer/createStore.js'
import applyMiddleware from '../../src/reducer/applyMiddleware.js'

function simpleReducer(state, action) {

  switch(action.type) {
    case 'DO': state.done = true
    break;
    case 'CHANGE_NAME': state.name = action.payload
    break;
    case 'ORDER_TEST': state.order = action.payload
    break;
  }

  return state
}

var defaultState = {done: false, name:'eisneim'}

const md1 = (getState,dispatch) => next1 => action => {
  console.log('start md1')
  if(action.type === 'ORDER_TEST') action.payload.push('md1')
  next1(action)
  console.log('end md1')
}

const md2 = (getState,dispatch) => next2 => action => {
  console.log('start md2')
  if(action.type === 'ORDER_TEST') action.payload.push('md2')
  next2(action)
  console.log('end md2')
}

const md3 = (getState,dispatch) => next3 => action => {
  console.log('start md3')
  if(action.type === 'ORDER_TEST') action.payload.push('md3')
  next3(action)
  console.log('end md3')
}



describe('createStore with middleware', () => {

  it('md chain, left to right execution order',() => {
    const createStoreWithMd = applyMiddleware(md1,md2,md3)(createStore)
    const simpleStore = createStoreWithMd(simpleReducer, defaultState)

    simpleStore.dispatch({
      type:'ORDER_TEST', payload: []
    })

    const nextState = simpleStore.getState()
    expect(nextState.order).to.deep.equal(['md1','md2','md3'])
  })

})