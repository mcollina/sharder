
var shard1  = { url: 'http://localhost:3000', append: true }
  , shard2  = { url: 'http://localhost:3001', append: true }
  , shard3  = { url: 'http://localhost:3002', append: false }
  , sharder = require('./')({
                shards: {
                    1: shard1
                  , 2: shard2
                  , 3: shard3
                }
              })

  , key     = sharder.generate()

  , cacher = require('./')({
                cache: true,
                shards: {
                    1: shard1
                  , 2: shard2
                }
              })

console.log(sharder.resolve(key))
// { url: 'http://localhost:3000', append: true, id: 1 }
console.log(sharder.resolve(key))
// { url: 'http://localhost:3000', append: true, id: 1 }
console.log(sharder.resolve(key))
// { url: 'http://localhost:3000', append: true, id: 1 }

console.log(cacher.generate(new Buffer([1, 2])))
// 01000000-0000-0000-0000-000000000102
console.log(cacher.generate(new Buffer([1, 2])))
// 01000000-0000-0000-0000-000000000102
console.log(cacher.generate(new Buffer([3, 2])))
// 02000000-0000-0000-0000-000000000302
console.log(cacher.generate(new Buffer([3, 2])))
// 02000000-0000-0000-0000-000000000302
