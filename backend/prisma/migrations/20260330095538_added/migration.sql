-- CreateTable
CREATE TABLE "foodVids" (
    "id" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "foodPartnerId" TEXT NOT NULL,

    CONSTRAINT "foodVids_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "foodVids" ADD CONSTRAINT "foodVids_foodPartnerId_fkey" FOREIGN KEY ("foodPartnerId") REFERENCES "foodPartner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
