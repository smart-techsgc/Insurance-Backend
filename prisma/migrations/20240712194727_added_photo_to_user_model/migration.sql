/*
  Warnings:

  - You are about to drop the column `photo` on the `employeeinfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employeeinfo` DROP COLUMN `photo`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `photo` VARCHAR(191) NULL;
