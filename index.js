var assert    = require('assert')
  , uuid      = require('uuid')
  , crypto    = require('crypto')
  , bitcount  = require('bitcount')

function Sharder(config) {
  if (!(this instanceof Sharder))
    return new Sharder(config)

  assert(config)
  assert(config.shards)

  this.shards = config.shards

  this._appendShards = Object.keys(config.shards).map(function(shardId) {
      config.shards[shardId].id = parseInt(shardId)
      return config.shards[shardId]
    }).filter(function(shard) {
      return shard.append === undefined || shard.append
    })

  if (!config.cache) {
    this.generate = generate
    this._lastCreatedCounter = 0
  } else {
    assert.equal(this._appendShards.length, Object.keys(this.shards).length, 'there must be no read-only shards in cache mode')
    this.generate = generateWithFixedPart
  }

  assert(this._appendShards.length > 0, 'must have at least an append shard')
}


Sharder.prototype.resolve = function resolve(key) {
  var bytes = uuid.parse(key)

  return this.shards[bytes[0]]
}

function encode(shardId, bytes) {
  var buf = new Buffer(16)
    , remaining = 16 - bytes.length

  buf.fill(0)

  buf[0] = shardId

  bytes.copy(buf, remaining)

  return uuid.unparse(buf)
}

function generate(fixedPart) {

  assert(!fixedPart)

  var index = this._lastCreatedCounter++ % this._appendShards.length
    , shard = this._appendShards[index]

  return encode(shard.id, crypto.pseudoRandomBytes(15))
}

function generateWithFixedPart(fixedPart) {

  assert(fixedPart)

  var index = bitcount(fixedPart) % this._appendShards.length
    , shard = this._appendShards[index]

  return encode(shard.id, fixedPart);
}

module.exports = Sharder
