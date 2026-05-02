-- =============================================
-- SEED DATA - Tabla: users (PostgreSQL)
-- =============================================

-- Limpiamos la tabla antes de insertar para evitar duplicados en pruebas
-- (Opcional: elimina esta línea si no quieres borrar datos existentes)
TRUNCATE TABLE public.users CASCADE;

-- Inserción de los 6 registros de la captura
INSERT INTO public.users (id_person, user_name, password) 
VALUES
    (1, 'juan_perez85', 'juanxd'),
    (2, 'mrodriguez', 'contraseñaxd'),
    (3, 'sanchez', 'sanchesuwu'),
    (4, 'sofia', 'josejose'),
    (5, 'richard', 'noasxd'),
    (6, 'paty', 'xdxdxd');

-- Mensaje de confirmación para la consola de PostgreSQL
DO $$ 
BEGIN 
    RAISE NOTICE 'Carga de datos en tabla "users" completada exitosamente.';
END $$;
