/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Histogram` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Histogram` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Penalty` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Penalty` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Placing` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Placing` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationResultPolicy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOrganizationPolicy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserResultPolicy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrganizationResultPolicyToResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ResultToUserResultPolicy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationResultPolicy" DROP CONSTRAINT "OrganizationResultPolicy_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrganizationPolicy" DROP CONSTRAINT "UserOrganizationPolicy_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrganizationPolicy" DROP CONSTRAINT "UserOrganizationPolicy_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserResultPolicy" DROP CONSTRAINT "UserResultPolicy_userId_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationResultPolicyToResult" DROP CONSTRAINT "_OrganizationResultPolicyToResult_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationResultPolicyToResult" DROP CONSTRAINT "_OrganizationResultPolicyToResult_B_fkey";

-- DropForeignKey
ALTER TABLE "_ResultToUserResultPolicy" DROP CONSTRAINT "_ResultToUserResultPolicy_A_fkey";

-- DropForeignKey
ALTER TABLE "_ResultToUserResultPolicy" DROP CONSTRAINT "_ResultToUserResultPolicy_B_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Histogram" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Penalty" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Placing" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "official" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preliminary" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "Membership";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "OrganizationResultPolicy";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserOrganizationPolicy";

-- DropTable
DROP TABLE "UserResultPolicy";

-- DropTable
DROP TABLE "_OrganizationResultPolicyToResult";

-- DropTable
DROP TABLE "_ResultToUserResultPolicy";
