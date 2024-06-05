import { checkbox } from "@keystone-6/core/fields";

export const permissionFields = {
  /* Read Reports means:
  - User can read published reports assigned to them  */
  canReadReports: checkbox({
    defaultValue: false,
    label: "User can read published reports assigned to them",
  }),
  /* Manage Reports means:
    - User can Update and delete any report */
  canManageReports: checkbox({
    defaultValue: false,
    label: "User can Update and delete any report",
  }),
  /* See Other Users means:
    - User can query other users */
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: "User can query other users",
  }),
  /* Manager Other Users means:
    - User can Edit other users */
  canManageUsers: checkbox({
    defaultValue: false,
    label: "User can Edit other users",
  }),
  /* Manager Roles means:
    - User can CRUD roles */
  canManageRoles: checkbox({
    defaultValue: false,
    label: "User can CRUD roles",
  }),
  /* Manager Sites means:
    - User can CRUD sites */
  canManageSites: checkbox({
    defaultValue: false,
    label: "User can CRUD sites",
  }),
  /* Manage Tags means:
    - User can CRUD tags */
  canManageTags: checkbox({
    defaultValue: false,
    label: "User can CRUD tags",
  }),
  /* Manage Policy means:
    - User can CRUD policy */
  canManagePolicy: checkbox({
    defaultValue: false,
    label: "User can CRUD policy",
  }),
};

export type Permission = keyof typeof permissionFields;

export const permissionsList: Permission[] = Object.keys(
  permissionFields,
) as Permission[];
