-- CreateTable
CREATE TABLE "Banner" (
    "id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "individualReportVersion" TEXT NOT NULL DEFAULT '',
    "groupReportVersion" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);
