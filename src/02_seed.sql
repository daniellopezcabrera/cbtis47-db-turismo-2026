-- =============================================
-- SEED DATA - Tabla: users
-- =============================================

INSERT INTO users (id_person, user_name, password) VALUES
(1, 'juan_perez85', 'juanxd'),
(2, 'mrodriguez', 'contraseñaxd'),
(3, 'sanchez', 'sanchesuwu'),
(4, 'sofia', 'josejose'),
(5, 'richard', 'noasxd'),
(6, 'paty', 'xdxdxd')
ON CONFLICT (id_person) DO NOTHING;

-- Nota: Se usa ON CONFLICT para evitar errores si el script se ejecuta más de una vez.
