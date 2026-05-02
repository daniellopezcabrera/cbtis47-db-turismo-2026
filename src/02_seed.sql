-- =============================================
-- Crear tabla de usuarios
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id_person INT4 PRIMARY KEY, -- Llave primaria relacionada con la tabla 'person'
    user_name VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user_person FOREIGN KEY (id_person) 
        REFERENCES public.person(id_person) ON DELETE CASCADE
);

-- =============================================
-- Inserción de registros de ejemplo
-- =============================================
INSERT INTO users (id_person, user_name, password) VALUES
(1, 'juan_perez85', 'juanxd'),
(2, 'mrodriguez', 'contraseñaxd'),
(3, 'sanchez', 'sanchesuwu'),
(4, 'sofia', 'josejose'),
(5, 'richard', 'noasxd'),
(6, 'paty', 'xdxdxd');

-- Consulta para verificar los datos
SELECT * FROM users;
