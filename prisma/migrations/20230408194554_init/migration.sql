-- CreateTable
CREATE TABLE "public"."Result" (
    "id" SERIAL NOT NULL,
    "duosmiumId" TEXT NOT NULL,
    "logo" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tournament" (
    "id" SERIAL NOT NULL,
    "resultDuosmiumId" TEXT,
    "data" JSONB NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Track" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Placing" (
    "id" SERIAL NOT NULL,
    "eventName" TEXT NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Placing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Penalty" (
    "id" SERIAL NOT NULL,
    "teamNumber" INTEGER NOT NULL,
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Penalty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Histogram" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "resultDuosmiumId" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Histogram_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Result_duosmiumId_key" ON "public"."Result"("duosmiumId");

-- CreateIndex
CREATE INDEX "Result_duosmiumId_idx" ON "public"."Result"("duosmiumId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_resultDuosmiumId_key" ON "public"."Tournament"("resultDuosmiumId");

-- CreateIndex
CREATE INDEX "Tournament_resultDuosmiumId_idx" ON "public"."Tournament"("resultDuosmiumId" ASC);

-- CreateIndex
CREATE INDEX "Team_resultDuosmiumId_number_idx" ON "public"."Team"("resultDuosmiumId" ASC, "number" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Team_resultDuosmiumId_number_key" ON "public"."Team"("resultDuosmiumId", "number");

-- CreateIndex
CREATE INDEX "Event_resultDuosmiumId_name_idx" ON "public"."Event"("resultDuosmiumId" ASC, "name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Event_resultDuosmiumId_name_key" ON "public"."Event"("resultDuosmiumId", "name");

-- CreateIndex
CREATE INDEX "Track_resultDuosmiumId_name_idx" ON "public"."Track"("resultDuosmiumId" ASC, "name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Track_resultDuosmiumId_name_key" ON "public"."Track"("resultDuosmiumId", "name");

-- CreateIndex
CREATE INDEX "Placing_resultDuosmiumId_eventName_teamNumber_idx" ON "public"."Placing"("resultDuosmiumId" ASC, "eventName" ASC, "teamNumber" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Placing_resultDuosmiumId_eventName_teamNumber_key" ON "public"."Placing"("resultDuosmiumId", "eventName", "teamNumber");

-- CreateIndex
CREATE INDEX "Penalty_resultDuosmiumId_teamNumber_idx" ON "public"."Penalty"("resultDuosmiumId" ASC, "teamNumber" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Penalty_resultDuosmiumId_teamNumber_key" ON "public"."Penalty"("resultDuosmiumId", "teamNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Histogram_resultDuosmiumId_key" ON "public"."Histogram"("resultDuosmiumId");

-- CreateIndex
CREATE INDEX "Histogram_resultDuosmiumId_idx" ON "public"."Histogram"("resultDuosmiumId" ASC);

-- AddForeignKey
ALTER TABLE "public"."Tournament" ADD CONSTRAINT "Tournament_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Track" ADD CONSTRAINT "Track_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Placing" ADD CONSTRAINT "Placing_resultDuosmiumId_eventName_fkey" FOREIGN KEY ("resultDuosmiumId", "eventName") REFERENCES "public"."Event"("resultDuosmiumId", "name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Placing" ADD CONSTRAINT "Placing_resultDuosmiumId_teamNumber_fkey" FOREIGN KEY ("resultDuosmiumId", "teamNumber") REFERENCES "public"."Team"("resultDuosmiumId", "number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Placing" ADD CONSTRAINT "Placing_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Penalty" ADD CONSTRAINT "Penalty_resultDuosmiumId_teamNumber_fkey" FOREIGN KEY ("resultDuosmiumId", "teamNumber") REFERENCES "public"."Team"("resultDuosmiumId", "number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Penalty" ADD CONSTRAINT "Penalty_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Histogram" ADD CONSTRAINT "Histogram_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;
