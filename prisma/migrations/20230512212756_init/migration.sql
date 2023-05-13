/*
  Warnings:

  - You are about to drop the column `create_approval` on the `OrganizationResultPolicy` table. All the data in the column will be lost.
  - You are about to drop the column `delete_approval` on the `OrganizationResultPolicy` table. All the data in the column will be lost.
  - You are about to drop the column `read_approval` on the `OrganizationResultPolicy` table. All the data in the column will be lost.
  - You are about to drop the column `update_approval` on the `OrganizationResultPolicy` table. All the data in the column will be lost.
  - You are about to drop the column `create_approval` on the `UserResultPolicy` table. All the data in the column will be lost.
  - You are about to drop the column `delete_approval` on the `UserResultPolicy` table. All the data in the column will be lost.
  - You are about to drop the column `read_approval` on the `UserResultPolicy` table. All the data in the column will be lost.
  - You are about to drop the column `update_approval` on the `UserResultPolicy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrganizationResultPolicy" DROP COLUMN "create_approval",
DROP COLUMN "delete_approval",
DROP COLUMN "read_approval",
DROP COLUMN "update_approval",
ADD COLUMN     "approve" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deleteApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updateApproval" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserResultPolicy" DROP COLUMN "create_approval",
DROP COLUMN "delete_approval",
DROP COLUMN "read_approval",
DROP COLUMN "update_approval",
ADD COLUMN     "approve" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deleteApproval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updateApproval" BOOLEAN NOT NULL DEFAULT false;
