import { graphql } from "@keystone-6/core";
import { Context } from ".keystone/types";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const {
  S3_ENDPOINT: endpoint,
  S3_PORT: port,
  S3_BUCKET_NAME: bucketName,
  S3_REGION: region,
  // The Access Key ID and Secret that has read/write access to the S3 bucket
  S3_ACCESS_KEY_ID: accessKeyId,
  S3_SECRET_ACCESS_KEY: secretAccessKey,
} = process.env;

export const downloadFile = graphql.field({
  type: graphql.JSON,
  args: {
    objectName: graphql.arg({
      type: graphql.String,
    }),
  },
  async resolve(source, { objectName }, context: Context) {
    const client = new S3Client({
      region: region,
      endpoint: `${endpoint}:${port}`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: true,
    });

    const streamToBuffer = async (readableStream) => {
      const chunks = [];
      for await (const chunk of readableStream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    };

    try {
      if (!context.session) {
        return {
          statusCode: 500,
          body: "An error occurred: Unauthorized",
        };
      }
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectName,
      });
      const data = await client.send(command);

      // Set the content type of the response
      const contentType = data.ContentType;
      // Convert to base64 string
      //const streamToString = await data.Body!.transformToWebStream();

      //const buffer = await streamToBuffer(streamToString);

      // Convert to base64 string
      const streamToString = await data.Body?.transformToString("base64");
      // Return the object data in the response
      // Return the object data in the response

      return {
        statusCode: 200,
        headers: {
          "Content-Type": contentType,
        },
        body: streamToString,
        isBase64Encoded: true,
      };

      // Return the object data in the response
      // return {
      //   statusCode: 200,
      //   headers: {
      //     "Content-Type": contentType,
      //     "Content-Disposition": "attachment",
      //   },
      //   body: buffer,
      // };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: "An error occurred: " + error.message,
      };
    }
  },
});
