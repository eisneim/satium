import { expect } from 'chai'
import {hook, deepHook,optionsHook} from '../src/hooks'
import {toArray} from '../src/util'

describe('hooks', () => {

  it('should invoke method with arguments', () => {
    var target = {
      fn() {
        return toArray(arguments)
      },
    }

    const result = hook(target, 'fn', 'a',1, a=> a+1 )

    expect(result).to.be.an('array')
    expect(result).to.have.length(3)
    expect(result[2]).to.be.an('function')
  })

  it('deepHook should work', ()=> {
    var count = 0
    var target = {
      doStuff: number => count+= number ,
      _component: {
        doStuff: number => count+= number ,
        _component: {
          doStuff: number => count+= number ,
        }
      }
    }

    deepHook(target, 'doStuff', 2)
    expect(count).to.equal(6)
  })

  it('optionsHook', () => {
    var node = {
      nodeName: 'div',
      attributes: {a: 1, style:{
        minWidth: 25,
      },className:{
        clearfix: 1
      }},
    }
    optionsHook('vnode',node)
    expect(node.attributes.style).to.be.an('string')
    expect(node.attributes.class).to.equal('clearfix')
  })

})
