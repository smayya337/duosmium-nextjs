/*
  Warnings:

  - You are about to drop the column `tournamentId` on the `Result` table. All the data in the column will be lost.
  - Made the column `resultDuosmiumId` on table `Tournament` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Result" DROP CONSTRAINT "Result_tournamentId_fkey";

-- AlterTable
ALTER TABLE "public"."Result" DROP COLUMN "tournamentId";

-- AlterTable
ALTER TABLE "public"."Tournament" ALTER COLUMN "resultDuosmiumId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Tournament" ADD CONSTRAINT "Tournament_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;
