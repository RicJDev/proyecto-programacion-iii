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
CREATE TABLE `usuario_rol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_rol` INTEGER NOT NULL,

    UNIQUE INDEX `usuario_rol_id_usuario_id_rol_key`(`id_usuario`, `id_rol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol_permiso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_rol` INTEGER NOT NULL,
    `id_permiso` INTEGER NOT NULL,

    UNIQUE INDEX `rol_permiso_id_rol_id_permiso_key`(`id_rol`, `id_permiso`),
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
CREATE TABLE `usuario_estado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_estado` INTEGER NOT NULL,

    UNIQUE INDEX `usuario_estado_id_usuario_id_estado_key`(`id_usuario`, `id_estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_municipio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_municipio` INTEGER NOT NULL,

    UNIQUE INDEX `usuario_municipio_id_usuario_id_municipio_key`(`id_usuario`, `id_municipio`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_parroquia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_parroquia` INTEGER NOT NULL,

    UNIQUE INDEX `usuario_parroquia_id_usuario_id_parroquia_key`(`id_usuario`, `id_parroquia`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_centro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_centro_salud` INTEGER NOT NULL,

    UNIQUE INDEX `usuario_centro_id_usuario_id_centro_salud_key`(`id_usuario`, `id_centro_salud`),
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
CREATE TABLE `esquema_vacunacion_vacuna` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_esquema_vacunacion` INTEGER NOT NULL,
    `id_vacuna` INTEGER NOT NULL,

    UNIQUE INDEX `esquema_vacunacion_vacuna_id_esquema_vacunacion_id_vacuna_key`(`id_esquema_vacunacion`, `id_vacuna`),
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

-- AddForeignKey
ALTER TABLE `usuario_rol` ADD CONSTRAINT `usuario_rol_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_rol` ADD CONSTRAINT `usuario_rol_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `rol`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rol_permiso` ADD CONSTRAINT `rol_permiso_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `rol`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rol_permiso` ADD CONSTRAINT `rol_permiso_id_permiso_fkey` FOREIGN KEY (`id_permiso`) REFERENCES `permiso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `municipio` ADD CONSTRAINT `municipio_id_estado_fkey` FOREIGN KEY (`id_estado`) REFERENCES `estado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parroquia` ADD CONSTRAINT `parroquia_id_municipio_fkey` FOREIGN KEY (`id_municipio`) REFERENCES `municipio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `centro_salud` ADD CONSTRAINT `centro_salud_id_parroquia_fkey` FOREIGN KEY (`id_parroquia`) REFERENCES `parroquia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_estado` ADD CONSTRAINT `usuario_estado_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_estado` ADD CONSTRAINT `usuario_estado_id_estado_fkey` FOREIGN KEY (`id_estado`) REFERENCES `estado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_municipio` ADD CONSTRAINT `usuario_municipio_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_municipio` ADD CONSTRAINT `usuario_municipio_id_municipio_fkey` FOREIGN KEY (`id_municipio`) REFERENCES `municipio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_parroquia` ADD CONSTRAINT `usuario_parroquia_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_parroquia` ADD CONSTRAINT `usuario_parroquia_id_parroquia_fkey` FOREIGN KEY (`id_parroquia`) REFERENCES `parroquia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_centro` ADD CONSTRAINT `usuario_centro_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_centro` ADD CONSTRAINT `usuario_centro_id_centro_salud_fkey` FOREIGN KEY (`id_centro_salud`) REFERENCES `centro_salud`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `representacion` ADD CONSTRAINT `representacion_id_representante_fkey` FOREIGN KEY (`id_representante`) REFERENCES `persona`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `representacion` ADD CONSTRAINT `representacion_id_representado_fkey` FOREIGN KEY (`id_representado`) REFERENCES `persona`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `esquema_vacunacion_vacuna` ADD CONSTRAINT `esquema_vacunacion_vacuna_id_esquema_vacunacion_fkey` FOREIGN KEY (`id_esquema_vacunacion`) REFERENCES `esquema_vacunacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `esquema_vacunacion_vacuna` ADD CONSTRAINT `esquema_vacunacion_vacuna_id_vacuna_fkey` FOREIGN KEY (`id_vacuna`) REFERENCES `vacuna`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
