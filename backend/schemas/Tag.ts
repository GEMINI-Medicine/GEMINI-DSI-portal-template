import { list } from "@keystone-6/core";
import { allOperations } from "@keystone-6/core/access";
import { isAssignedRole, permissions } from "../access";
import { text } from "@keystone-6/core/fields";

export const Tag = list({
  access: {
    operation: {
      ...allOperations(permissions.canManageTags),
      query: isAssignedRole,
    },
  },
  ui: {
    hideCreate: (args) => !permissions.canManageTags(args),
    hideDelete: (args) => !permissions.canManageTags(args),
    listView: {
      initialColumns: ["name"],
    },
    itemView: {
      defaultFieldMode: (args) =>
        permissions.canManageTags(args) ? "edit" : "read",
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    description: text(),
  },
});
