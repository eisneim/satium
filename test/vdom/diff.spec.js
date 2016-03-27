import { expect } from 'chai'
import * as diff from '../../src/vdom/diff.js'

describe('diff for vdom', ()=> {
  var node = document.createElement('div')
  node.className = 'test'
  node.setAttribute('willBeRemove', 222) 

  it('diffAttributes', () => {
    var vnode = {
      nodeName: 'div', 
      attributes: {
        'class': 'ggg'
      }
    }

    diff.diffAttributes(node, vnode)
    expect(node.className).to.equal('ggg')
    expect(node.getAttribute('willBeRemove')).to.be.null
  })



})

