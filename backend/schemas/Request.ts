import { list } from "@keystone-6/core";
import { allOperations } from "@keystone-6/core/access";
import { isAssignedRole, permissions, rules } from "../access";
import { relationship, select, json, timestamp } from "@keystone-6/core/fields";

import {
  sendProfileUpdateNotification,
  sendRequestProfileUpdateEmail,
} from "../lib/mailUser";

export const Request = list({
  access: {
    operation: {
      ...allOperations(permissions.canManageUsers),
      query: isAssignedRole,
      create: () => true,
    },
    filter: {
      query: rules.canRequestUpdate,
      update: rules.canManageUsers,
      delete: rules.canManageUsers,
    },
  },
  fields: {
    type: select({
      options: [{ label: "Profile Update", value: "PROFILE" }],
      defaultValue: "PROFILE",
      validation: { isRequired: true },
      ui: { displayMode: "segmented-control" },
    }),
    updatedAt: timestamp({
      defaultValue: { kind: "now" },
      validation: { isRequired: true },
      db: { updatedAt: true },
    }),
    description: json({
      defaultValue: {
        name: "",
        email: "",
        cpso: "",
        sites: { id: "", name: "" },
      },
    }),
    user: relationship({ ref: "User.requests", many: false }),
    status: select({
      options: [
        { label: "Outstanding", value: "OUTSTANDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Declined", value: "DECLINED" },
      ],
      defaultValue: "OUTSTANDING",
      ui: { displayMode: "segmented-control" },
      hooks: {
        afterOperation: async ({ operation, item, context }) => {
          if (operation === "update" && item && item.status !== "OUTSTANDING") {
            if (item.status === "APPROVED") {
              const sites = item.description.sites.map((site) => {
                return { id: site.id };
              });

              await context.query.User.updateOne({
                where: { id: item.userId },
                data: {
                  name: item.description.name,
                  cpso: item.description.cpso,
                  email: item.description.email,
                  sites: {
                    set: sites,
                  },
                },
              });
            }

            sendProfileUpdateNotification(item.status, item.description.email);
          }
        },
      },
    }),
  },
  hooks: {
    afterOperation: async ({ operation, item, context }) => {
      if (operation === "create") {
        const user = await context.query.User.findOne({
          where: { id: item?.userId },
          query: "name email cpso sites { name } ",
        });

        sendRequestProfileUpdateEmail(
          {
            name: user.name,
            email: user.email,
            cpso: user.cpso,
            sites: user.sites.map((site) => site.name),
          },
          {
            name: item?.description?.name,
            email: item?.description?.email,
            cpso: item?.description?.cpso,
            sites: item?.description?.sites.map((site) => site.name),
          },
        );
      }
    },
  },
});
