import { expect } from 'chai'
import { h } from '../src'
import VNode from '../src/vnode.js'

// let flatten = obj => JSON.parse(JSON.stringify(obj));

describe('h(jsx) => vnode: hyperscript', () => {
  it('should return a vnode', () => {
    let r
    expect(()=> { r = h('foo') }).not.to.throw()
    expect(r).to.be.an('object')
    expect(r).to.be.an.instanceof(VNode)
    expect(r).to.have.property('nodeName', 'foo')
    expect(r).to.have.property('attributes', undefined)
    expect(r).to.have.property('children', undefined)
  })

  it('should preserve raw attributes', ()=> {
    let attrs = { foo: 'bar', baz: 10, func: ()=> {}},
      r = h('foo', attrs)

    expect(r).to.be.an('object')
      .with.property('attributes').that.deep.equals(attrs)
  })

  it('should support element children', () => {
    let r = h('foo', null, h('bar'), h('baz'))
    expect(r).to.be.an('object')
      .with.property('children')
      .that.deep.equals([
        new VNode('bar'),
        new VNode('baz'),
      ])
  })
  it('should support deep element children with attr', () => {
    let r = h('foo', null, h('bar'), h('baz', null, h('test')))

    var childrenString = JSON.stringify([
        { nodeName: 'bar' },
        { nodeName: 'baz', children: [
          { nodeName: 'test' },
        ] },
    ])

    expect(r).to.be.an('object')
    expect(JSON.stringify(r.children)).to.equal(childrenString)
  })

  it('should support text child', ()=> {
    let r = h('foo', null, 'text')
    expect(r).to.be.an('object')
      .with.property('children')
      .with.length(1)
    expect(r.children[0]).to.equal('text')
  })

  it('should merge adjacent text children', () => {
    let r = h('foo', null, 'one', 'two', h('bar'), 'three', h('baz'), h('baz'), 'four', 'five', 'six')

    expect(JSON.stringify(r.children)).to.equal(JSON.stringify(
      [
        'onetwo',
        { nodeName: 'bar' },
        'three',
        { nodeName: 'baz' },
        { nodeName: 'baz' },
        'fourfivesix',
      ]
    ))
  })


}) // end of describe h(jsx)

