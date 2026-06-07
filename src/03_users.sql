-- ============================================================
-- FLYGTH WITH YOU — CBTis 47
-- Módulo  : Administración de BD — Seguridad
-- DBA     : Roldan Barrera Edson Yalan
-- Motor   : PostgreSQL (Supabase)
-- ============================================================


-- ============================================================
-- SECCIÓN 1 — ROLES DE BASE DE DATOS
-- Un ROL en PostgreSQL es una plantilla de permisos reutilizable.
-- Se crea una vez y se asigna a uno o varios usuarios.
-- Esto aplica el Principio de Menor Privilegio: cada rol
-- recibe SOLO los permisos necesarios para su función.
-- ============================================================

-- Rol para pasajeros/clientes del sistema
-- Puede consultar vuelos, rutas y trolebuses disponibles,
-- y gestionar sus propias reservaciones y pagos.
CREATE ROLE rol_pasajero;

-- Rol para pilotos y copilotos
-- Solo puede consultar sus vuelos asignados y el manifiesto
-- de pasajeros. El piloto además puede actualizar el estado.
CREATE ROLE rol_tripulacion_vuelo;

-- Rol para asistentes de vuelo (sobrecargos)
-- Consulta pasajeros asignados y registra incidentes a bordo.
CREATE ROLE rol_asistente_vuelo;

-- Rol para choferes de trolebús
-- Consulta sus viajes del día y actualiza el estado del viaje.
CREATE ROLE rol_chofer;

-- Rol para el administrador del sistema
-- Gestión completa de vuelos, rutas, empleados y reportes.
CREATE ROLE rol_administrador;


-- ============================================================
-- SECCIÓN 2 — PERMISOS POR ROL (GRANT)
-- GRANT [permiso] ON [tabla] TO [rol];
-- Cada rol recibe acceso SOLO a las tablas que necesita
-- y SOLO con las operaciones que su función requiere.
-- ============================================================

-- ------------------------------------------------------------
-- Permisos: rol_pasajero
-- Puede ver vuelos, rutas y trolebuses, y gestionar sus
-- propias reservaciones y pagos.
-- ------------------------------------------------------------
GRANT SELECT ON flight, airport, airplane, airplane_model TO rol_pasajero;
GRANT SELECT ON route, route_stop, bus_station TO rol_pasajero;
GRANT SELECT ON trolley_trip, trolley_route_schedule, schedule_day TO rol_pasajero;
GRANT SELECT, INSERT ON flight_booking, booking_seat TO rol_pasajero;
GRANT SELECT, INSERT ON trolley_booking TO rol_pasajero;
GRANT SELECT, INSERT ON payment TO rol_pasajero;
GRANT SELECT, INSERT, UPDATE ON ticket TO rol_pasajero;
GRANT SELECT, UPDATE ON person TO rol_pasajero;

-- ------------------------------------------------------------
-- Permisos: rol_tripulacion_vuelo  (piloto y copiloto)
-- Solo lectura de sus vuelos y pasajeros asignados.
-- El piloto además puede actualizar el estado del vuelo
-- (esto se controla a nivel aplicación por occupation).
-- ------------------------------------------------------------
GRANT SELECT ON flight, airport, airplane, airplane_model TO rol_tripulacion_vuelo;
GRANT SELECT ON flight_booking, booking_seat TO rol_tripulacion_vuelo;
GRANT SELECT ON person TO rol_tripulacion_vuelo;
GRANT UPDATE (status) ON flight TO rol_tripulacion_vuelo;

-- ------------------------------------------------------------
-- Permisos: rol_asistente_vuelo
-- Consulta pasajeros y asientos. Registra incidentes.
-- ------------------------------------------------------------
GRANT SELECT ON flight, flight_booking, booking_seat TO rol_asistente_vuelo;
GRANT SELECT ON person TO rol_asistente_vuelo;
GRANT SELECT, INSERT ON incident TO rol_asistente_vuelo;

-- ------------------------------------------------------------
-- Permisos: rol_chofer
-- Consulta sus viajes del día y actualiza estado del viaje.
-- ------------------------------------------------------------
GRANT SELECT ON trolley_trip, trolley_route_schedule, route, route_stop TO rol_chofer;
GRANT SELECT ON bus_station TO rol_chofer;
GRANT SELECT ON trolley_booking TO rol_chofer;
GRANT SELECT ON person TO rol_chofer;
GRANT UPDATE (status) ON trolley_trip TO rol_chofer;

-- ------------------------------------------------------------
-- Permisos: rol_administrador
-- Acceso completo a todas las tablas del sistema.
-- Este rol solo debe asignarse al DBA o al usuario admin.
-- ------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO rol_administrador;


-- ============================================================
-- SECCIÓN 3 — USUARIOS DE BASE DE DATOS Y ASIGNACIÓN DE ROLES
-- Aquí se crean los usuarios de BD que corresponden a los
-- perfiles ya registrados en la tabla 'users' del sistema.
-- Se les asigna el rol según su occupation en la tabla
-- 'employee' + 'occupation'.
-- ============================================================

