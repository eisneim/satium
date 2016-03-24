import { expect } from 'chai'
import createStore from '../../src/reducer/createStore.js'
import bindActionCreators from '../../src/reducer/bindActionCreator.js'

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

function setName(name) {
  return {type: 'CHANGE_NAME', payload: name }
}

function justDoIt() {
  return {type: 'DO', payload: null }
}

const simpleStore = createStore(simpleReducer, defaultState)

describe('bindActionCreators', () => {
  it('bind action one creator', () => {
    var doit = bindActionCreators(justDoIt, simpleStore.dispatch)
    doit()
    expect(simpleStore.getState().done).to.be.ture
  })

  it('bind an map of actionCreators', ()=> {
    var map = {
      justDoIt, setName
    }

    var binded = bindActionCreators(map, simpleStore.dispatch)
    binded.setName('Julia')
    expect(simpleStore.getState().name).to.equal('Julia')
  })

})