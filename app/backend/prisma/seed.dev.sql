-- =============================================================================
-- SEMILLA DE DESARROLLO (seed.dev.sql)
-- Se ejecuta después de seed.base.sql en entornos de desarrollo
-- =============================================================================

-- USUARIOS DE DESARROLLO (Contraseña para todos: password123)
INSERT INTO `usuario` (`id`, `nombre`, `correo`, `hash_contrasena`) VALUES
(1, 'Dra. Carmen Mendoza', 'admin@salud.gob', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, 'Dr. Roberto Velásquez', 'regional.miranda@salud.gob', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(3, 'Lic. Elena Ramos', 'local.lavictoria@salud.gob', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `correo` = VALUES(`correo`),
  `hash_contrasena` = VALUES(`hash_contrasena`);

-- ASIGNACIÓN DE ROLES A USUARIOS (_RoleToUser: A = rol.id, B = usuario.id)
INSERT IGNORE INTO `_RoleToUser` (`A`, `B`) VALUES
(1, 1),
(2, 2),
(3, 3);

-- CENTROS DE SALUD (Vinculados a parroquias reales de seed.base.sql)
-- id 113 = Las Delicias (Girardot, Aragua)
-- id 122 = José Félix Ribas (La Victoria, Aragua)
-- id 1117 = Altagracia (Libertador, Distrito Capital)
-- id 1120 = Catedral (Libertador, Distrito Capital)
-- id 1066 = Bolívar (Maracaibo, Zulia)
INSERT INTO `centro_salud` (`id`, `id_parroquia`, `nombre`, `direccion`) VALUES
(1, 113, 'Hospital Central de Maracay', 'Av. Las Delicias, Parroquia Las Delicias, Maracay'),
(2, 122, 'Ambulatorio Urbano La Victoria', 'Calle Rivas Dávila, Parroquia José Félix Ribas, La Victoria'),
(3, 1117, 'Ambulatorio Urbano Altagracia', 'Av. Baralt, Parroquia Altagracia, Caracas'),
(4, 1120, 'Hospital Vargas de Caracas', 'Esquina San Lorenzo, Parroquia Catedral, Caracas'),
(5, 1066, 'Hospital Central Dr. Urquinaona', 'Av. 2 El Milagro, Parroquia Bolívar, Maracaibo')
ON DUPLICATE KEY UPDATE
  `id_parroquia` = VALUES(`id_parroquia`),
  `nombre` = VALUES(`nombre`),
  `direccion` = VALUES(`direccion`);

-- ESQUEMAS DE VACUNACIÓN
INSERT INTO `esquema_vacunacion` (`id`, `rango_edad`, `fecha_publicacion`) VALUES
(1, '0-12 años (Infantil)', '2026-01-01 00:00:00'),
(2, '13-65 años (Adultos)', '2026-01-01 00:00:00')
ON DUPLICATE KEY UPDATE
  `rango_edad` = VALUES(`rango_edad`);

-- LOTES DE VACUNAS
INSERT INTO `lote` (`id`, `id_vacuna`, `numero_lote`, `fecha_expiracion`) VALUES
(1, 1, 'LOT-BCG-2026-01', '2027-12-31'),
(2, 2, 'LOT-HEPB-2026-02', '2027-11-30'),
(3, 3, 'LOT-PENTA-2026-03', '2027-10-15'),
(4, 5, 'LOT-FA-2026-04', '2028-03-20'),
(5, 7, 'LOT-TD-2026-05', '2028-06-30')
ON DUPLICATE KEY UPDATE
  `id_vacuna` = VALUES(`id_vacuna`),
  `numero_lote` = VALUES(`numero_lote`),
  `fecha_expiracion` = VALUES(`fecha_expiracion`);

-- INVENTARIO POR CENTRO DE SALUD
INSERT INTO `inventario` (`id`, `id_centro_salud`, `id_lote`, `cantidad_disponible`) VALUES
(1, 1, 1, 250),
(2, 1, 3, 180),
(3, 2, 4, 320),
(4, 3, 2, 150),
(5, 4, 5, 400)
ON DUPLICATE KEY UPDATE
  `cantidad_disponible` = VALUES(`cantidad_disponible`);

-- PERSONAS / PACIENTES
INSERT INTO `persona` (`id`, `genero`, `peso`, `fecha_nacimiento`, `primer_nombre`, `segundo_nombre`, `primer_apellido`, `segundo_apellido`, `cedula_de_identidad`) VALUES
(1, 'M', 78.50, '1990-05-15 00:00:00', 'Carlos', 'Andrés', 'Pérez', 'Gómez', 'V-20123456'),
(2, 'F', 62.00, '1992-09-22 00:00:00', 'María', 'Alejandra', 'González', 'Rojas', 'V-22987654'),
(3, 'F', 18.20, '2020-03-10 00:00:00', 'Lucía', 'Valentina', 'Pérez', 'González', 'V-34567890')
ON DUPLICATE KEY UPDATE
  `primer_nombre` = VALUES(`primer_nombre`),
  `primer_apellido` = VALUES(`primer_apellido`),
  `peso` = VALUES(`peso`);

-- REPRESENTACIONES LEGALES
INSERT INTO `representacion` (`id`, `id_representante`, `id_representado`, `tipo_relacion`) VALUES
(1, 1, 3, 'padre'),
(2, 2, 3, 'madre')
ON DUPLICATE KEY UPDATE
  `tipo_relacion` = VALUES(`tipo_relacion`);

-- TARJETAS DE VACUNACIÓN
INSERT INTO `tarjeta_vacunacion` (`id`, `id_persona`, `id_esquema_vacunacion`, `estatus`, `fecha_emision`, `codigo`) VALUES
(1, 1, 2, 'ACTIVA', '2026-01-15 10:30:00', 'TARJ-2026-0001'),
(2, 2, 2, 'ACTIVA', '2026-02-10 09:15:00', 'TARJ-2026-0002'),
(3, 3, 1, 'ACTIVA', '2026-03-05 11:00:00', 'TARJ-2026-0003')
ON DUPLICATE KEY UPDATE
  `estatus` = VALUES(`estatus`);

-- INMUNIZACIONES
INSERT INTO `inmunizacion` (`id`, `id_tarjeta_vacunacion`, `id_lote`, `id_centro_salud`, `fecha_hora`) VALUES
(1, 1, 4, 1, '2026-01-15 10:30:00'),
(2, 2, 5, 2, '2026-02-10 09:15:00'),
(3, 3, 3, 1, '2026-03-05 11:00:00')
ON DUPLICATE KEY UPDATE
  `fecha_hora` = VALUES(`fecha_hora`);

-- EXÁMENES MÉDICOS Y PARÁMETROS
INSERT INTO `examen_medico` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Hemograma completo', 'Evaluación hematológica básica'),
(2, 'Glucosa en ayunas', 'Nivel de glucemia basal')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `descripcion` = VALUES(`descripcion`);

INSERT INTO `parametro_examen_medico` (`id`, `id_examen_medico`, `minimo`, `maximo`) VALUES
(1, 1, 12.00, 17.50),
(2, 2, 70.00, 100.00)
ON DUPLICATE KEY UPDATE
  `minimo` = VALUES(`minimo`),
  `maximo` = VALUES(`maximo`);

-- CERTIFICADOS MÉDICOS
INSERT INTO `certificado_medico` (`id`, `id_persona`, `fecha`, `codigo`) VALUES
(1, 1, '2026-01-15 10:45:00', 'CERT-2026-0001'),
(2, 2, '2026-02-10 09:30:00', 'CERT-2026-0002')
ON DUPLICATE KEY UPDATE
  `codigo` = VALUES(`codigo`);

-- RESULTADOS DE EXÁMENES MÉDICOS
INSERT INTO `resultado_examen_medico` (`id`, `id_persona`, `id_parametro_examen_medico`, `valor`, `fecha`) VALUES
(1, 1, 1, 14.80, '2026-01-15 10:00:00'),
(2, 2, 2, 88.00, '2026-02-10 08:45:00')
ON DUPLICATE KEY UPDATE
  `valor` = VALUES(`valor`);
