import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

/*
  The basic level of access to the system is being signed in as a valid user and have a valid. This gives you access
  to the Admin UI, access to your own User and Reports, and read access to roles.
*/
export const isSignedIn = ({ session }: ListAccessArgs) => {
  return !!session;
};

export const isAdmin = ({ session }: ListAccessArgs) => {
  return !!session && permissions.canManageReports({ session });
};

export const isAssignedRole = ({ session }: ListAccessArgs) => {
  return !!session?.data.role;
};

export const hasAcceptedPolicy = ({ session }: ListAccessArgs) => {
  return !!session?.data.policyAccepted;
};

/*
  Permissions are shorthand functions for checking that the current user's role has the specified
  permission boolean set to true
*/
const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ]),
);
// Permissions check if someone meets a criteria - yes or no.
export const permissions = {
  ...generatedPermissions,
};

/*
  Rules are logical functions that can be used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items
*/

export const rules = {
  canReadReports: ({ session }: ListAccessArgs) => {
    // 1. Not signed in? no assigned role? No reports.
    if (!isSignedIn({ session }) || !isAssignedRole({ session })) {
      return false;
    }
    // 2. Do they have the permission of canManageReports
    if (permissions.canManageReports({ session })) {
      return true;
    }
    // 3. If not, do they own this item and is it PUBLISHED and have canReadReports Permission
    if (permissions.canReadReports({ session })) {
      return {
        status: { equals: "PUBLISHED", mode: "insensitive" },
        assignedTo: { some: { id: { equals: session?.itemId } } },
      };
    }
    return false;
  },
  canRequestUpdate: ({ session }: ListAccessArgs) => {
    // 1. Not signed in? no assigned role? No reports.
    if (!isSignedIn({ session }) || !isAssignedRole({ session })) {
      return false;
    }
    // 2. Do they have the permission of canManageReports
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // 3. If not, do they own this item and is it PUBLISHED and have canReadReports Permission
    if (permissions.canReadReports({ session })) {
      return {
        user: { id: { equals: session?.itemId } },
      };
    }
    return false;
  },
  canManageReports: ({ session }: ListAccessArgs) => {
    // 1. Not signed in? no assigned role? No reports.
    if (!isSignedIn({ session }) || !isAssignedRole({ session })) {
      return false;
    }
    // 2. Do they have the permission of canManageReports
    if (permissions.canManageReports({ session })) {
      return true;
    }
    // 3. If not no one can create update delete reports
    return false;
  },
  canReadPeople: ({ session }: ListAccessArgs) => {
    if (!isSignedIn({ session }) || !isAssignedRole({ session })) {
      // No session? No people.
      return false;
    }
    // 2. Do they have the permission of canManageReports
    if (permissions.canManageUsers({ session })) {
      // Can see everyone
      return true;
    }
    // Can only see yourself
    return { id: { equals: session?.itemId } };
  },
  canManageUsers: ({ session }: ListAccessArgs) => {
    if (!isSignedIn({ session }) || !isAssignedRole({ session })) {
      // No session? No people.
      return false;
    }
    // 2. Do they have the permission of canManageReports
    if (permissions.canManageUsers({ session })) {
      // Can update everyone
      return true;
    }
    // Otherwise they may only update themselves!
    return {
      id: { equals: session?.itemId },
    };
  },
  canManageRoles: ({ session }: ListAccessArgs) => {
    if (!isSignedIn({ session }) || !isAssignedRole({ session })) {
      // No session? No role.
      return false;
    }
    // 2. Do they have the permission of canManageRoles
    if (permissions.canManageRoles({ session })) {
      // Can update all roles
      return true;
    }
    return false;
  },
};
