import { graphql } from "@keystone-6/core";
import { Context } from ".keystone/types";

export const uploadReports = graphql.field({
  type: graphql.list(graphql.Int),
  args: {
    data: graphql.arg({
      type: graphql.nonNull(
        graphql.list(
          graphql.nonNull(
            graphql.inputObject({
              name: "UploadReportsArgs",
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
                tags: graphql.arg({
                  type: graphql.nonNull(graphql.String),
                }),
              },
            }),
          ),
        ),
      ),
    }),
  },
  async resolve(source, { data }, context: Context) {
    const results: number[] = [];
    let row = 0;
    if (!context.session) {
      throw new Error("Unauthorized");
    }
    if (!context.session.data?.role?.canManageReports) {
      throw new Error("Unauthorized");
    }
    for (const datum of data) {
      let user = [];
      if (datum.cpso.trim() === "") {
        user = await context.db.User.findMany({
          where: {
            email: { equals: datum.email, mode: "insensitive" },
          },
        });
      } else {
        user = await context.db.User.findMany({
          where: {
            AND: [
              {
                email: { equals: datum.email, mode: "insensitive" },
                cpso: { equals: datum.cpso, mode: "insensitive" },
              },
            ],
          },
        });
      }

      const site = await context.db.Site.findMany({
        where: {
          siteID: { equals: datum.site, mode: "insensitive" },
        },
      });
      const report = await context.db.Report.findMany({
        where: {
          title: { equals: datum.title, mode: "insensitive" },
        },
      });

      const fetchedTags = new Set();
      if (datum.tags.trim() !== "") {
        const tags = datum.tags.split(" ");
        for (const tag of tags) {
          const result = await context.db.Tag.findMany({
            where: {
              name: { equals: tag, mode: "insensitive" },
            },
          });
          if (result.length) {
            fetchedTags.add({ id: result[0].id });
          } else {
            const newTag = await context.db.Tag.createOne({
              data: {
                name: tag,
              },
            });
            fetchedTags.add({ id: newTag.id });
          }
        }
      }
      const iterator1 = Array.from(fetchedTags);
      if (user.length) {
        if (site.length) {
          if (report.length === 0) {
            const result = await context.db.Report.createOne({
              data: {
                title: datum.title,
                site: {
                  connect: {
                    id: site[0].id,
                  },
                },
                assignedTo: {
                  connect: [
                    {
                      id: user[0].id,
                    },
                  ],
                },
                tags: {
                  connect: iterator1,
                },
              },
            }).catch(console.error);
            results.push(row);
          } else {
            await context.db.Report.updateOne({
              where: { id: report[0].id },
              data: {
                assignedTo: {
                  connect: [
                    {
                      id: user[0].id,
                    },
                  ],
                },
                tags: {
                  connect: iterator1,
                },
              },
            });
            results.push(row);
          }
        }
      } else {
        const userByCpso = await context.db.User.findOne({
          where: { cpso: datum.cpso.toLowerCase() },
        });
        const role = await context.db.Role.findMany({
          where: {
            name: { equals: datum.role, mode: "insensitive" },
          },
        });
        if (!userByCpso) {
          if (site.length && role.length) {
            const newUser = await context.db.User.createOne({
              data: {
                email: datum.email.toLowerCase(),
                name: datum.name,
                cpso: datum.cpso === "" ? null : datum.cpso,
                role: {
                  connect: {
                    id: role[0].id,
                  },
                },
                sites: {
                  connect: {
                    id: site[0].id,
                  },
                },
              },
            });
            if (report.length === 0) {
              const result = await context.db.Report.createOne({
                data: {
                  title: datum.title,
                  site: {
                    connect: {
                      id: site[0].id,
                    },
                  },
                  assignedTo: {
                    connect: [
                      {
                        id: newUser.id,
                      },
                    ],
                  },
                  tags: {
                    connect: iterator1,
                  },
                },
              }).catch(console.error);
              results.push(row);
            } else {
              await context.db.Report.updateOne({
                where: { id: report[0].id },
                data: {
                  assignedTo: {
                    connect: [
                      {
                        id: newUser.id,
                      },
                    ],
                  },
                  tags: {
                    connect: iterator1,
                  },
                },
              });
              results.push(row);
            }
          }
        }
      }
      row = row + 1;
    }

    return results;
  },
});
