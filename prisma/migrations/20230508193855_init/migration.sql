-- CreateTable
CREATE TABLE "Result" (
    "duosmiumId" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("duosmiumId")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("resultDuosmiumId")
);

-- CreateTable
CREATE TABLE "Team" (
    "number" INTEGER NOT NULL,
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("resultDuosmiumId","number")
);

-- CreateTable
CREATE TABLE "Event" (
    "name" TEXT NOT NULL,
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("resultDuosmiumId","name")
);

-- CreateTable
CREATE TABLE "Track" (
    "name" TEXT NOT NULL,
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("resultDuosmiumId","name")
);

-- CreateTable
CREATE TABLE "Placing" (
    "eventName" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Placing_pkey" PRIMARY KEY ("resultDuosmiumId","eventName","teamNumber")
);

-- CreateTable
CREATE TABLE "Penalty" (
    "teamNumber" INTEGER NOT NULL,
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Penalty_pkey" PRIMARY KEY ("resultDuosmiumId","teamNumber")
);

-- CreateTable
CREATE TABLE "Histogram" (
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Histogram_pkey" PRIMARY KEY ("resultDuosmiumId")
);

-- CreateTable
CREATE TABLE "Location" (
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'United States',

    CONSTRAINT "Location_pkey" PRIMARY KEY ("name","city","state","country")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "userId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("userId","organizationId")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orgName" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserResultPolicy" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "resultDuosmiumIdRegExp" TEXT NOT NULL,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserResultPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationResultPolicy" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orgId" UUID NOT NULL,
    "resultDuosmiumIdRegExp" TEXT NOT NULL,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationResultPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOrganizationPolicy" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "addMembers" BOOLEAN NOT NULL DEFAULT false,
    "removeMembers" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserOrganizationPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ResultToUserResultPolicy" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_OrganizationResultPolicyToResult" (
    "A" UUID NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Result_duosmiumId_idx" ON "Result"("duosmiumId");

-- CreateIndex
CREATE INDEX "Tournament_resultDuosmiumId_idx" ON "Tournament"("resultDuosmiumId");

-- CreateIndex
CREATE INDEX "Team_resultDuosmiumId_number_idx" ON "Team"("resultDuosmiumId", "number");

-- CreateIndex
CREATE INDEX "Event_resultDuosmiumId_name_idx" ON "Event"("resultDuosmiumId", "name");

-- CreateIndex
CREATE INDEX "Track_resultDuosmiumId_name_idx" ON "Track"("resultDuosmiumId", "name");

-- CreateIndex
CREATE INDEX "Placing_resultDuosmiumId_eventName_teamNumber_idx" ON "Placing"("resultDuosmiumId", "eventName", "teamNumber");

-- CreateIndex
CREATE INDEX "Penalty_resultDuosmiumId_teamNumber_idx" ON "Penalty"("resultDuosmiumId", "teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Histogram_resultDuosmiumId_key" ON "Histogram"("resultDuosmiumId");

-- CreateIndex
CREATE INDEX "Location_name_city_state_country_idx" ON "Location"("name", "city", "state", "country");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "Membership_userId_organizationId_idx" ON "Membership"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgName_key" ON "Organization"("orgName");

-- CreateIndex
CREATE INDEX "Organization_orgName_idx" ON "Organization"("orgName");

-- CreateIndex
CREATE INDEX "UserResultPolicy_userId_resultDuosmiumIdRegExp_idx" ON "UserResultPolicy"("userId", "resultDuosmiumIdRegExp");

-- CreateIndex
CREATE UNIQUE INDEX "UserResultPolicy_userId_resultDuosmiumIdRegExp_key" ON "UserResultPolicy"("userId", "resultDuosmiumIdRegExp");

-- CreateIndex
CREATE INDEX "OrganizationResultPolicy_orgId_resultDuosmiumIdRegExp_idx" ON "OrganizationResultPolicy"("orgId", "resultDuosmiumIdRegExp");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationResultPolicy_orgId_resultDuosmiumIdRegExp_key" ON "OrganizationResultPolicy"("orgId", "resultDuosmiumIdRegExp");

-- CreateIndex
CREATE INDEX "UserOrganizationPolicy_userId_organizationId_idx" ON "UserOrganizationPolicy"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOrganizationPolicy_userId_organizationId_key" ON "UserOrganizationPolicy"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "_ResultToUserResultPolicy_AB_unique" ON "_ResultToUserResultPolicy"("A", "B");

-- CreateIndex
CREATE INDEX "_ResultToUserResultPolicy_B_index" ON "_ResultToUserResultPolicy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationResultPolicyToResult_AB_unique" ON "_OrganizationResultPolicyToResult"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationResultPolicyToResult_B_index" ON "_OrganizationResultPolicyToResult"("B");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_resultDuosmiumId_eventName_fkey" FOREIGN KEY ("resultDuosmiumId", "eventName") REFERENCES "Event"("resultDuosmiumId", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_resultDuosmiumId_teamNumber_fkey" FOREIGN KEY ("resultDuosmiumId", "teamNumber") REFERENCES "Team"("resultDuosmiumId", "number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_resultDuosmiumId_teamNumber_fkey" FOREIGN KEY ("resultDuosmiumId", "teamNumber") REFERENCES "Team"("resultDuosmiumId", "number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Histogram" ADD CONSTRAINT "Histogram_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResultPolicy" ADD CONSTRAINT "UserResultPolicy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationResultPolicy" ADD CONSTRAINT "OrganizationResultPolicy_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganizationPolicy" ADD CONSTRAINT "UserOrganizationPolicy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganizationPolicy" ADD CONSTRAINT "UserOrganizationPolicy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResultToUserResultPolicy" ADD CONSTRAINT "_ResultToUserResultPolicy_A_fkey" FOREIGN KEY ("A") REFERENCES "Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResultToUserResultPolicy" ADD CONSTRAINT "_ResultToUserResultPolicy_B_fkey" FOREIGN KEY ("B") REFERENCES "UserResultPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationResultPolicyToResult" ADD CONSTRAINT "_OrganizationResultPolicyToResult_A_fkey" FOREIGN KEY ("A") REFERENCES "OrganizationResultPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationResultPolicyToResult" ADD CONSTRAINT "_OrganizationResultPolicyToResult_B_fkey" FOREIGN KEY ("B") REFERENCES "Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;
