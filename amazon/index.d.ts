export = ForLambda;
/** Class representing a configured lambda wrapper */
declare class ForLambda {
    /**
     *
     * @param {string} bucket The S3 bucket name to stash results in
     * @param {number} [thresholdLen=20] The output length above which we want to return a pointer
     * @param {boolean} [forceSave=false] Force to return a pointer
     * @class
     */
    constructor(bucket: string, threshold?: number, forceSave?: boolean);
    bucket: string;
    threshold: number;
    forceSave: boolean;
    /**
     *
     * @param {any} event The Lambda Invocation event
     * @returns {Object} The guaranteed hydrated event
     */
    _hydrate(event: any, context: any, callback: any, ...rest: any[]): any;
    /**
     *
     * // string, Buffer, Stream, Blob, or typed array object
     * @param {(string|Buffer|Stream|Blob|Array)} data The data to be dehydrated
     * @returns {Object} The function invocation result, or a S3 Key thereof
     */
    _dehydrate(data: any): any;
    /**
     *
     * @param {Function} func Your function to run on Lambda
     * @returns {Object} The function invocation result, or a S3 Key thereof
     */
    soak(func: Function): any;
}
