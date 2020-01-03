const uuidv4 = require('uuid/v4');
const sizeof = require('object-sizeof');
const { getS3, putS3 } = require('./utils');

  /**
   * @param {Object} event The Lambda Invocation event object
   * @param {Object} soakOptions Options are 'bucket', 'thresholdBytes', and 'forceSave' // TODO doc like fetch's options object 
   * @returns {Object} The guaranteed hydrated event
   */
  function _hydrate(event, soakOptions) {
    if (event._pointer) {
    
      if(soakOptions.bucket == null){
        throw new Error('Tried to hydrate, but bucket was not specified. If you want to hydrate, you have to specify the bucket field in soakOptions');
      }
      // TODO accept ARN or URL instead of key
      return getS3(soakOptions.bucket, event._pointer)
        .then((retr) => ({
          ...event,
          ...retr, // TODO remove _pointer field
        }));
    } else {
      return Promise.resolve(event); // TODO have it return all args + hydrated event, then chaining below is easier?
    }
  }

  /**
   * 
   * @param {(string|Buffer|Stream|Blob|Array)} data The data to be dehydrated
   * @param {Object} soakOptions Options are 'bucket', 'thresholdBytes', and 'forceSave'
   * @returns {Object} The function invocation result, or a S3 Key thereof
   */
  function _dehydrate(data, soakOptions) {
    if (sizeof(data) > soakOptions.thresholdBytes || soakOptions.forceSave === true) {
      const key = uuidv4();
      // TODO return ARN or URL
      const isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';
      
      // ensure plain objects are stringified first
      let preppedData = isPlainObject(data)
        ? JSON.stringify(data)
        : data

      return putS3(soakOptions.bucket, key, preppedData)
        .then(() => ({ _pointer: key }));
    } else {
      return Promise.resolve(data);
    }
  }

  /**
   * 
   * @param {Function} func Your function to run on Lambda
   * @param {Object} [soakOptions={}] Options are 'bucket', 'thresholdBytes', and 'forceSave'
   * @returns {Object} The function invocation result, or a S3 Key thereof
   */
  function soak(func, soakOptions={} ){
    return (event, context, callback, ...rest) => {
      return _hydrate(event, soakOptions)
        .then((fullevent) => func(fullevent, context, callback))
        .then((outp) => _dehydrate(outp, soakOptions))
    }
  }


module.exports = soak;