-- Usuario administrador del sistema (id_person = 18, admin@flygth.com)
CREATE USER db_admin WITH PASSWORD 'Admin$Flygth2026';
GRANT rol_administrador TO db_admin;

-- Usuario piloto — Roberto Mendoza Ruiz (id_person = 32)
CREATE USER db_roberto_piloto WITH PASSWORD 'Piloto$Flygth32';
GRANT rol_tripulacion_vuelo TO db_roberto_piloto;

-- Usuario copiloto — Sandra López Vega (id_person = 33)
CREATE USER db_sandra_copil WITH PASSWORD 'Copil$Flygth33';
GRANT rol_tripulacion_vuelo TO db_sandra_copil;

-- Usuarios asistentes de vuelo (sobrecargos)
-- Miguel Torres Castillo (id_person = 34)
CREATE USER db_miguel_sobre WITH PASSWORD 'Sobre$Flygth34';
GRANT rol_asistente_vuelo TO db_miguel_sobre;

-- Elena Ramírez Díaz (id_person = 35)
CREATE USER db_elena_sobre WITH PASSWORD 'Sobre$Flygth35';
GRANT rol_asistente_vuelo TO db_elena_sobre;

-- Usuarios choferes de trolebús
-- Jorge Hernández Mora (id_person = 36)
CREATE USER db_jorge_chofer WITH PASSWORD 'Chofer$Flygth36';
GRANT rol_chofer TO db_jorge_chofer;

-- Patricia Sánchez Luna (id_person = 37)
CREATE USER db_patricia_chofer WITH PASSWORD 'Chofer$Flygth37';
GRANT rol_chofer TO db_patricia_chofer;

-- NUEVO usuario de ejemplo: usuario de app web (solo lectura pública)
-- Representa la conexión que hace la aplicación web al buscar vuelos.
-- Demuestra el Principio de Menor Privilegio: la app NO necesita
-- modificar datos, solo consultar vuelos y rutas disponibles.
CREATE USER db_app_web WITH PASSWORD 'AppWeb$Flygth2026';
GRANT SELECT ON flight, airport, route, bus_station, trolley_trip TO db_app_web;


-- ============================================================
-- SECCIÓN 4 — VERIFICACIÓN DE PERMISOS (SHOW / CONSULTA)
-- En PostgreSQL se consultan los permisos asignados así:
-- ============================================================

-- Ver los roles asignados a un usuario específico
SELECT grantee, granted_role
FROM information_schema.role_table_grants
WHERE grantee = 'db_roberto_piloto';

-- Ver todos los permisos sobre las tablas del schema public
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
ORDER BY grantee, table_name;


-- ============================================================
-- SECCIÓN 5 — REVOKE: QUITAR PERMISOS
-- REVOKE demuestra que los permisos pueden retirarse en
-- cualquier momento, por ejemplo cuando un empleado cambia
-- de puesto o se detecta un acceso indebido.
-- La sintaxis es idéntica a GRANT pero usa FROM en vez de TO.
-- ============================================================

-- Ejemplo 1: Quitar permiso de UPDATE al rol de tripulación
-- (si se detecta que un copiloto modificó vuelos sin autorización)
REVOKE UPDATE (status) ON flight FROM rol_tripulacion_vuelo;

-- Ejemplo 2: Quitar acceso al usuario de app web a trolley_trip
-- (si la app web ya no necesita mostrar rutas de trolebús)
REVOKE SELECT ON trolley_trip FROM db_app_web;

-- Ejemplo 3: Restaurar el permiso después de la corrección
-- (el piloto Roberto sí necesita actualizar el estado del vuelo)
GRANT UPDATE (status) ON flight TO db_roberto_piloto;


-- ============================================================
-- SECCIÓN 6 — POLÍTICAS RLS (Row Level Security)
-- RLS es una capa adicional de seguridad en PostgreSQL/Supabase.
-- Mientras GRANT controla QUÉ tablas puede ver un usuario,
-- RLS controla QUÉ FILAS dentro de esa tabla puede ver.
-- Ejemplo: un pasajero con SELECT en flight_booking solo debe
-- ver SUS propias reservaciones, no las de otros usuarios.
-- ============================================================

-- Activar RLS en las tablas que manejan datos personales
ALTER TABLE flight_booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE trolley_booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket ENABLE ROW LEVEL SECURITY;

-- Política: cada usuario solo ve sus propias reservaciones de vuelo
CREATE POLICY pasajero_ve_sus_reservaciones_vuelo
ON flight_booking
FOR SELECT
USING (id_user = current_setting('app.current_user_id')::int);

-- Política: cada usuario solo ve sus propias reservaciones de trolebús
CREATE POLICY pasajero_ve_sus_reservaciones_trolebus
ON trolley_booking
FOR SELECT
USING (id_user = current_setting('app.current_user_id')::int);

-- Política: el administrador puede ver todas las reservaciones
CREATE POLICY admin_ve_todo_flight_booking
ON flight_booking
FOR ALL
TO rol_administrador
USING (true);

CREATE POLICY admin_ve_todo_trolley_booking
ON trolley_booking
FOR ALL
TO rol_administrador
USING (true);
