-- CreateTable
CREATE TABLE "About" (
    "id" INTEGER NOT NULL,
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);
