-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `correo` VARCHAR(150) NOT NULL,
    `hash_contrasena` VARCHAR(255) NOT NULL,
    `creado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX `usuario_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `rol_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permiso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `permiso_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `municipio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `id_estado` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parroquia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `id_municipio` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `centro_salud` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_parroquia` INTEGER NOT NULL,
    `nombre` VARCHAR(200) NOT NULL,
    `direccion` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `persona` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `genero` CHAR(1) NOT NULL,
    `peso` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `fecha_nacimiento` DATETIME(3) NOT NULL,
    `primer_nombre` VARCHAR(100) NOT NULL,
    `segundo_nombre` VARCHAR(100) NULL,
    `primer_apellido` VARCHAR(100) NOT NULL,
    `segundo_apellido` VARCHAR(100) NULL,
    `cedula_de_identidad` VARCHAR(50) NULL,

    UNIQUE INDEX `persona_cedula_de_identidad_key`(`cedula_de_identidad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `representacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_representante` INTEGER NOT NULL,
    `id_representado` INTEGER NOT NULL,
    `tipo_relacion` VARCHAR(50) NULL,

    UNIQUE INDEX `representacion_id_representante_id_representado_key`(`id_representante`, `id_representado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vacuna` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `tipo` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `esquema_vacunacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rango_edad` VARCHAR(50) NOT NULL,
    `fecha_publicacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_vacuna` INTEGER NOT NULL,
    `numero_lote` VARCHAR(100) NOT NULL,
    `fecha_expiracion` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tarjeta_vacunacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_persona` INTEGER NOT NULL,
    `id_esquema_vacunacion` INTEGER NOT NULL,
    `estatus` VARCHAR(50) NOT NULL,
    `fecha_emision` DATETIME(3) NOT NULL,
    `codigo` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `tarjeta_vacunacion_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_centro_salud` INTEGER NOT NULL,
    `id_lote` INTEGER NOT NULL,
    `cantidad_disponible` INTEGER NOT NULL,

    UNIQUE INDEX `inventario_id_centro_salud_id_lote_key`(`id_centro_salud`, `id_lote`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `envio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_centro_salud` INTEGER NOT NULL,
    `codigo_orden` VARCHAR(100) NOT NULL,
    `nombre_remitente` VARCHAR(150) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `estatus` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalle_envio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_envio` INTEGER NOT NULL,
    `id_lote` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inmunizacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tarjeta_vacunacion` INTEGER NOT NULL,
    `id_lote` INTEGER NOT NULL,
    `id_centro_salud` INTEGER NOT NULL,
    `fecha_hora` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `examen_medico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parametro_examen_medico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_examen_medico` INTEGER NOT NULL,
    `minimo` DECIMAL(65, 30) NOT NULL,
    `maximo` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificado_medico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_persona` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `codigo` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `certificado_medico_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resultado_examen_medico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_persona` INTEGER NOT NULL,
    `id_parametro_examen_medico` INTEGER NOT NULL,
    `valor` DECIMAL(65, 30) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
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

-- CreateTable
CREATE TABLE `_StateToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_StateToUser_AB_unique`(`A`, `B`),
    INDEX `_StateToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MunicipalityToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MunicipalityToUser_AB_unique`(`A`, `B`),
    INDEX `_MunicipalityToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ParishToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ParishToUser_AB_unique`(`A`, `B`),
    INDEX `_ParishToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_HealthCenterToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_HealthCenterToUser_AB_unique`(`A`, `B`),
    INDEX `_HealthCenterToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_VaccinationScheduleToVaccine` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_VaccinationScheduleToVaccine_AB_unique`(`A`, `B`),
    INDEX `_VaccinationScheduleToVaccine_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `municipio` ADD CONSTRAINT `municipio_id_estado_fkey` FOREIGN KEY (`id_estado`) REFERENCES `estado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parroquia` ADD CONSTRAINT `parroquia_id_municipio_fkey` FOREIGN KEY (`id_municipio`) REFERENCES `municipio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `centro_salud` ADD CONSTRAINT `centro_salud_id_parroquia_fkey` FOREIGN KEY (`id_parroquia`) REFERENCES `parroquia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `representacion` ADD CONSTRAINT `representacion_id_representante_fkey` FOREIGN KEY (`id_representante`) REFERENCES `persona`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `representacion` ADD CONSTRAINT `representacion_id_representado_fkey` FOREIGN KEY (`id_representado`) REFERENCES `persona`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lote` ADD CONSTRAINT `lote_id_vacuna_fkey` FOREIGN KEY (`id_vacuna`) REFERENCES `vacuna`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarjeta_vacunacion` ADD CONSTRAINT `tarjeta_vacunacion_id_persona_fkey` FOREIGN KEY (`id_persona`) REFERENCES `persona`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarjeta_vacunacion` ADD CONSTRAINT `tarjeta_vacunacion_id_esquema_vacunacion_fkey` FOREIGN KEY (`id_esquema_vacunacion`) REFERENCES `esquema_vacunacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventario` ADD CONSTRAINT `inventario_id_centro_salud_fkey` FOREIGN KEY (`id_centro_salud`) REFERENCES `centro_salud`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventario` ADD CONSTRAINT `inventario_id_lote_fkey` FOREIGN KEY (`id_lote`) REFERENCES `lote`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `envio` ADD CONSTRAINT `envio_id_centro_salud_fkey` FOREIGN KEY (`id_centro_salud`) REFERENCES `centro_salud`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalle_envio` ADD CONSTRAINT `detalle_envio_id_envio_fkey` FOREIGN KEY (`id_envio`) REFERENCES `envio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detalle_envio` ADD CONSTRAINT `detalle_envio_id_lote_fkey` FOREIGN KEY (`id_lote`) REFERENCES `lote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inmunizacion` ADD CONSTRAINT `inmunizacion_id_tarjeta_vacunacion_fkey` FOREIGN KEY (`id_tarjeta_vacunacion`) REFERENCES `tarjeta_vacunacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inmunizacion` ADD CONSTRAINT `inmunizacion_id_lote_fkey` FOREIGN KEY (`id_lote`) REFERENCES `lote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inmunizacion` ADD CONSTRAINT `inmunizacion_id_centro_salud_fkey` FOREIGN KEY (`id_centro_salud`) REFERENCES `centro_salud`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parametro_examen_medico` ADD CONSTRAINT `parametro_examen_medico_id_examen_medico_fkey` FOREIGN KEY (`id_examen_medico`) REFERENCES `examen_medico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certificado_medico` ADD CONSTRAINT `certificado_medico_id_persona_fkey` FOREIGN KEY (`id_persona`) REFERENCES `persona`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resultado_examen_medico` ADD CONSTRAINT `resultado_examen_medico_id_persona_fkey` FOREIGN KEY (`id_persona`) REFERENCES `persona`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resultado_examen_medico` ADD CONSTRAINT `resultado_examen_medico_id_parametro_examen_medico_fkey` FOREIGN KEY (`id_parametro_examen_medico`) REFERENCES `parametro_examen_medico`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `rol`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToRole` ADD CONSTRAINT `_PermissionToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `permiso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToRole` ADD CONSTRAINT `_PermissionToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `rol`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StateToUser` ADD CONSTRAINT `_StateToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `estado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StateToUser` ADD CONSTRAINT `_StateToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MunicipalityToUser` ADD CONSTRAINT `_MunicipalityToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `municipio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MunicipalityToUser` ADD CONSTRAINT `_MunicipalityToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ParishToUser` ADD CONSTRAINT `_ParishToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `parroquia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ParishToUser` ADD CONSTRAINT `_ParishToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HealthCenterToUser` ADD CONSTRAINT `_HealthCenterToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `centro_salud`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HealthCenterToUser` ADD CONSTRAINT `_HealthCenterToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_VaccinationScheduleToVaccine` ADD CONSTRAINT `_VaccinationScheduleToVaccine_A_fkey` FOREIGN KEY (`A`) REFERENCES `esquema_vacunacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_VaccinationScheduleToVaccine` ADD CONSTRAINT `_VaccinationScheduleToVaccine_B_fkey` FOREIGN KEY (`B`) REFERENCES `vacuna`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
