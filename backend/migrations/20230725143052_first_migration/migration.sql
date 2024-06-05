-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "status" TEXT DEFAULT 'DRAFT',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "site" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT,
    "cpso" TEXT NOT NULL DEFAULT '',
    "policyAccepted" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetIssuedAt" TIMESTAMP(3),
    "passwordResetRedeemedAt" TIMESTAMP(3),
    "magicAuthToken" TEXT,
    "magicAuthIssuedAt" TIMESTAMP(3),
    "magicAuthRedeemedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "canReadReports" BOOLEAN NOT NULL DEFAULT false,
    "canManageReports" BOOLEAN NOT NULL DEFAULT false,
    "canSeeOtherUsers" BOOLEAN NOT NULL DEFAULT false,
    "canManageUsers" BOOLEAN NOT NULL DEFAULT false,
    "canManageRoles" BOOLEAN NOT NULL DEFAULT false,
    "canManageSites" BOOLEAN NOT NULL DEFAULT false,
    "canManageTags" BOOLEAN NOT NULL DEFAULT false,
    "canManagePolicy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "siteID" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" INTEGER NOT NULL,
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Report_assignedTo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Report_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_User_sites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_title_key" ON "Report"("title");

-- CreateIndex
CREATE INDEX "Report_site_idx" ON "Report"("site");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpso_key" ON "User"("cpso");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Site_siteID_key" ON "Site"("siteID");

-- CreateIndex
CREATE UNIQUE INDEX "_Report_assignedTo_AB_unique" ON "_Report_assignedTo"("A", "B");

-- CreateIndex
CREATE INDEX "_Report_assignedTo_B_index" ON "_Report_assignedTo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Report_tags_AB_unique" ON "_Report_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Report_tags_B_index" ON "_Report_tags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_User_sites_AB_unique" ON "_User_sites"("A", "B");

-- CreateIndex
CREATE INDEX "_User_sites_B_index" ON "_User_sites"("B");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_site_fkey" FOREIGN KEY ("site") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Report_assignedTo" ADD CONSTRAINT "_Report_assignedTo_A_fkey" FOREIGN KEY ("A") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Report_assignedTo" ADD CONSTRAINT "_Report_assignedTo_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Report_tags" ADD CONSTRAINT "_Report_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Report_tags" ADD CONSTRAINT "_Report_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_User_sites" ADD CONSTRAINT "_User_sites_A_fkey" FOREIGN KEY ("A") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_User_sites" ADD CONSTRAINT "_User_sites_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
