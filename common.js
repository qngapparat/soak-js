const aws = require('aws-sdk');

const s3 = new aws.S3();

function getS3(bucket, key) {
  const params = {
    Bucket: bucket,
    Key: key,
  };
  return s3.getObject(params)
    .promise()
    .then((s3obj) => s3obj.Body && JSON.parse(Buffer.from(s3obj.Body).toString()));
}

function putS3(bucket, key, data) {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: data, // NEW
  };
  return s3.putObject(params)
    .promise();
  // TODO overwrite objs
}


module.exports = {
  getS3,
  putS3,
};
