import { expect } from 'chai'
import * as util from '../src/util.js'

describe('util.js', ()=> {

  describe('extend(obj, props)', ()=> {
    it('should set new property on obj', () => {
      var obj = util.extend({ a: 1 }, { b: 2, c: 3, d: undefined })

      expect(obj.b).to.equal(2)
      expect(obj.c).to.equal(3)
      /* eslint-disable no-unused-expressions */
      expect(obj.d).to.be.undefined
    })
  })

  describe('memoize', ()=> {
    it('memoize old value', ()=> {
      var count = 0
      function tt(v) {
        count += 1
        return v + 1
      }
      const mtt = util.memoize(tt)
      mtt()
      mtt()
      mtt()
      expect(count).to.equal(1)
    })
  })

  describe('delve', () => {
    var target = {
      a: {
        b: 2,
        c: {
          d: 1,
        },
      },
      array: [
        11,
        { v: 1 },
      ],
    }
    it('it should get deep property for object', () => {
      expect(util.delve(target, 'a.b')).to.equal(2)
      expect(util.delve(target, 'a.c.d')).to.equal(1)
      expect(util.delve(target, 'array.0')).to.equal(11)
      expect(util.delve(target, 'array.1.v')).to.equal(1)
    })

  })

  describe('toArray', ()=> {
    it('should convert arrayLike to array', () => {
      function wrapper() {
        return util.toArray(arguments)
      }
      var array = wrapper(1, 2, 3)
      expect(array).to.deep.equal([ 1, 2, 3 ])
      expect(array).to.have.property('join')
    })
  })

  describe('deal with css, className', ()=> {
    var styleObj = {
      minWidth: 25,
      background: 'url(img/a.jpg) center center',
    }
    it('styleObjToCss: should convert styleObject to css string', ()=> {
      const style = util.styleObjToCss(styleObj)
      expect(style).to.equal('min-width: 25px; background: url(img/a.jpg) center center; ')
    })

    it('hashToClassName', () => {
      var classnames = {
        good: 1, bad: 0, clearfix: true,
      }
      expect(util.hashToClassName(classnames)).to.equal('good clearfix')
    })
  })


})


