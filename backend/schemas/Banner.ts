import { list } from "@keystone-6/core";
import { allOperations } from "@keystone-6/core/access";
import { permissions } from "../access";
import { text, timestamp } from "@keystone-6/core/fields";

export const Banner = list({
  access: {
    operation: {
      ...allOperations(permissions.canManagePolicy),
      query: () => true,
    },
  },
  isSingleton: true,
  fields: {
    date: timestamp({
      validation: { isRequired: true },
    }),
    individualReportVersion: text({ validation: { isRequired: true } }),
    groupReportVersion: text({ validation: { isRequired: true } }),
  },
});
