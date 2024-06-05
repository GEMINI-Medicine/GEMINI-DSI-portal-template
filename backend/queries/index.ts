import { graphql } from "@keystone-6/core";
import { presignedURL } from "./presigned-getObject";
import { validateCSV } from "./validateCSV";
import { uploadReports } from "./uploadReportsMutation";
import { downloadFile } from "./downloadMinioFile";
import { versions } from "./versions";

export const extendGraphqlSchema = graphql.extend(() => {
  return {
    mutation: {
      uploadReports: uploadReports,
    },
    query: {
      validateCSV: validateCSV,
      requestPresignedURL: presignedURL,
      downloadReport: downloadFile,
      versions: versions,
    },
  };
});
