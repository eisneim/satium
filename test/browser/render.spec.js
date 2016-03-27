import { expect } from 'chai'
import {h, render, Component} from '../../src'

describe('render()', ()=> {
  let scratch

  before(()=> {
    scratch = document.createElement('div');
    (document.body || document.documentElement).appendChild(scratch)
  })

  beforeEach(()=> {
    scratch.innerHTML = ''
  })

  after(()=> {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('should create empty nodes (<* />', () => {
    render(<div />, scratch)
    expect(scratch.childNodes).to.have.length(1)
      .and.to.have.deep.property('0.nodeName', 'DIV')

    scratch.innerHTML = '';

    render(<foo />, scratch)
    render(<x-bar />, scratch)
    expect(scratch.childNodes).to.have.length(2)
  })

})
