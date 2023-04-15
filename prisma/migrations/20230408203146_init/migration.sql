/*
  Warnings:

  - You are about to drop the column `type` on the `Histogram` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Histogram` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Team" DROP CONSTRAINT "Team_resultDuosmiumId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tournament" DROP CONSTRAINT "Tournament_resultDuosmiumId_fkey";

-- AlterTable
ALTER TABLE "public"."Histogram" DROP COLUMN "type",
DROP COLUMN "url";

-- AlterTable
ALTER TABLE "public"."Result" ADD COLUMN     "tournamentId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "resultId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Result" ADD CONSTRAINT "Result_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "public"."Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "public"."Result"("id") ON DELETE SET NULL ON UPDATE CASCADE;
