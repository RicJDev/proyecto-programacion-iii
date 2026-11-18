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
CREATE TABLE `person` (
    `id_person` INTEGER NOT NULL AUTO_INCREMENT,
    `genre` CHAR(1) NOT NULL,
    `birthday` DATETIME(3) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `weight` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `second_name` VARCHAR(100) NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `second_last_name` VARCHAR(100) NULL,
    `identification_number` VARCHAR(50) NULL,

    UNIQUE INDEX `person_identification_number_key`(`identification_number`),
    PRIMARY KEY (`id_person`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parent_child` (
    `id_parent_child` INTEGER NOT NULL AUTO_INCREMENT,
    `parent_id` INTEGER NOT NULL,
    `child_id` INTEGER NOT NULL,
    `relation_type` VARCHAR(50) NULL,

    UNIQUE INDEX `parent_child_parent_id_child_id_key`(`parent_id`, `child_id`),
    PRIMARY KEY (`id_parent_child`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vaccine_card` (
    `id` INTEGER NOT NULL,
    `age_range` VARCHAR(191) NOT NULL,
    `published_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vaccines` (
    `id_vaccine` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `type` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_vaccine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `batch` (
    `id_batch` INTEGER NOT NULL AUTO_INCREMENT,
    `vaccine_id` INTEGER NOT NULL,
    `lot_number` VARCHAR(100) NOT NULL,
    `expiration_date` DATE NOT NULL,

    PRIMARY KEY (`id_batch`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory` (
    `id_inventory` INTEGER NOT NULL AUTO_INCREMENT,
    `health_center_id` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `quantity_available` INTEGER NOT NULL,

    UNIQUE INDEX `inventory_health_center_id_batch_id_key`(`health_center_id`, `batch_id`),
    PRIMARY KEY (`id_inventory`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipment` (
    `id_shipment` INTEGER NOT NULL AUTO_INCREMENT,
    `health_center_id` INTEGER NOT NULL,
    `order_code` VARCHAR(191) NOT NULL,
    `sender_name` VARCHAR(191) NOT NULL,
    `order_date` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'SENT') NOT NULL,

    PRIMARY KEY (`id_shipment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shipment_item` (
    `id_shipment_item` INTEGER NOT NULL AUTO_INCREMENT,
    `id_shipment` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id_shipment_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `immunizations` (
    `id_dose` INTEGER NOT NULL AUTO_INCREMENT,
    `id_person` INTEGER NOT NULL,
    `id_vaccine` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `id_center` INTEGER NOT NULL,
    `immunization_date` DATETIME NOT NULL,

    PRIMARY KEY (`id_dose`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medical_exams` (
    `id_exam` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_exam`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medical_exam_parameter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `medical_exam_id` INTEGER NOT NULL,
    `min` DECIMAL(65, 30) NOT NULL,
    `max` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medical_exam_result` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `medical_exam_parameter_id` INTEGER NOT NULL,
    `medical_certificate_id` INTEGER NOT NULL,
    `person_id` INTEGER NOT NULL,
    `value` DECIMAL(65, 30) NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medical_certificates` (
    `id_certificate` INTEGER NOT NULL AUTO_INCREMENT,
    `id_dose` INTEGER NOT NULL,
    `id_person` INTEGER NOT NULL,
    `code` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `medical_certificates_code_key`(`code`),
    PRIMARY KEY (`id_certificate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,

    UNIQUE INDEX `permissions_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_VaccineToVaccineCard` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_VaccineToVaccineCard_AB_unique`(`A`, `B`),
    INDEX `_VaccineToVaccineCard_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RoleToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RoleToUser_AB_unique`(`A`, `B`),
    INDEX `_RoleToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PermissionToRole` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PermissionToRole_AB_unique`(`A`, `B`),
    INDEX `_PermissionToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `municipalities` ADD CONSTRAINT `municipalities_id_state_fkey` FOREIGN KEY (`id_state`) REFERENCES `states`(`id_state`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parishes` ADD CONSTRAINT `parishes_id_municipality_fkey` FOREIGN KEY (`id_municipality`) REFERENCES `municipalities`(`id_municipality`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `health_centers` ADD CONSTRAINT `health_centers_id_parish_fkey` FOREIGN KEY (`id_parish`) REFERENCES `parishes`(`id_parish`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parent_child` ADD CONSTRAINT `parent_child_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `person`(`id_person`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parent_child` ADD CONSTRAINT `parent_child_child_id_fkey` FOREIGN KEY (`child_id`) REFERENCES `person`(`id_person`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `batch` ADD CONSTRAINT `batch_vaccine_id_fkey` FOREIGN KEY (`vaccine_id`) REFERENCES `vaccines`(`id_vaccine`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory` ADD CONSTRAINT `inventory_health_center_id_fkey` FOREIGN KEY (`health_center_id`) REFERENCES `health_centers`(`id_center`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory` ADD CONSTRAINT `inventory_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `batch`(`id_batch`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipment` ADD CONSTRAINT `shipment_health_center_id_fkey` FOREIGN KEY (`health_center_id`) REFERENCES `health_centers`(`id_center`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipment_item` ADD CONSTRAINT `shipment_item_id_shipment_fkey` FOREIGN KEY (`id_shipment`) REFERENCES `shipment`(`id_shipment`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shipment_item` ADD CONSTRAINT `shipment_item_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `batch`(`id_batch`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `immunizations` ADD CONSTRAINT `immunizations_id_person_fkey` FOREIGN KEY (`id_person`) REFERENCES `person`(`id_person`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `immunizations` ADD CONSTRAINT `immunizations_id_vaccine_fkey` FOREIGN KEY (`id_vaccine`) REFERENCES `vaccines`(`id_vaccine`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `immunizations` ADD CONSTRAINT `immunizations_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `batch`(`id_batch`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `immunizations` ADD CONSTRAINT `immunizations_id_center_fkey` FOREIGN KEY (`id_center`) REFERENCES `health_centers`(`id_center`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_exam_parameter` ADD CONSTRAINT `medical_exam_parameter_medical_exam_id_fkey` FOREIGN KEY (`medical_exam_id`) REFERENCES `medical_exams`(`id_exam`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_exam_result` ADD CONSTRAINT `medical_exam_result_medical_exam_parameter_id_fkey` FOREIGN KEY (`medical_exam_parameter_id`) REFERENCES `medical_exam_parameter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_exam_result` ADD CONSTRAINT `medical_exam_result_medical_certificate_id_fkey` FOREIGN KEY (`medical_certificate_id`) REFERENCES `medical_certificates`(`id_certificate`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_exam_result` ADD CONSTRAINT `medical_exam_result_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `person`(`id_person`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_certificates` ADD CONSTRAINT `medical_certificates_id_dose_fkey` FOREIGN KEY (`id_dose`) REFERENCES `immunizations`(`id_dose`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `medical_certificates` ADD CONSTRAINT `medical_certificates_id_person_fkey` FOREIGN KEY (`id_person`) REFERENCES `person`(`id_person`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_VaccineToVaccineCard` ADD CONSTRAINT `_VaccineToVaccineCard_A_fkey` FOREIGN KEY (`A`) REFERENCES `vaccines`(`id_vaccine`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_VaccineToVaccineCard` ADD CONSTRAINT `_VaccineToVaccineCard_B_fkey` FOREIGN KEY (`B`) REFERENCES `vaccine_card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToRole` ADD CONSTRAINT `_PermissionToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToRole` ADD CONSTRAINT `_PermissionToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
