const uuidv4 = require('uuid/v4');
const { getS3, putS3 } = require('./utils');

/** Class representing a configured lambda wrapper */
class ForLambda {
  /**
   * 
   * @param {string} bucket The S3 bucket name to stash results in
   * @param {number} [thresholdLen=20] The output length above which we want to return a pointer
   * @param {boolean} [forceSave=false] Force to return a pointer
   * @class
   */
  constructor(bucket, threshold=20, forceSave=false) {
    this.bucket = bucket;
    this.threshold = threshold;
    this.forceSave = forceSave;
  }

  /**
   * 
   * @param {any} event The Lambda Invocation event
   * @returns {Object} The guaranteed hydrated event
   */
  _hydrate(event, context, callback, ...rest) {
    if (event._pointer) {
      // TODO accept ARN or URL instead of key
      return getS3(this.bucket, event._pointer)
        .then((retr) => ({
          ...event,
          ...retr,
        }));
    } else {
      return Promise.resolve(event); // TODO have it return all args + hydrated event, then chaining below is easier?
    }
  }

  /**
   * 
   * // string, Buffer, Stream, Blob, or typed array object
   * @param {(string|Buffer|Stream|Blob|Array)} data The data to be dehydrated
   * @returns {Object} The function invocation result, or a S3 Key thereof
   */
  _dehydrate(data) {
    if (data.length > this.threshold || this.forceSave === true) {
      const key = uuidv4();
      // TODO return ARN or URL

      const isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';
      
      // ensure plain objects are stringified first
      let preppedData = isPlainObject(data)
        ? JSON.stringify(data)
        : data

      return putS3(this.bucket, key, preppedData)
        .then(() => ({ _pointer: key }));
    } else {
      return Promise.resolve(data);
    }
  }

  /**
   * 
   * @param {Function} func Your function to run on Lambda
   * @returns {Object} The function invocation result, or a S3 Key thereof
   */
  soak(func){
    return (event, context, callback, ...rest) => {
      return this._hydrate(event, context, callback, ...rest)
        .then((fullevent) => func(fullevent, context, callback, ...rest))
        .then((outp) => this._dehydrate(outp))
    }
  }
}

module.exports = ForLambda;