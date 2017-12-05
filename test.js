'use strict'

const assert = require('assert')
const newObject = require('.')

describe('newObject()', function () {
  it('should accept an array', function () {
    const obj = newObject([['a', 1], ['b', 2]])
    assert.strictEqual(Object.keys(obj).length, 2)
    assert.strictEqual(obj.a, 1)
    assert.strictEqual(obj.b, 2)
  })

  it('should reverse the effect of Object.entries()', function () {
    const obj1 = {a: 1, b: 2}
    const obj2 = newObject(Object.entries(obj1))
    assert.notStrictEqual(obj1, obj2)
    assert.strictEqual(Object.keys(obj2).length, 2)
    assert.strictEqual(obj2.a, 1)
    assert.strictEqual(obj2.b, 2)
  })

  it('should return an empty object if no arguments are given', function () {
    const obj = newObject()
    assert.strictEqual(Object.keys(obj).length, 0)
  })

  it('should throw a TypeError if an entry is not an object', function () {
    assert.throws(() => { newObject(['a', 'b']) }, TypeError)
  })
})
