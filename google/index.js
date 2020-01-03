const uuidv4 = require('uuid/v4');
const fs = require('fs');
const { getGC, putGC } = require('./utils');

/**
 * @param {Object} req ExpressJS request object
 * @param {Object} res ExpressJS response object
 * @param {Object} soakOptions The soakoptions object
 */
function _hydrate(req, res, soakOptions) {
  const _pointer = req.body._pointer; // || req.query._pointer // TODO Then pointers cannot be signed, only URLs/names! Otherwise they would be cached by Internet HTTP servers
  if (_pointer != null) {
    if (soakOptions.bucket == null) {
      throw new Error('Tried to hydrate, but bucket was not specified. If you want to hydrate, you have to specify the bucket field in soakOptions');
    }
    // hydrate from GC Storage
    return getGC(soakOptions.bucket, _pointer)
      .then(retr => {
        const hydratedReq = {
          ...req,
          body: {
            ...req.body, // hydrate fields into request body
            ...retr
          }
        }
        delete hydratedReq._pointer // remove the pointer from body
        return hydratedReq;
      });
  }
  else {
    return Promise.resolve(req);
  }
}

/**
 * @param {string|Object} data The output of the user function
 * @param {Object} soakOptions The soakoptions object
 */
function _dehydrate(data, soakOptions) {
  if (data.length > soakOptions.threshold || soakOptions.forceSave === true) {
    const key = uuidv4();

    const isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

    // ensure plain objects are stringified first
    let preppedData = isPlainObject(data)
      ? JSON.stringify(data)
      : data

    return putGC(soakOptions.bucket, key, preppedData)
      .then(() => ({ _pointer: key }))
  }
  else {
    return Promise.resolve(data)
  }
};

/**
 * 
 * @param {Function} func The user function to run on GC
 * @param {Object} [soakOptions={}] The soakoptions object 
 * @returns {Object} The function invocation result, or a GCStorage key thereof
 * 
 */
function soak(func, soakOptions = {}) {
  return (req, res) => {
    return _hydrate(req, res, soakOptions)
      .then(fullreq => func(fullreq, res))
      .then(outp => _dehydrate(outp, soakOptions))
      .then(outp => res.json(outp));
  }
}

module.exports = soak;