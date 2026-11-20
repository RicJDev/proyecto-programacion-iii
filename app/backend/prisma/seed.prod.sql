-- =============================================================================
-- SEMILLA DE PRODUCCIÓN (seed.prod.sql)
-- Se ejecuta después de seed.base.sql en entornos de producción
-- =============================================================================

-- USUARIO ADMINISTRADOR MAESTRO INICIAL
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`) VALUES
(1, 'Administrador Maestro MPPS', 'admin@salud.gob', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`);

INSERT IGNORE INTO `_RoleToUser` (`A`, `B`) VALUES
(1, 1);
