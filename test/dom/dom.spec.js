import { expect } from 'chai'
import * as domUtil from '../../src/dom'

describe('domUtils', () => {
  var $container 
  beforeEach(()=> {
    $container = document.createElement('div')
    document.body.appendChild($container)
  })

  afterEach(()=> {
    document.body.removeChild($container)
  })

  it('appendChildren', ()=> {
    var node1 = document.createElement('span')
    var node2 = document.createElement('div')
    var node3 = document.createElement('h1')
    const children = [node1, node2, node3]
    
    domUtil.appendChildren($container, children)
    expect($container.childNodes).to.have.length(3)
  })

  describe('getAccessor', ()=> {
    var node = document.createElement('div')
    node.setAttribute('id','testId')
    node.setAttribute('class','testClass')
    node.style.minWidth = 25+'px'

    it('get direct preperty', () => {
      node.vv = 'vv'
      expect(domUtil.getAccessor(node,'vv')).to.equal('vv')
    })

    it('get style and class', ()=> {
      expect(domUtil.getAccessor(node,'class')).to.equal('testClass')
      // console.log(domUtil.getAccessor(node,'style'))
      expect(domUtil.getAccessor(node,'style')).to.equal('min-width: 25px;')
    })

    it('return default value if not match', ()=> {
      expect(domUtil.getAccessor(node,'noting', 11)).to.equal(11)
    })
  })

  describe('setAccessor', ()=> {
    var node = document.createElement('div')
    it('deal with class and style', ()=> {
      domUtil.setAccessor(node, 'class', 'goodClass')
      domUtil.setAccessor(node, 'style', 'height:25px;width:3px')

      expect(node.className).to.equal('goodClass')
      expect(node.style.cssText).to.equal('height: 25px; width: 3px;')
    })

    it('handle dangerouslySetInnerHTML', ()=> {
      domUtil.setAccessor(node, 'dangerouslySetInnerHTML', {__html:"<sapn>good</span>"})
      expect(node.childNodes).to.have.length(1)
    })
  })

  describe('setComplexAccessor', ()=> {
    var node = document.createElement('div')
    it('handleEventListeners', ()=> {
      var count = 0
      domUtil.setComplexAccessor(node,'onClick', e => {count+=1})
      node.click()
      expect(node._listeners).to.have.property('click')
      expect(count).to.equal(1)
    })


  })

  // it('eventProxy', ()=> {

  // })

  // it('getNodeAttributes', ()=> {

  // })

  // it('getRawNodeAttributes', ()=> {

  // })

  // it('getAttributesAsObject', ()=> {

  // })

})