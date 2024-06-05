import { graphql } from "@keystone-6/core";
import { Context } from ".keystone/types";

const Validator = graphql.list(
  graphql.object<{
    email: string;
    siteID: string;
    cpso: string;
    title: string;
    role: string;
  }>()({
    name: "Validator",
    fields: {
      email: graphql.field({ type: graphql.String }),
      userExists: graphql.field({
        type: graphql.Boolean,
        async resolve({ email }, args, context: Context) {
          const count = await context.query.User.count({
            where: { email: { equals: email, mode: "insensitive" } },
          });
          return count === 1;
        },
      }),
      cpsoExists: graphql.field({
        type: graphql.Boolean,
        async resolve({ email, cpso }, args, context: Context) {
          const user = await context.query.User.count({
            where: { email: { equals: email, mode: "insensitive" } },
          });
          const count = await context.query.User.count({
            where: { cpso: { equals: cpso, mode: "insensitive" } },
          });
          return user === 0 && count === 1;
        },
      }),
      cpsoMatches: graphql.field({
        type: graphql.Boolean,
        async resolve({ email, cpso }, args, context: Context) {
          if (cpso === "") {
            const user = await context.query.User.findOne({
              where: { email: email },
              query: "cpso",
            });
            return user?.cpso === null;
          }
          const count = await context.query.User.count({
            where: {
              AND: [
                {
                  email: { equals: email, mode: "insensitive" },
                  cpso: {
                    equals: cpso,
                    mode: "insensitive",
                  },
                },
              ],
            },
          });
          return count === 1;
        },
      }),
      siteExists: graphql.field({
        type: graphql.Boolean,
        async resolve({ siteID }, args, context: Context) {
          const count = await context.query.Site.count({
            where: { siteID: { equals: siteID, mode: "insensitive" } },
          });

          return count === 1;
        },
      }),
      roleExists: graphql.field({
        type: graphql.Boolean,
        async resolve({ role }, args, context: Context) {
          const count = await context.query.Role.count({
            where: { name: { equals: role, mode: "insensitive" } },
          });

          return count === 1;
        },
      }),
      roleMatches: graphql.field({
        type: graphql.Boolean,
        async resolve({ role, email }, args, context: Context) {
          const user = await context.query.User.findMany({
            where: {
              AND: [
                {
                  email: {
                    equals: email,
                    mode: "insensitive",
                  },
                  role: {
                    name: {
                      equals: role,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            },
          });
          return user.length > 0;
        },
      }),
      userAssigned: graphql.field({
        type: graphql.String,
        async resolve({ email, title }, args, context: Context) {
          const report = await context.query.Report.findMany({
            where: {
              title: { equals: title, mode: "insensitive" },
              assignedTo: {
                some: { email: { equals: email, mode: "insensitive" } },
              },
            },
          });
          if (report.length) {
            return report[0].id;
          }
          return "";
        },
      }),
    },
  }),
);

export const validateCSV = graphql.field({
  type: Validator,
  args: {
    data: graphql.arg({
      type: graphql.nonNull(
        graphql.list(
          graphql.nonNull(
            graphql.inputObject({
              name: "ValidateCSVArgs",
              fields: {
                cpso: graphql.arg({
                  type: graphql.nonNull(graphql.String),
                }),
                name: graphql.arg({
                  type: graphql.nonNull(graphql.String),
                }),
                email: graphql.arg({
                  type: graphql.nonNull(graphql.String),
                }),
                role: graphql.arg({
                  type: graphql.nonNull(graphql.String),
                }),
                title: graphql.arg({
                  type: graphql.nonNull(graphql.String),
                }),
                site: graphql.arg({
                  type: graphql.nonNull(graphql.String),
                }),
              },
            }),
          ),
        ),
      ),
    }),
  },
  resolve(_, { data }, context: Context) {
    if (!context.session) {
      throw new Error("Unauthorized");
    }
    if (!context.session.data?.role?.canManageReports) {
      throw new Error("Unauthorized");
    }
    return data.map((datum) => {
      return {
        email: datum.email,
        siteID: datum.site,
        cpso: datum.cpso,
        title: datum.title,
        role: datum.role,
      };
    });
  },
});
