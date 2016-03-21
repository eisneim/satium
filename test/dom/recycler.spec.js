import { expect } from 'chai'
import * as recycler from '../../src/dom/recycler'

describe('DOM node recycler', () => {
  var $container
  before(()=> {
    $container = document.createElement('div')
    document.body.appendChild($container)
  })

  after(()=> {
    document.body.removeChild($container)
  })

  it('create node', () => {
    const node = recycler.createNode('div')
    $container.appendChild(node)
    expect(node.nodeName).to.equal('DIV')
  })

  it('collect node', () => {  
    const node = recycler.createNode('span')
    node.className = 'testClass'
    $container.appendChild(node)
    expect($container.childNodes).to.have.length(2)

    recycler.collectNode(node)
    expect($container.childNodes).to.have.length(1)
    // should be resue
    const reusedNode = recycler.createNode('span')
    expect(reusedNode.className).to.equal('testClass')
  })
})
