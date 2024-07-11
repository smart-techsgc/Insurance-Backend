/*
  Warnings:

  - Added the required column `mfaQrCode` to the `mfa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mfa` ADD COLUMN `mfaQrCode` VARCHAR(191) NOT NULL;
