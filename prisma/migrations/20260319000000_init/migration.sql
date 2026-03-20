-- CreateTable
CREATE TABLE "RinDataset" (
    "id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "rin_score" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "user_scope" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RinDataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogMetadata" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT,

    CONSTRAINT "CatalogMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RinDataset_user_scope_idx" ON "RinDataset"("user_scope");
