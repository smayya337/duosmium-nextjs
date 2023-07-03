/*
  Warnings:

  - You are about to drop the column `location` on the `Result` table. All the data in the column will be lost.
  - Added the required column `locationName` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationState` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "location",
ADD COLUMN     "locationCity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "locationCountry" TEXT NOT NULL DEFAULT 'United States',
ADD COLUMN     "locationName" TEXT NOT NULL,
ADD COLUMN     "locationState" TEXT NOT NULL,
ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "fullTitle" DROP DEFAULT,
ALTER COLUMN "title" DROP DEFAULT,
ALTER COLUMN "shortTitle" DROP DEFAULT,
ALTER COLUMN "fullShortTitle" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'United States',
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_locationName_locationCity_locationState_locationCou_fkey" FOREIGN KEY ("locationName", "locationCity", "locationState", "locationCountry") REFERENCES "Location"("name", "city", "state", "country") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_name_city_state_country_fkey" FOREIGN KEY ("name", "city", "state", "country") REFERENCES "Location"("name", "city", "state", "country") ON DELETE RESTRICT ON UPDATE CASCADE;
