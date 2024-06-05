import {
  SiteCreateInput,
  TagCreateInput,
  RoleCreateInput,
} from ".keystone/types";

export const tags: TagCreateInput[] = [
  {
    name: "IRP",
    description: "Individual Report",
  },
  {
    name: "GRP",
    description: "Group Report",
  },
  {
    name: "NOEMAIL",
    description:
      "Does not send an email to the assigned user when report is published",
  },
];

export const roles: RoleCreateInput[] = [
  {
    name: "Viewer",
    canReadReports: true,
  },
];

export const sites: SiteCreateInput[] = [
  {
    name: "Test Hospital",
    siteID: "TEST",
  },
];
