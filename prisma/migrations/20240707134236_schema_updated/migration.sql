-- AlterTable
ALTER TABLE `accessLevel` ADD COLUMN `updatedAt` DATETIME(3) NULL,
    ADD COLUMN `updatedBy` INTEGER NULL;
