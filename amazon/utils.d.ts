export function getS3(bucket: string, key: string): Promise<any>;
export function putS3(bucket: string, key: string, data: any): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>>;
