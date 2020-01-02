const uuidv4 = require('uuid/v4');
const express = require('express');
const fs = require('fs');
const { getGC, putGC } = require('./utils');
/**
 * Class representing a configured GC HTTP Function wrapper. 
 * Ie. functions with the signature (req, res)
 * @see {@link https://cloud.google.com/functions/docs/concepts/events-triggers|HTTP vs Background - Google Cloud Docs}
 */
class ForGoogleHTTP {

  /**
   * @param {string} bucket The GC Storage Bucket name to stash results in 
   * @param {number} [threshold=20] The output length above which we want to return a pointer
   * @param {boolean} [forceSave=false] Force to return a pointer
   */
  constructor(bucket, threshold = 20, forceSave = false){
    this.bucket = bucket;
    this.threshold = threshold;
    this.forceSave = forceSave;
  }

  /**
   * @param {Object} req ExpressJS request object
   * @param {Object} res ExpressJS response object
   */
  _hydrate(req, res) {
    const _pointer = req.body._pointer; // || req.query._pointer // TODO Then pointers cannot be signed, only URLs/names! Otherwise they would be cached by Internet HTTP servers
    if (pointer != null) {
      // hydrate from GC Storage
      return getGC(this.bucket, _pointer)
      .then(retr => {
        console.log("GETGC returned: ", retr, JSON.stringify(retr))
        return {
          ...req,
          ...retr
        }
      });
    }
    else {
      return Promise.resolve(req);
    }
  }

  /**
   * @param {string|Object} data The output of the user function
   */
  _dehydrate(data) {
    if (data.length > this.threshold || this.forceSave === true) {
      const key = uuidv4();

      const isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';

      // ensure plain objects are stringified first
      let preppedData = isPlainObject(data)
        ? JSON.stringify(data)
        : data

      return putGC(this.bucket, key, preppedData)
        .then(() => ({ _pointer: key }))
      // write content to file
    }
    else {
      return Promise.resolve(data)
    }
  };

  /**
   * 
   * @param {function} func The user function to run on GC
   * @returns {Object} The function invocation result, or a GCStorage key thereof
   */
  soak(func) {
    return (req, res) => {
      return this._hydrate(req, res)
        .then(fullreq => func(fullreq, res))
        .then(outp => this._dehydrate(outp))
    }
  }
}



/**
 * Class representing a configured GC HTTP Function wrapper. 
 * ie. Functions with the signature (data, context, callback)
 * @see {@link https://cloud.google.com/functions/docs/concepts/events-triggers|HTTP vs Background - Google Cloud Docs}
 */
class ForGoogleBackground {

};

module.exports = {
  ForGoogleHTTP,
  ForGoogleBackground
}