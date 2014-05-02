
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

test('assume a append:true as a default', function(t) {
  t.plan(2)

  var instance = sharder({ shards: { 1: { } } })
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

test('should not generate keys for the non-append shard', function(t) {
  t.plan(3)

  var shard1    = { id: 1, append: true }
    , shard2    = { id: 2, append: true }
    , shard3    = { id: 2, append: false }
    , instance  = sharder({ shards: { 1: shard1, 2: shard2, 3: shard3 } })

  t.equal(instance.resolve(instance.generate()), shard1)
  t.equal(instance.resolve(instance.generate()), shard2)
  t.equal(instance.resolve(instance.generate()), shard1)
})

test('basic cache mode', function(t) {
  t.plan(3)

  var shard1    = { id: 1 }
    , shard2    = { id: 2 }
    , instance  = sharder({ cache: true, shards: { 1: shard1, 2: shard2 } })
    , args      = new Buffer(5)
    , key       = instance.generate(args)

  t.equal(instance.generate(args), key)
  t.type(key, 'string')
  t.equal(key.length, 36)
})

test('throwing if in cache mode with a non-appendable shards', function(t) {
  t.plan(1)

  try {
    sharder({ cache: true, shards: { 1: {} , 2: { append: false } } })
  } catch(err) {
    t.ok(err, 'must err')
  }
})

test('cache encode to different shards', function(t) {

  var shard1    = { id: 1 }
    , shard2    = { id: 2 }
    , instance  = sharder({ cache: true, shards: { 1: shard1, 2: shard2 } })

  function doTest(prekey, expected) {
    var key   = instance.generate(new Buffer(prekey))
      , shard = instance.resolve(key)

    console.log(key, shard)
    t.equal(shard, expected)
  }

  doTest([1], shard2)
  doTest([2], shard2)
  doTest([3], shard1)
  doTest([3, 1], shard2)

  t.end()
})
