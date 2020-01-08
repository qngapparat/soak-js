# soak-js

No more size limits for FaaS inputs & outputs. 

A hydration - dehydration wrapper.

|   | Amazon AWS Lambda  |  Google Cloud Functions  |  using soak-js  |
|---|---|---|---|
| **Invocation payload**  | 6 MB (sync)  | 10 MB  | unlimited  |
|                     | 256 KB (async)  | | unlimited  |
| **Response**  | 6 MB (sync)  | 10 MB  | unlimited  |
|                     | 256 KB (async)  |   | unlimited  |

## Install
```shell
npm i soak-js
```

## How

Before exporting, wrap your function in `soak`

### AWS Lambda

```js

const soak = require('soak-js');

const myFunction = (event, context, callback) => ({ foo: 'bar' })

exports.handler = soak(myFunction, {
  bucket: 'some-s3-bucket-for-stashing'
})
```

### Google Cloud Functions

```js
const soak = require('soak-js');

const myFunction = (req, res) => ({ foo: 'bar' }) // don't use req.json

exports.myFunction = soak(myFunction, {
  bucket: 'some-gcloud-bucket-for-stashing
})
```
### Pass it unlimited inputs

```js
// myBucket/largePayload.json
{ 
  "foo": "bar",
  "baz": 123
}
```

```js
// invoke it with:
{ a: 1, _pointer: 'largePayload.json' }

// your function sees:
{ a: 1, foo: 'bar', 'baz': 123 }

```

### Create unlimited outputs

```js

return { almost: 'too', large: 'output' }
// => { almost: 'too', large: 'output' }

return { too: 'large', json: 'output' }
// => { _pointer: stashedOutputKey.json }
```

## Licence

MIT