-- DropForeignKey
ALTER TABLE "public"."Team" DROP CONSTRAINT "Team_resultDuosmiumId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;
