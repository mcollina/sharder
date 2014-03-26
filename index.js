var assert = require('assert')
  , uuid   = require('uuid')
  , crypto = require('crypto')

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
      return shard.append
    })

  this._lastCreatedCounter = 0

  assert(this._appendShards.length > 0, 'must have at least an append shard')
}

Sharder.prototype.generate = function generate() {

  var bytes = crypto.pseudoRandomBytes(15)
    , index = this._lastCreatedCounter % this._appendShards.length
    , shard = this._appendShards[index]
    , buf   = Buffer.concat([new Buffer([shard.id]), bytes])

  this._lastCreatedCounter += 1

  return uuid.unparse(buf)
}

Sharder.prototype.resolve = function resolve(key) {
  var bytes = uuid.parse(key)

  return this.shards[bytes[0]]
}

module.exports = Sharder
