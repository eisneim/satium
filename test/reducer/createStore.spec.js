import { expect } from 'chai'
import createStore from '../../src/reducer/createStore.js'

describe('reducer createStore', ()=> {
  function simpleReducer(state, action) {
    if(action.type === 'DO') {
      state.done = true
    }

    if(action.type === 'CHANGE_NAME') {
      state.name = action.payload
    }

    return state
  }
  
  const simpleStore = createStore(simpleReducer, {done: false, name:'eisneim'})

  it('create Store with initialState', ()=> {
    const state = simpleStore.getState()
    expect(state.done).to.be.false
    expect(state.name).to.equal('eisneim')
  })

  it('fail when no reducer provided', ()=> {
    function create() {
      createStore(null, {})
    }
    expect(create).to.throw()
  })

  it('dispatch invalid action throws', ()=> {
    function wrongDispatch() {
      simpleStore.dispatch(123)
    }

    const noType = () => simpleStore.dispatch({aa:11})

    expect(wrongDispatch).to.throw()
    expect(noType).to.throw()
  })

  it('dispatch action and calls reducer', () => {
    simpleStore.dispatch({
      type:'DO'
    })

    const nextState = simpleStore.getState()
    expect(nextState.done).to.be.true
  })


  it('subscribe to state change', () => {
    const wrongSubscribe = () => simpleStore.subscribe(123)
    expect(wrongSubscribe).to.throw()

    var prevName = simpleStore.getState().name
    var newName
    simpleStore.subscribe((newState) => {
      newName = newState.name
    })

    simpleStore.dispatch({
      type:'CHANGE_NAME', payload: 'Sasha'
    })

    expect(prevName).to.equal('eisneim')
    expect(newName).to.equal('Sasha')
  })

  it('unsubscribe form listeners', () => {
    var name
    var unSubscribe = simpleStore.subscribe((newState) => {
      name = newState.name
    })

    simpleStore.dispatch({
      type:'CHANGE_NAME', payload: 'Terry'
    })
    expect(name).to.equal('Terry')
    unSubscribe()
    simpleStore.dispatch({
      type:'CHANGE_NAME', payload: 'Joan'
    })
    expect(name).to.equal('Terry')
  })

  it('replaceReducer', () => {
    const newReducer = (state, action) => {
      if(action.type === 'CHANGE_NAME') {
        state.name = action.payload + '__'
      }
      return state
    }

    simpleStore.replaceReducer(newReducer)
    simpleStore.dispatch({
      type:'CHANGE_NAME', payload: 'Sam'
    })
    expect(simpleStore.getState().name).to.equal('Sam__')
  })

})