export = soak;
/**
 *
 * @param {Function} func The user function to run on GC
 * @param {Object} [soakOptions={}] The soakoptions object
 * @returns {Object} The function invocation result, or a GCStorage key thereof
 *
 */

 interface soakOptions {
   bucket?: string,
   threshold?: number,
   forceSave?: boolean
 }
declare function soak(func: Function, soakOptions?: soakOptions): any;
