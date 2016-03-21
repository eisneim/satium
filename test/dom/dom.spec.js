import { expect } from 'chai'
import * as domUtil from '../../src/dom'

describe('domUtils', () => {
  var $container 

  it('appendChildren', ()=> {
    $container = document.createElement('div')
    document.body.appendChild($container)

    var node1 = document.createElement('span')
    var node2 = document.createElement('div')
    var node3 = document.createElement('h1')
    const children = [node1, node2, node3]
    
    domUtil.appendChildren($container, children)
    expect($container.childNodes).to.have.length(3)

    document.body.removeChild($container)
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
      domUtil.setAccessor(node,'onClick', e => {count+=1})
      node.click()
      expect(node._listeners).to.have.property('click')
      expect(count).to.equal(1)
    })

    it('remove listener if no value provides', () => {
      domUtil.setAccessor(node,'onClick', undefined)
      expect(node._listeners.click).to.be.undefined

      domUtil.setComplexAccessor(node,'fun', a=>a+1)
      expect(node.fun).to.be.undefined
      expect(node.getAttribute('fun')).to.be.null
    })
  })


  describe('getNodeAttributes', ()=> {
    var node = document.createElement('div')
    
    domUtil.setAccessor(node, 'class', 'goodClass')
    domUtil.setAccessor(node, 'style', 'height:25px;width:3px')

    const clickfn = e => {count+=1}
    domUtil.setAccessor(node,'onClick', clickfn)

    it('get an object that records all set operation value', () => {
      const attrs = domUtil.getNodeAttributes(node)
      // console.log(attrs)
      expect(attrs).to.have.property('class')
      expect(attrs.class).to.equal('goodClass')
      expect(attrs['onClick']).to.equal(clickfn)

    })

  })


})