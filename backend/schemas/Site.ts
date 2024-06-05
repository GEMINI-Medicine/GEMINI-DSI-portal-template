import { list } from "@keystone-6/core";
import { allOperations } from "@keystone-6/core/access";
import { permissions } from "../access";
import { text } from "@keystone-6/core/fields";

export const Site = list({
  access: {
    operation: {
      ...allOperations(permissions.canManageSites),
      query: () => true,
    },
  },
  ui: {
    hideCreate: (args) => !permissions.canManageSites(args),
    hideDelete: (args) => !permissions.canManageSites(args),
    listView: {
      initialColumns: ["name", "siteID"],
    },
    itemView: {
      defaultFieldMode: (args) =>
        permissions.canManageSites(args) ? "edit" : "read",
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    siteID: text({ isIndexed: "unique" }),
  },
});
