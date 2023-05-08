-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'United States',

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" SERIAL NOT NULL,
    "orgName" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserResultPolicy" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "resultDuosmiumIdRegExp" TEXT NOT NULL,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserResultPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrganizationResultPolicy" (
    "id" SERIAL NOT NULL,
    "orgName" TEXT NOT NULL,
    "resultDuosmiumIdRegExp" TEXT NOT NULL,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationResultPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserOrganizationPolicy" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "addMembers" BOOLEAN NOT NULL DEFAULT false,
    "removeMembers" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserOrganizationPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ResultToUserResultPolicy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_OrganizationToUser" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_OrganizationResultPolicyToResult" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Location_name_city_state_country_idx" ON "public"."Location"("name", "city", "state", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_city_state_country_key" ON "public"."Location"("name", "city", "state", "country");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgName_key" ON "public"."Organization"("orgName");

-- CreateIndex
CREATE INDEX "Organization_orgName_idx" ON "public"."Organization"("orgName");

-- CreateIndex
CREATE INDEX "UserResultPolicy_username_resultDuosmiumIdRegExp_idx" ON "public"."UserResultPolicy"("username", "resultDuosmiumIdRegExp");

-- CreateIndex
CREATE UNIQUE INDEX "UserResultPolicy_username_resultDuosmiumIdRegExp_key" ON "public"."UserResultPolicy"("username", "resultDuosmiumIdRegExp");

-- CreateIndex
CREATE INDEX "OrganizationResultPolicy_orgName_resultDuosmiumIdRegExp_idx" ON "public"."OrganizationResultPolicy"("orgName", "resultDuosmiumIdRegExp");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationResultPolicy_orgName_resultDuosmiumIdRegExp_key" ON "public"."OrganizationResultPolicy"("orgName", "resultDuosmiumIdRegExp");

-- CreateIndex
CREATE INDEX "UserOrganizationPolicy_username_orgName_idx" ON "public"."UserOrganizationPolicy"("username", "orgName");

-- CreateIndex
CREATE UNIQUE INDEX "UserOrganizationPolicy_username_orgName_key" ON "public"."UserOrganizationPolicy"("username", "orgName");

-- CreateIndex
CREATE UNIQUE INDEX "_ResultToUserResultPolicy_AB_unique" ON "public"."_ResultToUserResultPolicy"("A", "B");

-- CreateIndex
CREATE INDEX "_ResultToUserResultPolicy_B_index" ON "public"."_ResultToUserResultPolicy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToUser_AB_unique" ON "public"."_OrganizationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationToUser_B_index" ON "public"."_OrganizationToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationResultPolicyToResult_AB_unique" ON "public"."_OrganizationResultPolicyToResult"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationResultPolicyToResult_B_index" ON "public"."_OrganizationResultPolicyToResult"("B");

-- AddForeignKey
ALTER TABLE "public"."UserResultPolicy" ADD CONSTRAINT "UserResultPolicy_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationResultPolicy" ADD CONSTRAINT "OrganizationResultPolicy_orgName_fkey" FOREIGN KEY ("orgName") REFERENCES "public"."Organization"("orgName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserOrganizationPolicy" ADD CONSTRAINT "UserOrganizationPolicy_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserOrganizationPolicy" ADD CONSTRAINT "UserOrganizationPolicy_orgName_fkey" FOREIGN KEY ("orgName") REFERENCES "public"."Organization"("orgName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ResultToUserResultPolicy" ADD CONSTRAINT "_ResultToUserResultPolicy_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ResultToUserResultPolicy" ADD CONSTRAINT "_ResultToUserResultPolicy_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."UserResultPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OrganizationToUser" ADD CONSTRAINT "_OrganizationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OrganizationResultPolicyToResult" ADD CONSTRAINT "_OrganizationResultPolicyToResult_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."OrganizationResultPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OrganizationResultPolicyToResult" ADD CONSTRAINT "_OrganizationResultPolicyToResult_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
