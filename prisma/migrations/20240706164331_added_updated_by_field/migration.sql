-- AlterTable
ALTER TABLE `accesslevel` ADD COLUMN `updatedAt` DATETIME(3) NULL,
    ADD COLUMN `updatedBy` INTEGER NULL;
