import { graphql } from "@keystone-6/core";
import { Context } from ".keystone/types";

const reportVersions = graphql.object<{
  statusCode: number;
  error?: string;
  irp: string[];
  grp: string[];
}>()({
  name: "ReportVersions",
  fields: {
    statusCode: graphql.field({ type: graphql.Int }),
    error: graphql.field({ type: graphql.String }),
    irp: graphql.field({ type: graphql.list(graphql.String) }),
    grp: graphql.field({ type: graphql.list(graphql.String) }),
  },
});

function getReportsByType(reports, type) {
  const regex = /[Vv](\d+)./;
  return reports.reduce((result, report) => {
    const isMatchingReportType = report.tags.find(
      (tag) => tag.name.toLowerCase() === type,
    );
    if (isMatchingReportType) {
      const matches = report.title.match(regex);
      if (matches && !result.includes(matches[1])) {
        result.push(matches[1]);
      }
    }
    return result;
  }, []);
}

export const versions = graphql.field({
  type: reportVersions,
  async resolve(source, args, context: Context) {
    try {
      if (!context.session) {
        return {
          statusCode: 500,
          error: "An error occurred: Unauthorized",
          irp: [],
          grp: [],
        };
      }
      const sudoContext = context.sudo();

      // check only published
      const reports = await sudoContext.query.Report.findMany({
        where: { status: { equals: "PUBLISHED", mode: "insensitive" } },
        orderBy: { updatedAt: "desc" },
        query: "title tags { name }",
      });

      const irpReportsVersions = getReportsByType(reports, "irp");
      const grpReportsVersions = getReportsByType(reports, "grp");

      return {
        statusCode: 200,
        irp: irpReportsVersions.sort((a, b) => parseInt(b) - parseInt(a)),
        grp: grpReportsVersions.sort((a, b) => parseInt(b) - parseInt(a)),
      };
    } catch (error) {
      return {
        statusCode: 500,
        error: "An error occurred: " + error.message,
        irp: [],
        grp: [],
      };
    }
  },
});
