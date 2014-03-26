sharder&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mcollina/sharder.png)](https://travis-ci.org/mcollina/sharder)
=================================================================

Generate 128 bits keys and resolve them to shards.
A shard can be just any JS object

  * <a href="#install">Installation</a>
  * <a href="#basic">Basic Example</a>
  * <a href="#api">API</a>
  * <a href="#licence">Licence &amp; copyright</a>

<a name="install"></a>
## Installation

```
$ npm install sharder --save
```

<a name="basic"></a>
## Basic Example

```js

var shard1  = { url: 'http://localhost:3000', append: true }
  , shard2  = { url: 'http://localhost:3001', append: true }
  , shard3  = { url: 'http://localhost:3002', append: false }
  , sharder = require('sharder')({
                shards: {
                  1: shard1,
                  2: shard2,
                  3: shard3
                }
              })

  , key     = sharder.generate()

console.log(sharder.resolve(key))
// { url: 'http://localhost:3000', append: true }
console.log(sharder.resolve(key))
// { url: 'http://localhost:3000', append: true }
console.log(sharder.resolve(key))
// { url: 'http://localhost:3000', append: true }
```

## API

  * <a href="#sharder"><code>Sharder</code></a>
  * <a href="#generate"><code>Sharder#<b>generate()</b></code></a>
  * <a href="#resolve"><code>Sharder#<b>resolve()</b></code></a>

-------------------------------------------------------
<a name="sharder"></a>
### Sharder(opts)

Sharder is the class and function exposed by this module.
It can be created by `sharder()` or using `new Sharder()`.

A sharder accepts the following options:

- `shards`: contains a map of shards, identified by a number.


Every shard might include a `append: true` property, to identify
it is writable.

Example

```
new Sharder({
  shards: {
      1: {
          append: false
        , url: 'http://localhost:3001'
      }
    , 2: {
          append: true
        , url: 'http://localhost:3002'
      }
    , 3: {
          append: true
        , url: 'http://localhost:3003'
      }
  }
})
```

-------------------------------------------------------
<a name="generate"></a>
### sharder.generate()

Generate a uuid-style identifier.

-------------------------------------------------------
<a name="resolve"></a>
### sharder.resolve(key)

Generate a key generate by `generate()` to a specific shard.


## LICENSE

Copyright (c) 2014, Matteo Collina <hello@matteocollina.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
