/**
 * Class representing a configured GC HTTP Function wrapper.
 * Ie. functions with the signature (req, res)
 * @see {@link https://cloud.google.com/functions/docs/concepts/events-triggers|HTTP vs Background - Google Cloud Docs}
 */
export class ForGoogleHTTP {
    /**
     * @param {string} bucket The GC Storage Bucket name to stash results in
     * @param {number} [threshold=20] The output length above which we want to return a pointer
     * @param {boolean} [forceSave=false] Force to return a pointer
     */
    constructor(bucket: string, threshold?: number, forceSave?: boolean);
    bucket: string;
    threshold: number;
    forceSave: boolean;
    /**
     * @param {Object} req ExpressJS request object
     * @param {Object} res ExpressJS response object
     */
    _hydrate(req: any, res: any): any;
    /**
     * @param {string|Object} data The output of the user function
     */
    _dehydrate(data: any): any;
}
/**
 * Class representing a configured GC HTTP Function wrapper.
 * ie. Functions with the signature (data, context, callback)
 * @see {@link https://cloud.google.com/functions/docs/concepts/events-triggers|HTTP vs Background - Google Cloud Docs}
 */
export class ForGoogleBackground {
}
