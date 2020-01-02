const { Storage } = require('@goog1le-cloud/storage')
const storage = new Storage();
const fs = require('fs');
const path = require('path');

const { Readable } = require('stream');

/**
 * 
 * @param {string} bucketname Name of the GC bucket
 * @param {string} key Name of the file to get from the bucket
 */
function getGC(bucketname, key) {
  const bucket = storage.bucket(bucketname)
  const remoteFile = bucket.file(key)

  return file.download()
    .then(data => data[0]) // contents
}

function putGC(bucketname, key, content){ 
  const bucket = storage.bucket(bucketname);
  const remoteFile = bucket.file(key);

  // TODO this requires NodeJS 10.x+

  if(typeof content !== 'string'){
    throw new Error("putGC: content arg must be string");
  }

  const s = new Readable();
  s._read = () => { };
  s.push(content);
  s.push(null);

  return s.pipe(remoteFile.createWriteStream())
    .on('error', (err) => console.log(err))
    .on('finish', () => console.log("Finished transferring file to GC!"));
}

module.exports = {
  getGC,
  putGC
}