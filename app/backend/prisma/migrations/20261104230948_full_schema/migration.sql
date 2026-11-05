/*
  Warnings:

  - You are about to alter the column `name` on the `permissions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to alter the column `created_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `permissions` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `description` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `description` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `name` VARCHAR(150) NOT NULL,
    MODIFY `email` VARCHAR(150) NOT NULL,
    MODIFY `password_hash` VARCHAR(255) NOT NULL,
    MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE `states` (
    `id_state` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`id_state`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `municipalities` (
    `id_municipality` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `id_state` INTEGER NOT NULL,

    PRIMARY KEY (`id_municipality`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parishes` (
    `id_parish` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `id_municipality` INTEGER NOT NULL,

    PRIMARY KEY (`id_parish`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `health_centers` (
    `id_center` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `address` TEXT NOT NULL,
    `id_parish` INTEGER NOT NULL,

    PRIMARY KEY (`id_center`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipients` (
    `id_person` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `identification_number` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `recipients_identification_number_key`(`identification_number`),
    PRIMARY KEY (`id_person`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vaccines` (
    `id_vaccine` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `type` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_vaccine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `immunizations` (
    `id_dose` INTEGER NOT NULL AUTO_INCREMENT,
    `id_person` INTEGER NOT NULL,
    `id_vaccine` INTEGER NOT NULL,
    `date_time` DATETIME NOT NULL,
    `id_center` INTEGER NOT NULL,

    PRIMARY KEY (`id_dose`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medical_exams` (
    `id_exam` INTEGER NOT NULL AUTO_INCREMENT,
    `data` LONGTEXT NOT NULL,
    `id_person` INTEGER NOT NULL,

    PRIMARY KEY (`id_exam`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medical_certificates` (
    `id_certificate` INTEGER NOT NULL AUTO_INCREMENT,
    `id_exam` INTEGER NOT NULL,
    `id_dose` INTEGER NOT NULL,
    `code` VARCHAR(100) NOT NULL,
    `id_person` INTEGER NOT NULL,

    UNIQUE INDEX `medical_certificates_code_key`(`code`),
    PRIMARY KEY (`id_certificate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `municipalities` ADD CONSTRAINT `municipalities_id_state_fkey` FOREIGN KEY (`id_state`) REFERENCES `states`(`id_state`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parishes` ADD CONSTRAINT `parishes_id_municipality_fkey` FOREIGN KEY (`id_municipality`) REFERENCES `municipalities`(`id_municipality`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `health_centers` ADD CONSTRAINT `health_centers_id_parish_fkey` FOREIGN KEY (`id_parish`) REFERENCES `parishes`(`id_parish`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `immunizations` ADD CONSTRAINT `immunizations_id_person_fkey` FOREIGN KEY (`id_person`) REFERENCES `recipients`(`id_person`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `immunizations` ADD CONSTRAINT `immunizations_id_vaccine_fkey` FOREIGN KEY (`id_vaccine`) REFERENCES `vaccines`(`id_vaccine`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `immunizations` ADD CONSTRAINT `immunizations_id_center_fkey` FOREIGN KEY (`id_center`) REFERENCES `health_centers`(`id_center`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_exams` ADD CONSTRAINT `medical_exams_id_person_fkey` FOREIGN KEY (`id_person`) REFERENCES `recipients`(`id_person`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_certificates` ADD CONSTRAINT `medical_certificates_id_exam_fkey` FOREIGN KEY (`id_exam`) REFERENCES `medical_exams`(`id_exam`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_certificates` ADD CONSTRAINT `medical_certificates_id_dose_fkey` FOREIGN KEY (`id_dose`) REFERENCES `immunizations`(`id_dose`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_certificates` ADD CONSTRAINT `medical_certificates_id_person_fkey` FOREIGN KEY (`id_person`) REFERENCES `recipients`(`id_person`) ON DELETE CASCADE ON UPDATE CASCADE;
