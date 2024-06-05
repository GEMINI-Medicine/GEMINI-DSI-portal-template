import { list } from "@keystone-6/core";
import { allOperations } from "@keystone-6/core/access";
import { isAssignedRole, permissions, rules } from "../access";
import {
  checkbox,
  password,
  relationship,
  text,
} from "@keystone-6/core/fields";
import {
  sendAccessGrantedEmail,
  sendAccountCreatedEmail,
  sendRegistrationConfirmationEmail,
  sendUserSignedUpEmailToAdmin,
} from "../lib/mailUser";
import { UserData } from "../lib/types";

export const User = list({
  /*
    SPEC
    - [x] Block all public access except create
    - [x] Restrict list read based on canReadPeople
    - [x] Restrict list update based on canManageUsers
    - [x] Restrict list delete based on canManageUsers
    - [x] Restrict role field update based on canManageUsers
    - [x] Restrict password field update based on canManageUsers
  */
  access: {
    operation: {
      ...allOperations(isAssignedRole),
      create: () => true,
    },
    filter: {
      query: rules.canReadPeople,
      update: rules.canManageUsers,
      delete: rules.canManageUsers,
    },
  },
  ui: {
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
    listView: {
      initialColumns: ["name", "role", "reports"],
    },
    itemView: {
      defaultFieldMode: ({ session }) => {
        // People with canManageUsers can always edit people
        if (session.data.role?.canManageUsers) return "edit";
        // Otherwise, default all fields to read mode
        return "read";
      },
    },
  },
  fields: {
    /* The name of the user */
    name: text({ validation: { isRequired: true } }),
    /* The email of the user, used to sign in */
    email: text({ isIndexed: "unique", validation: { isRequired: true } }),
    /* The password of the user */
    password: password({
      validation: { isRequired: false },
      access: {
        read: ({ session }) => permissions.canManageUsers({ session }),
        create: ({ session }) => permissions.canManageUsers({ session }),
        update: ({ session }) => permissions.canManageUsers({ session }),
      },
    }),
    cpso: text({ isIndexed: "unique", db: { isNullable: true } }),
    /* If the user agreed to the policy or not*/
    policyAccepted: checkbox({
      defaultValue: false,
    }),
    /* The role assigned to the user */
    role: relationship({
      ref: "Role.assignedTo",
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
      ui: {
        itemView: {
          fieldMode: (args) =>
            permissions.canManageUsers(args) ? "edit" : "read",
        },
      },
      hooks: {
        afterOperation: ({ operation, originalItem, item }) => {
          if (operation === "create" || operation === "update") {
            if (originalItem?.roleId === null && item?.roleId !== null)
              sendAccessGrantedEmail(item.email);
          }
        },
      },
    }),
    /* Reports assigned to the user */
    reports: relationship({
      ref: "Report.assignedTo",
      many: true,
      access: {
        // Only people with canManageUsers can set this field when creating other users
        create: permissions.canManageUsers,
        // You can only update this field with canManageUsers
        update: permissions.canManageUsers,
      },
      ui: {
        createView: {
          // Note you can only see the create view if you can manage people, so we just need to
          // check the canManageUsers permission here
          fieldMode: (args) =>
            permissions.canManageUsers(args) ? "edit" : "hidden",
        },
        // Todo lists can be potentially quite large, so it's impractical to edit this field in
        // the item view. Always set it to read mode.
        itemView: { fieldMode: "read" },
      },
    }),
    sites: relationship({
      ref: "Site",
      many: true,
    }),
    requests: relationship({ ref: "Request.user", many: true }),
  },
  hooks: {
    afterOperation: ({ operation, item }) => {
      if (operation === "create") {
        const newUser: UserData = {
          name: item?.name || "",
          email: item?.email || "",
          cpso: item?.cpso || null,
        };
        if (item?.roleId) {
          // assumes the account was created manually via
          // batch upload with a role assigned
          sendAccountCreatedEmail(item?.email);
        } else {
          sendRegistrationConfirmationEmail(newUser);
          sendUserSignedUpEmailToAdmin(newUser);
        }
      }
    },
  },
});
