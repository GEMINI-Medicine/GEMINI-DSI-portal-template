import { list } from "@keystone-6/core";
import { allOperations } from "@keystone-6/core/access";
import { document } from "@keystone-6/fields-document";
import { permissions } from "../access";

export const Policy = list({
  access: {
    operation: {
      ...allOperations(permissions.canManagePolicy),
      query: () => true,
    },
  },
  isSingleton: true,
  fields: {
    content: document({
      formatting: true,
      dividers: true,
      links: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
      ],
    }),
  },
  hooks: {
    afterOperation: async ({ operation, context }) => {
      if (operation === "update") {
        // reset policy updated field for all users
        await context.prisma.user.updateMany({
          data: {
            policyAccepted: false,
          },
        });
      }
    },
  },
});
