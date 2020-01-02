export function getS3(bucket: any, key: any): Promise<any>;
export function putS3(bucket: any, key: any, data: any): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>>;
