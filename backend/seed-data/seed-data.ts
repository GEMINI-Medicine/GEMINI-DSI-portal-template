import { sites, tags, roles } from "./data";
import { Context } from ".keystone/types";
import config from "../keystone";
import * as PrismaModule from "@prisma/client";
import { getContext } from "@keystone-6/core/context";

export async function insertSeedData() {
  const context: Context = getContext(config, PrismaModule).sudo();

  console.log(`🌱 Inserting Seed Data: ${sites.length} Sites`);

  await context.query.Site.createMany({
    data: sites,
  });

  console.log(`✅ Seed Data Inserted: ${sites.length} Sites`);

  console.log(`🌱 Inserting Seed Data: ${tags.length} Tags`);

  await context.query.Tag.createMany({
    data: tags,
  });

  console.log(`✅ Seed Data Inserted: ${tags.length} Tags`);

  console.log(`🌱 Inserting Seed Data: ${roles.length} Roles`);

  await context.query.Role.createMany({
    data: roles,
  });

  console.log(`✅ Seed Data Inserted: ${roles.length} Roles`);

  console.log(
    `👋 Please start the process with \`yarn dev\` or \`npm run dev\``,
  );
  process.exit();
}

insertSeedData();
