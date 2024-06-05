import { config } from "@keystone-6/core";
import { statelessSessions } from "@keystone-6/core/session";
import { createAuth } from "@keystone-6/auth";
import type { KeystoneConfig } from "@keystone-6/core/types";
import "dotenv/config";
import { Report } from "./schemas/Report";
import { User } from "./schemas/User";
import { Role } from "./schemas/Role";
import { Tag } from "./schemas/Tag";
import { Site } from "./schemas/Site";
import { Policy } from "./schemas/Policy";
import { Faq } from "./schemas/Faq";
import { Banner } from "./schemas/Banner";
import { Request } from "./schemas/Request";
import { About } from "./schemas/About";

import { sendMagicAuthLink, sendPasswordResetEmail } from "./lib/mailAuth";
import { TypeInfo } from ".keystone/types";

const databaseURL = process.env.DATABASE_URL || "";

import { permissions } from "./access";
import { extendGraphqlSchema } from "./queries";
import { permissionsList } from "./schemas/fields";

const sessionSecret =
  process.env.COOKIE_SECRET || "this secret should only be used in testing";
const sessionMaxAge = 60 * 60 * 24 * 30; // 30 days
const sessionConfig = {
  maxAge: sessionMaxAge,
  secret: sessionSecret,
};

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    itemData: {
      /*
        This creates a related role with full permissions, so that when the first user signs in
        they have complete access to the system (without this, you couldn't do anything)
      */
      policyAccepted: true,
      role: {
        create: {
          name: "Admin",
          canReadReports: true,
          canManageReports: true,
          canSeeOtherUsers: true,
          canManageUsers: true,
          canManageRoles: true,
          canManageSites: true,
          canManageTags: true,
          canManagePolicy: true,
        },
      },
    },
    skipKeystoneWelcome: true,
  },
  passwordResetLink: {
    sendToken: async ({ identity, token, itemId, context }) => {
      const sudoContext = context.sudo();
      const user = await sudoContext.query.User.findOne({
        where: { id: itemId },
        query: "id email role { canManageUsers }",
      });
      if (user && user.role?.canManageUsers) {
        await sendPasswordResetEmail(token, identity);
      }
    },
    tokensValidForMins: 30,
  },
  magicAuthLink: {
    sendToken: async ({ identity, token }) => {
      // send the email
      await sendMagicAuthLink(token, identity);
    },
    tokensValidForMins: 30,
  },
  /* This loads the related role for the current user, including all permissions */
  sessionData: `
    name policyAccepted role {
      id
      name
      ${permissionsList.join(" ")}
    }`,
});

const db: KeystoneConfig<TypeInfo>["db"] = {
  provider: "postgresql",
  url: databaseURL,
};

const lists: KeystoneConfig<TypeInfo>["lists"] = {
  Report,
  User,
  Role,
  Tag,
  Site,
  Policy,
  Faq,
  Banner,
  Request,
  About,
};

export default withAuth(
  config({
    db,
    lists,
    // this will opt-out of device and project telemetry, for this project
    telemetry: false,
    ui: {
      /* Everyone who is signed and has an admin role in can access the Admin UI */
      isAccessAllowed: permissions.canManageReports,
    },
    session: statelessSessions(sessionConfig),
    server: {
      cors: { origin: process.env.CORS, credentials: true },
    },
    extendGraphqlSchema,
  }),
);
