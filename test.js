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

  it('should throw a TypeError if a non-object is given instead of entries', function () {
    assert.throws(() => { newObject(123) }, TypeError)
  })

  it('should throw a TypeError if an entry is not an object', function () {
    assert.throws(() => { newObject(['a', 'b']) }, TypeError)
  })

  it('should throw on key duplication if `throwIfEquivKeys` is set', function () {
    newObject([[1, 1], [1, 1]])
    assert.throws(() => { newObject([[1, 1], [1, 1]], {throwIfEquivKeys: true}) }, TypeError)
    assert.throws(() => { newObject([[1, 1], [1, 1]], {throwIfEquivKeys: new RangeError()}) }, RangeError)
  })

  it('should accept descriptors instead of values if `descs` is `true`', function () {
    const obj = newObject([['a', {value: 1}], ['b', {value: 2}]], {descs: true})
    assert.strictEqual(Object.keys(obj).length, 0) // because they are non-enumerable
    assert.strictEqual(obj.a, 1)
    assert.strictEqual(obj.b, 2)
  })

  it('should accept an object of descriptors', function () {
    const obj = newObject({a: {value: 1}, b: {value: 2}})
    assert.strictEqual(Object.keys(obj).length, 0) // because they are non-enumerable
    assert.strictEqual(obj.a, 1)
    assert.strictEqual(obj.b, 2)
  })

  it('should support specifying default descriptor settings with `descDefaults`', function () {
    const obj = newObject({a: {value: 1}, b: {value: 2}}, {descDefaults: {enumerable: true}})
    assert.strictEqual(Object.keys(obj).length, 2)
    assert.strictEqual(obj.a, 1)
    assert.strictEqual(obj.b, 2)
  })

  it('should skip merging `writable` into a descriptor with `get` or `set`', function () {
    const obj = newObject(
      {a: {get: () => 1}, b: {value: 2}, c: {set: x => {}}},
      {descDefaults: {enumerable: true, writable: true}}
    )
    assert.strictEqual(Object.keys(obj).length, 3)
    assert.strictEqual(obj.a, 1)
    assert.strictEqual(obj.b, 2)
    assert.throws(() => {
      obj.a = 123 // This should throw, but just in case:
      if (obj.a === 123) throw new Error()
    })
    obj.b = 123
    assert.strictEqual(obj.b, 123)
  })
})
