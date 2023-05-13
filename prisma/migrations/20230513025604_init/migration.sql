/*
  Warnings:

  - Added the required column `updatedAt` to the `OrganizationResultPolicy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserOrganizationPolicy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserResultPolicy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "OrganizationResultPolicy" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserOrganizationPolicy" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserResultPolicy" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
