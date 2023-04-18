/*
  Warnings:

  - Made the column `logo` on table `Result` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `Result` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Result" ALTER COLUMN "logo" SET NOT NULL,
ALTER COLUMN "color" SET NOT NULL;
