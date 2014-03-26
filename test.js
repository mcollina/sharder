
var test    = require('tap').test
  , sharder = require('./')

test('accepting a config', function(t) {
  t.plan(1)

  var instance = sharder({ shards: { 42: { append: true } } })

  t.ok(instance, 'builds a sharder')
})

test('throwing if no config is given', function(t) {
  t.plan(1)

  try {
    sharder()
  } catch(err) {
    t.ok(err, 'must err')
  }
})

test('throwing if no shards are given', function(t) {
  t.plan(1)

  try {
    sharder({ shards: {} })
  } catch(err) {
    t.ok(err, 'must err')
  }
})

test('throwing if no shards in append mode are available', function(t) {
  t.plan(1)

  try {
    sharder({ shards: { 42: { append: false } } })
  } catch(err) {
    t.ok(err, 'must err')
  }
})

test('generate a string long 36 chars', function(t) {
  t.plan(2)

  var instance = sharder({ shards: { 1: { append: true } } })
    , key      = instance.generate()

  t.equal(typeof key, 'string')
  t.equal(key.length, 36)
})

test('generate uniquish strings', function(t) {

  var instance = sharder({ shards: { 1: { append: true } } })
    , key      = instance.generate()
    , max      = 20
    , i

  t.plan(max)

  for (i = 0; i < max; i++) {
    t.notEqual(instance.generate(), key)
  }

})

test('resolve the key to the only shard', function(t) {
  t.plan(1)

  var shard    = { append: true }
    , instance = sharder({ shards: { 1: shard } })
    , key      = instance.generate()

  t.equal(instance.resolve(key), shard)
})

test('resolve the key to the right shard in round robin fashion', function(t) {
  t.plan(3)

  var shard1    = { id: 1, append: true }
    , shard2    = { id: 2, append: true }
    , instance  = sharder({ shards: { 1: shard1, 2: shard2 } })

  t.equal(instance.resolve(instance.generate()), shard1)
  t.equal(instance.resolve(instance.generate()), shard2)
  t.equal(instance.resolve(instance.generate()), shard1)
})

test('resolve the same key to the right shard', function(t) {
  t.plan(3)

  var shard1    = { id: 1, append: true }
    , shard2    = { id: 2, append: true }
    , instance  = sharder({ shards: { 1: shard1, 2: shard2 } })
    , key       = instance.generate()

  t.equal(instance.resolve(key), shard1)
  t.equal(instance.resolve(key), shard1)
  t.equal(instance.resolve(key), shard1)
})
