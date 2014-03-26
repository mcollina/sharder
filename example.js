
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

console.log(sharder.resolve(key))
// { url: 'http://localhost:3000', append: true, id: 1 }
console.log(sharder.resolve(key))
// { url: 'http://localhost:3000', append: true, id: 1 }
console.log(sharder.resolve(key))
// { url: 'http://localhost:3000', append: true, id: 1 }
