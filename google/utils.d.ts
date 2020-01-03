/**
 *
 * @param {string} bucketname Name of the GC bucket
 * @param {string} key Name of the file to get from the bucket
 */
export function getGC(bucketname: string, key: string): Promise<any>;
export function putGC(bucketname: any, key: any, content: any): any;
