-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PROFILE',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" JSONB DEFAULT '{"name":"","email":"","cpso":"","sites":{"id":"","name":""}}',
    "user" TEXT,
    "status" TEXT DEFAULT 'OUTSTANDING',

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Request_user_idx" ON "Request"("user");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
