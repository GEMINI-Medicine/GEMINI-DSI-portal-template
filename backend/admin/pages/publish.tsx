/** @jsxRuntime classic */
/** @jsx jsx */
import {
  PageContainer,
  ErrorContainer,
} from "@keystone-6/core/admin-ui/components";

import {
  gql,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@keystone-6/core/admin-ui/apollo";
import { jsx, Heading, css } from "@keystone-ui/core";

const buttonCss = {
  base: css({
    marginTop: "1em",
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

const errorCss = {
  container: css({
    width: "100%",
    display: "flex",
    alignItems: "center",
    background: "#FED7D7",
    paddingInlineStart: "4rem",
    paddingInlineEnd: "4rem",
    paddingTop: "0.75rem",
    paddingBottom: "0.75rem",
    "& div:first-child": {
      fontWeight: 700,
    },
  }),
};

const ALL_REPORTS_QUERY = gql`
  query ALL_REPORTS_QUERY {
    reports(where: { status: { equals: "DRAFT", mode: insensitive } }) {
      id
      title
      status
    }
  }
`;

export default function PublishPage() {
  const {
    data: allReports,
    error: reportsError,
    loading: reportsLoading,
  } = useQuery(ALL_REPORTS_QUERY);
  const [publish, { error, loading }] = useMutation(
    gql`
      mutation PUBLISH_REPORTS($data: [ReportUpdateArgs!]!) {
        updateReports(data: $data) {
          id
        }
      }
    `
  );
  async function publishReports() {
    if (allReports?.reports?.length) {
      const data = allReports.reports.map((report) => {
        return {
          data: {
            status: "PUBLISHED",
          },
          where: {
            id: report.id,
          },
        };
      });
      await publish({
        variables: {
          data: data,
        },
        refetchQueries: [{ query: ALL_REPORTS_QUERY }],
      });
    }
  }
  if (reportsLoading) {
    return (
      <PageContainer header={<Heading type="h3">Publish All Reports</Heading>}>
        loading...
      </PageContainer>
    );
  }
  if (error) {
    return (
      <PageContainer header={<Heading type="h3">Publish All Reports</Heading>}>
        <div css={errorCss.container}>
          <div>Something went wrong.</div>
          <div>{error.message}</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer header={<Heading type="h3">Publish All Reports</Heading>}>
      <button
        type="button"
        css={[buttonCss.base, buttonCss.disabled]}
        disabled={loading || allReports.reports?.length === 0}
        onClick={publishReports}
      >
        {loading ? <span>Publishing</span> : <span>Publish all Reports</span>}
      </button>
      {allReports.reports?.length === 0 ? (
        <p>All reports already published</p>
      ) : (
        <div>
          <p>There are {allReports.reports?.length} unpublished reports</p>
          <ul>
            {allReports.reports.map((report) => (
              <li key={report.id}>{report.title}</li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  );
}
