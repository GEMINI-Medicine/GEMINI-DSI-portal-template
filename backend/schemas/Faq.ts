import { list } from "@keystone-6/core";
import { allOperations } from "@keystone-6/core/access";
import { document } from "@keystone-6/fields-document";
import { permissions } from "../access";
import { componentBlocks } from "../component-blocks";

export const Faq = list({
  access: {
    operation: {
      ...allOperations(permissions.canManagePolicy),
      query: () => true,
    },
  },
  isSingleton: true,
  fields: {
    content: document({
      ui: {
        views: "./component-blocks",
      },
      componentBlocks,
    }),
  },
});
