/*
  Warnings:

  - You are about to drop the column `orgId` on the `OrganizationResultPolicy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId,resultDuosmiumIdRegExp]` on the table `OrganizationResultPolicy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `OrganizationResultPolicy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrganizationResultPolicy" DROP CONSTRAINT "OrganizationResultPolicy_orgId_fkey";

-- DropIndex
DROP INDEX "OrganizationResultPolicy_orgId_resultDuosmiumIdRegExp_idx";

-- DropIndex
DROP INDEX "OrganizationResultPolicy_orgId_resultDuosmiumIdRegExp_key";

-- AlterTable
ALTER TABLE "OrganizationResultPolicy" DROP COLUMN "orgId",
ADD COLUMN     "organizationId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "OrganizationResultPolicy_organizationId_resultDuosmiumIdReg_idx" ON "OrganizationResultPolicy"("organizationId", "resultDuosmiumIdRegExp");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationResultPolicy_organizationId_resultDuosmiumIdReg_key" ON "OrganizationResultPolicy"("organizationId", "resultDuosmiumIdRegExp");

-- AddForeignKey
ALTER TABLE "OrganizationResultPolicy" ADD CONSTRAINT "OrganizationResultPolicy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
