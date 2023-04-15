/*
  Warnings:

  - You are about to drop the column `resultId` on the `Team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Team" DROP CONSTRAINT "Team_resultId_fkey";

-- AlterTable
ALTER TABLE "public"."Team" DROP COLUMN "resultId";

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE RESTRICT ON UPDATE CASCADE;
