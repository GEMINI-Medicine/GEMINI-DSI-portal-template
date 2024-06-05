import { list } from "@keystone-6/core";
import { allOperations } from "@keystone-6/core/access";
import { relationship, text, timestamp, select } from "@keystone-6/core/fields";
import { isAssignedRole, permissions, rules } from "../access";
import { sendReportPublished } from "../lib/mailReport";

export const Report = list({
  /*
    SPEC
    - [x] Block all public access
    - [x] Restrict list create based on canManageReports
    - [x] Restrict list read based on canReadReports
      - [x] Users without canManageReports can only see their own Reports
    - [x] Restrict list update / delete based on canManageReports
    - [ ] Validate assignment on create based on canManageReports
      - [ ] Users without canManageReports can only create Reports assigned to themselves
      - [ ] Users with canManageReports can create and assign Reports to anyone
  */
  access: {
    operation: {
      ...allOperations(isAssignedRole),
    },
    filter: {
      query: rules.canReadReports,
      update: rules.canManageReports,
      delete: rules.canManageReports,
    },
  },
  ui: {
    hideCreate: (args) => !permissions.canManageReports(args),
    listView: {
      initialColumns: ["title", "status", "assignedTo"],
    },
  },
  fields: {
    /* The label of the report */
    title: text({ isIndexed: "unique", validation: { isRequired: true } }),
    /* Whether the report is a draft or is published */
    status: select({
      options: [
        { label: "Published", value: "PUBLISHED" },
        { label: "Draft", value: "DRAFT" },
      ],
      defaultValue: "DRAFT",
      ui: { displayMode: "segmented-control" },
    }),
    /* */
    updatedAt: timestamp({
      defaultValue: { kind: "now" },
      validation: { isRequired: true },
      db: { updatedAt: true },
    }),
    /* The user the report is assigned to */
    assignedTo: relationship({
      ref: "User.reports",
      many: true,
      ui: {
        createView: {
          fieldMode: (args) =>
            permissions.canManageReports(args) ? "edit" : "hidden",
        },
        itemView: {
          fieldMode: (args) =>
            permissions.canManageReports(args) ? "edit" : "read",
        },
      },
    }),
    tags: relationship({
      ref: "Tag",
      many: true,
    }),
    site: relationship({
      ref: "Site",
    }),
  },
  hooks: {
    afterOperation: async ({ operation, item, context, originalItem }) => {
      if (
        operation === "update" &&
        originalItem.status === "DRAFT" &&
        item.status === "PUBLISHED"
      ) {
        const report = await context.prisma.report.findUnique({
          where: {
            id: item.id,
          },
          include: {
            assignedTo: {
              select: {
                email: true,
              },
            },
            tags: {
              select: {
                name: true,
              },
            },
            site: {
              select: {
                name: true,
              },
            },
          },
        });

        const isHistorical = report.tags.find(
          (tag) => tag.name.toLowerCase() === "noemail",
        );

        if (!isHistorical) {
          sendReportPublished(
            item.title,
            report.site,
            report.tags,
            report.assignedTo,
          );
        }
      }
    },
  },
});
