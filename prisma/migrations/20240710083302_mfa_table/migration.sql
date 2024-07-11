-- CreateTable
CREATE TABLE `mfa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `mfaSecret` VARCHAR(191) NOT NULL,
    `mfaEnabled` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `mfa_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mfa` ADD CONSTRAINT `mfa_email_fkey` FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
