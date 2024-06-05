-- CreateTable
CREATE TABLE "Faq" (
    "id" INTEGER NOT NULL,
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);
