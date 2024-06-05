import { list } from "@keystone-6/core";
import { allOperations } from "@keystone-6/core/access";
import { relationship, text } from "@keystone-6/core/fields";
import { permissionFields } from "./fields";
import { isAssignedRole, permissions, rules } from "../access";

export const Role = list({
  /*
    SPEC
    - [x] Block all public access
    - [x] Restrict edit access based on canManageRoles
    - [ ] Prevent users from deleting their own role
    - [ ] Add a pre-save hook that ensures some permissions are selected when others are:
        - [ ] when canEditOtherPeople is true, canSeeOtherPeople must be true
        - [ ] when canManagePeople is true, canEditOtherPeople and canSeeOtherPeople must be true
    - [ ] Extend the Admin UI with client-side validation based on the same set of rules
  */
  access: {
    operation: {
      ...allOperations(permissions.canManageRoles),
      query: isAssignedRole,
    },
    filter: {
      update: rules.canManageRoles,
      delete: rules.canManageRoles,
    },
  },
  ui: {
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    listView: {
      initialColumns: ["name", "assignedTo"],
    },
    itemView: {
      defaultFieldMode: (args) =>
        permissions.canManageRoles(args) ? "edit" : "read",
    },
  },
  fields: {
    /* The label of the role */
    name: text({ validation: { isRequired: true } }),
    ...permissionFields,
    /* This list of People assigned to this role */
    assignedTo: relationship({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
  },
});
