import { Types } from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk'

// TODO: Implement the fileStogare logic
const s3Client: Types = new AWS.S3({ signatureVersion: 'v4' })
const s3BucketName = process.env.S3_BUCKET_NAME

export async function getUploadUrl(todoId): Promise<string>{
    
    const url = await s3Client.getSignedUrl('putObject', {
      Bucket: s3BucketName,
      Key: todoId,
      Expires: 500,
  });

  return url as string;
  }