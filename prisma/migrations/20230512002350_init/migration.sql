-- AlterTable
ALTER TABLE "OrganizationResultPolicy" ADD COLUMN     "create_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "delete_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "read_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "update_approval" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserResultPolicy" ADD COLUMN     "create_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "delete_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "read_approval" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "update_approval" BOOLEAN NOT NULL DEFAULT false;
