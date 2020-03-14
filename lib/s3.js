const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const s3 = new AWS.S3();

const BUCKET = process.env.BUCKET;

const signedUrlExpireSeconds = 60 * 60 * 24 * 365 * 5; // five years

function putData(key, data) {
  return s3
    .putObject({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(JSON.stringify(data)),
      // ACL: 'public-read',
      CacheControl: 'max-age=120,public',
      ContentType: 'application/json; charset=UTF-8'
    })
    .promise();
}

function getSignedKey(key) {
  const url = s3.getSignedUrl('getObject', {
    Bucket: BUCKET,
    Key: key,
    Expires: signedUrlExpireSeconds
  });

  const encodedFile = new Buffer(
    url.replace(`https://${BUCKET}.s3.amazonaws.com/`,'')
  ).toString('base64');

  return encodedFile;
}

exports.putData = putData;
exports.getSignedKey = getSignedKey;
