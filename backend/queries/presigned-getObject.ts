import { graphql } from "@keystone-6/core";
import { Context } from ".keystone/types";
import {
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const {
  S3_ENDPOINT: endpoint,
  S3_PORT: port,
  S3_BUCKET_NAME: bucketName,
  S3_REGION: region,
  // The Access Key ID and Secret that has read/write access to the S3 bucket
  S3_ACCESS_KEY_ID: accessKeyId,
  S3_SECRET_ACCESS_KEY: secretAccessKey,
} = process.env;

export const presignedURL = graphql.field({
  type: graphql.String,
  args: {
    objectName: graphql.arg({
      type: graphql.String,
    }),
  },
  async resolve(_, { objectName }, context: Context) {
    const client = new S3Client({
      region: region,
      endpoint: `${endpoint}:${port}`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: true,
    });

    try {
      if (!context.session) {
        return "404";
      }
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectName,
      });

      const headCommand = new HeadObjectCommand({
        Bucket: bucketName,
        Key: objectName,
      });

      await client.send(headCommand);

      return getSignedUrl(client, command, { expiresIn: 60 }).then((result) => {
        return result;
      });
    } catch (error) {
      console.error(error);
      return "404";
    }
  },
});
