-- =============================================================================
-- SEMILLA DE DESARROLLO (seed.dev.sql)
-- Se ejecuta después de seed.base.sql en entornos de desarrollo
-- =============================================================================

-- USUARIOS DE DESARROLLO (Contraseña para todos: password123)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`) VALUES
(1, 'Dra. Carmen Mendoza', 'admin@salud.gob', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, 'Dr. Roberto Velásquez', 'regional.miranda@salud.gob', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(3, 'Lic. Elena Ramos', 'local.lavictoria@salud.gob', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(4, 'Enf. Cristian Feo', 'inmunizador@salud.gob', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `email` = VALUES(`email`),
  `password_hash` = VALUES(`password_hash`);

-- ASIGNACIÓN DE ROLES A USUARIOS (_RoleToUser: A = role.id, B = user.id)
INSERT IGNORE INTO `_RoleToUser` (`A`, `B`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

-- CENTROS DE SALUD (Vinculados a parroquias reales de seed.base.sql)
-- id_parish 113 = Las Delicias (Girardot, Aragua)
-- id_parish 122 = José Félix Ribas (La Victoria, Aragua)
-- id_parish 1117 = Altagracia (Libertador, Distrito Capital)
-- id_parish 1120 = Catedral (Libertador, Distrito Capital)
-- id_parish 1066 = Bolívar (Maracaibo, Zulia)
INSERT INTO `health_centers` (`id_center`, `name`, `address`, `id_parish`) VALUES
(1, 'Hospital Central de Maracay', 'Av. Las Delicias, Parroquia Las Delicias, Maracay', 113),
(2, 'Ambulatorio Urbano La Victoria', 'Calle Rivas Dávila, Parroquia José Félix Ribas, La Victoria', 122),
(3, 'Ambulatorio Urbano Altagracia', 'Av. Baralt, Parroquia Altagracia, Caracas', 1117),
(4, 'Hospital Vargas de Caracas', 'Esquina San Lorenzo, Parroquia Catedral, Caracas', 1120),
(5, 'Hospital Central Dr. Urquinaona', 'Av. 2 El Milagro, Parroquia Bolívar, Maracaibo', 1066)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `address` = VALUES(`address`),
  `id_parish` = VALUES(`id_parish`);

-- LOTES DE VACUNAS (batch)
INSERT INTO `batch` (`id_batch`, `vaccine_id`, `lot_number`, `expiration_date`) VALUES
(1, 1, 'LOT-BCG-2026-01', '2027-12-31'),
(2, 2, 'LOT-HEPB-2026-02', '2027-11-30'),
(3, 3, 'LOT-PENTA-2026-03', '2027-10-15'),
(4, 5, 'LOT-FA-2026-04', '2028-03-20'),
(5, 7, 'LOT-TD-2026-05', '2028-06-30')
ON DUPLICATE KEY UPDATE
  `vaccine_id` = VALUES(`vaccine_id`),
  `lot_number` = VALUES(`lot_number`),
  `expiration_date` = VALUES(`expiration_date`);

-- INVENTARIO POR CENTRO DE SALUD (inventory)
INSERT INTO `inventory` (`id_inventory`, `health_center_id`, `batch_id`, `quantity_available`) VALUES
(1, 1, 1, 250),
(2, 1, 3, 180),
(3, 2, 4, 320),
(4, 3, 2, 150),
(5, 4, 5, 400)
ON DUPLICATE KEY UPDATE
  `quantity_available` = VALUES(`quantity_available`);

-- PERSONAS / PACIENTES (person)
INSERT INTO `person` (`id_person`, `genre`, `birthday`, `name`, `second_name`, `last_name`, `second_last_name`, `identification_number`, `weight`) VALUES
(1, 'M', '1990-05-15 00:00:00', 'Carlos', 'Andrés', 'Pérez', 'Gómez', 'V-20123456', 78.50),
(2, 'F', '1992-09-22 00:00:00', 'María', 'Alejandra', 'González', 'Rojas', 'V-22987654', 62.00),
(3, 'F', '2020-03-10 00:00:00', 'Lucía', 'Valentina', 'Pérez', 'González', 'V-34567890', 18.20)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `last_name` = VALUES(`last_name`),
  `weight` = VALUES(`weight`);

-- RELACIONES PARENTALES (parent_child)
INSERT INTO `parent_child` (`id_parent_child`, `parent_id`, `child_id`, `relation_type`) VALUES
(1, 1, 3, 'padre'),
(2, 2, 3, 'madre')
ON DUPLICATE KEY UPDATE
  `relation_type` = VALUES(`relation_type`);

-- INMUNIZACIONES (immunizations)
INSERT INTO `immunizations` (`id_dose`, `id_person`, `id_vaccine`, `batch_id`, `id_center`, `immunization_date`) VALUES
(1, 1, 5, 4, 1, '2026-01-15 10:30:00'),
(2, 2, 7, 5, 2, '2026-02-10 09:15:00'),
(3, 3, 3, 3, 1, '2026-03-05 11:00:00')
ON DUPLICATE KEY UPDATE
  `immunization_date` = VALUES(`immunization_date`);

-- EXÁMENES MÉDICOS Y PARÁMETROS
INSERT INTO `medical_exams` (`id_exam`, `name`) VALUES
(1, 'Hemograma completo'),
(2, 'Glucosa en ayunas')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`);

INSERT INTO `medical_exam_parameter` (`id`, `medical_exam_id`, `min`, `max`) VALUES
(1, 1, 12.00, 17.50),
(2, 2, 70.00, 100.00)
ON DUPLICATE KEY UPDATE
  `min` = VALUES(`min`),
  `max` = VALUES(`max`);

-- CERTIFICADOS MÉDICOS (medical_certificates)
INSERT INTO `medical_certificates` (`id_certificate`, `id_dose`, `id_person`, `code`) VALUES
(1, 1, 1, 'CERT-2026-0001'),
(2, 2, 2, 'CERT-2026-0002')
ON DUPLICATE KEY UPDATE
  `code` = VALUES(`code`);

-- RESULTADOS DE EXÁMENES MÉDICOS (medical_exam_result)
INSERT INTO `medical_exam_result` (`id`, `medical_exam_parameter_id`, `medical_certificate_id`, `person_id`, `value`, `date`) VALUES
(1, 1, 1, 1, 14.80, '2026-01-15 10:00:00'),
(2, 2, 2, 2, 88.00, '2026-02-10 08:45:00')
ON DUPLICATE KEY UPDATE
  `value` = VALUES(`value`);
