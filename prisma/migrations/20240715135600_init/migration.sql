-- CreateEnum
CREATE TYPE "maritalStatus" AS ENUM ('Single', 'Married');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('admin', 'employee', 'client');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "photo" TEXT,
    "createdBy" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "userType" "role" NOT NULL DEFAULT 'employee',
    "accessLevelId" INTEGER,
    "positionId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employeeInfo" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "otherName" TEXT,
    "dateOfBirth" TEXT,
    "gender" TEXT,
    "maritalStatus" "maritalStatus",
    "nationality" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "email" TEXT NOT NULL,

    CONSTRAINT "employeeInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfa" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "mfaSecret" TEXT NOT NULL,
    "mfaQrCode" TEXT NOT NULL,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "mfa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessLevel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,

    CONSTRAINT "accessLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,

    CONSTRAINT "position_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employeeInfo_email_key" ON "employeeInfo"("email");

-- CreateIndex
CREATE UNIQUE INDEX "otp_email_key" ON "otp"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mfa_email_key" ON "mfa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accessLevel_name_key" ON "accessLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "position_name_key" ON "position"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_accessLevelId_fkey" FOREIGN KEY ("accessLevelId") REFERENCES "accessLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeInfo" ADD CONSTRAINT "employeeInfo_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfa" ADD CONSTRAINT "mfa_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
