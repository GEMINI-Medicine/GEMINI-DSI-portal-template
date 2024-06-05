/** @jsxRuntime classic */
/** @jsx jsx */
import { useState } from "react";
import Papa from "papaparse";
import { PageContainer } from "@keystone-6/core/admin-ui/components";
import { jsx, Heading, css } from "@keystone-ui/core";
import {
  gql,
  useLazyQuery,
  useMutation,
} from "@keystone-6/core/admin-ui/apollo";
import Table, { Mapping, tableStyles } from "../components/Table";

const buttonCss = {
  base: css({
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "0",
    position: "relative",
    borderColor: "transparent",
    borderRadius: "4px",
    borderWidth: "1px",
    height: "32px",
    padding: "0 12px 0 12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: "0.875rem",
    fontWeight: "500",
  }),
  danger: css({
    backgroundColor: "#dc2626",
  }),
  disabled: css({
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  }),
};

const footerCss = {
  self: css({
    background: "white",
    borderTop: "1px solid #e1e5e9",
    bottom: "0",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "24px",
    paddingBottom: "24px",
    paddingTop: "24px",
    position: "sticky",
    zIndex: "20",
  }),
};

const inputCss = {
  self: css({
    fontWeight: 700,
    display: "flex",
    flexDirection: "column",
    gap: "1em",
    marginTop: "1em",
    width: "fit-content",
  }),
};

export default function UploadPage() {
  const [check, { data, error, loading }] = useLazyQuery(
    gql`
      query VALIDATE_CSV($data: [ValidateCSVArgs!]!) {
        validateCSV(data: $data) {
          email
          userExists
          siteExists
          cpsoExists
          cpsoMatches
          roleExists
          roleMatches
          userAssigned
        }
      }
    `,
    { fetchPolicy: "no-cache" },
  );
  const [
    upload,
    { data: uploadData, error: uploadError, loading: uploadLoading },
  ] = useMutation(gql`
    mutation UPLOAD_REPORTS($data: [UploadReportsArgs!]!) {
      uploadReports(data: $data)
    }
  `);

  // State to store parsed data
  const [parsedData, setParsedData] = useState<Mapping[]>([]);

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        // Parsed Data Response in array format
        const formatted = results.data.map((row) => {
          return Object.entries(row).reduce((carry, [key, value]) => {
            carry[key.toLowerCase()] = value.trim();
            return carry;
          }, {});
        });
        setParsedData(formatted);
      },
    });
  };
  async function validateData() {
    try {
      await check({
        variables: {
          data: parsedData.map((data) => {
            const { validation, uploadStatus, tags, ...rest } = data;
            return rest;
          }),
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function uploadReports() {
    try {
      await upload({
        variables: {
          data: parsedData.map((data) => {
            const { validation, uploadStatus, ...rest } = data;
            return rest;
          }),
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  const errorMessage = error || uploadError;
  if (errorMessage) {
    return (
      <PageContainer header={<Heading type="h3">Upload</Heading>}>
        <h1
          css={{
            width: "100%",
            textAlign: "center",
            color: "#dc2626",
          }}
        >
          Something Went wrong
        </h1>
        <p
          css={{
            textAlign: "center",
          }}
        >
          {errorMessage.message}
        </p>
      </PageContainer>
    );
  }

  if (data) {
    parsedData.map((d, index) => {
      d.validation = data.validateCSV[index];
      d.uploadStatus = undefined;
    });
  }

  if (uploadData) {
    uploadData.uploadReports.map((result) => {
      if (parsedData[result]) {
        parsedData[result].uploadStatus = true;
      } else {
        parsedData[result].uploadStatus = false;
      }
    });
    parsedData.map((d) => {
      if (d.uploadStatus === undefined) {
        d.uploadStatus = false;
      }
    });
  }

  return (
    <PageContainer
      header={<Heading type="h3">Upload Reports from CSV</Heading>}
    >
      <p>
        You can batch upload reports by providing a csv file with the following
        format:
      </p>
      <table css={tableStyles}>
        <thead>
          <tr>
            <th>cpso</th>
            <th>name</th>
            <th>email</th>
            <th>role</th>
            <th>title</th>
            <th>site</th>
            <th>tags</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>11111</td>
            <td>Sample Physician</td>
            <td>sample.physician@example.com</td>
            <td>viewer</td>
            <td>IndividualReport v1.0 TEST-11111.html</td>
            <td>TEST</td>
            <td>NOEMAIL</td>
          </tr>
        </tbody>
      </table>

      <h2>Failure Scenarios</h2>
      <ul>
        <li css={{ color: "#dc2626" }}>If cpso is taken by another user</li>
        <li css={{ color: "#dc2626" }}>
          If user exists and cpso does not match
        </li>
        <li css={{ color: "#dc2626" }}>
          If no role is specified or the role is incorrect
        </li>
        <li css={{ color: "#dc2626" }}>If the site does not exist</li>
      </ul>
      <h2>Success Scenarios</h2>
      <ul>
        <li css={{ color: "#38A169" }}>
          If a User account with that email does not exist then it will be
          created
        </li>
        <li css={{ color: "#38A169" }}>
          If the report does not exist then it will be created
        </li>
      </ul>
      <h2>Warning Scenarios</h2>
      <ul>
        <li css={{ color: "#DD6B20" }}>
          If role exists but is different than the existing role for that user.
        </li>
      </ul>
      <label css={inputCss.self}>
        Upload your csv file
        {/* File Uploader */}
        <input type="file" name="file" onChange={changeHandler} accept=".csv" />
      </label>
      <br />
      <br />
      {/* Table */}
      {parsedData.length !== 0 && <Table data={parsedData} />}
      {parsedData.length !== 0 && (
        <div css={footerCss.self}>
          <button
            type="button"
            css={[buttonCss.base, buttonCss.disabled]}
            onClick={validateData}
            disabled={loading || uploadLoading}
          >
            {loading ? <span>Checking</span> : <span>Check Data</span>}
          </button>
          {data?.validateCSV && (
            <button
              type="button"
              css={[buttonCss.base, buttonCss.danger, buttonCss.disabled]}
              onClick={uploadReports}
              disabled={loading || uploadLoading}
            >
              {uploadLoading ? (
                <span>Uploading Data</span>
              ) : (
                <span>Upload</span>
              )}
            </button>
          )}
        </div>
      )}
    </PageContainer>
  );
}
