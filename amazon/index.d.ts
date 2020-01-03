export = soak;
/**
 *
 * @param {Function} func Your function to run on Lambda
 * @param {Object} [soakOptions={}] Options are 'bucket', 'threshold', and 'forceSave'
 * @returns {Object} The function invocation result, or a S3 Key thereof
 */

interface soakOptions {
  bucket?: string,
  threshold?: number,
  forceSave?: boolean
}

declare function soak(func: Function, soakOptions?: soakOptions): any;
