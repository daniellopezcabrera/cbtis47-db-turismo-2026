# 🚀 Sprint 2 Backlog & Cierre de Proyecto

Este documento detalla el progreso, pruebas, criterios de aceptación bajo enfoque BDD (Gherkin) y documentación de cierre técnico para el **Sprint 2**. Se consolidan las ampliaciones de infraestructura y la lógica de negocio avanzada del sistema.

---

## 🛠️ Infraestructura y Base de Datos Avanzada

### #INFRA-03 – Actualizar esquema de base de datos con nuevas tablas y relaciones
* **Tipo:** Tarea técnica
* **Estado:** Done
* **Responsables:** German García Sánchez, Johana Cruz, Edson Roldan

#### Descripción
Ampliación y refinamiento del esquema relacional en Supabase (PostgreSQL) para mapear el Diagrama Entidad-Relación (ER) definitivo. Se implementó la arquitectura de separación de identidades `PERSON` / `USER` (relación 1:1 con Clave Primaria compartida) y el patrón de clave foránea anulable (`nullable FK`) en la tabla `PAYMENT`.

#### Tablas del Ecosistema
* **Identidad y Roles:** `PERSON`, `USER`, `EMPLOYEE`, `OCCUPATION`.
* **Módulo Aéreo:** `AIRPORT`, `AIRPLANE_MODEL`, `AIRPLANE`, `FLIGHT`, `FLIGHT_BOOKING`, `BOOKING_SEAT`.
* **Módulo Terrestre:** `ROUTE`, `BUS_STATION`, `ROUTE_STOP`, `TROLLEY_MODEL`, `TROLLEY`, `TROLLEY_ROUTE_SCHEDULE`, `SCHEDULE_DAY`, `TROLLEY_TRIP`, `TROLLEY_BOOKING`.
* **Transaccional:** `TICKET`, `PAYMENT`.

#### Documentación de cierre
* Script DDL `schema_v2.sql` ejecutado y verificado sin errores en Supabase.
* Integridad referencial comprobada, incluyendo la doble clave foránea (`FK`) en la tabla `FLIGHT` apuntando de forma independiente a `AIRPORT` (Origen y Destino).
* Incorporación del campo `expires_at` en `BOOKING_SEAT` para el control síncrono del temporizador en el servidor.
* **Datos de prueba sembrados:** 3 aeropuertos, 2 modelos de avión, 5 vuelos operacionales, 3 rutas de trolebús activo y 10 estaciones terrestres.
* Validación estricta mediante *constraints*: `USER.id_person` debe ser idéntico a `PERSON.id_person`.

---

### #INFRA-04 – Configurar reglas RLS (Row Level Security) para aislamiento de datos
* **Tipo:** Tarea técnica
* **Estado:** Done
* **Responsables:** Michelle Cueto, Daniel López

#### Descripción
Configuración avanzada de políticas de **Seguridad a Nivel de Fila (RLS)** en Supabase para mitigar vulnerabilidades de acceso directo vía API y garantizar el aislamiento absoluto de los entornos de datos entre clientes.

#### Documentación de cierre
* **Políticas Transaccionales:** Aplicación de reglas estrictas `FOR SELECT / INSERT / UPDATE` bajo la directiva `auth.uid() = user_id` en las tablas: `FLIGHT_BOOKING`, `TROLLEY_BOOKING`, `BOOKING_SEAT`, `PAYMENT` y `TICKET`.
* **Políticas de Catálogo:** Las tablas `PERSON`, `USER`, `AIRPORT` y `FLIGHT` se configuraron con acceso de solo lectura (`SELECT`) exclusivo para peticiones con tokens de usuarios autenticados.
* **Aislamiento verificado:** Se comprobó mediante pruebas de penetración cruzada que el *Usuario A* recibe un error o un set de datos vacío al intentar forzar consultas o mutaciones sobre los registros del *Usuario B*.
* Arquitectura escalable: Se dejaron preparadas e inactivas las políticas transaccionales para perfiles de empleados (`EMPLOYEE`).

---

## 👤 Historias de Usuario (User Stories)

### #US-01 – Registro de usuario (versión completa con CURP y username)
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Michelle Cueto, Johana Cruz

> **Como** nuevo visitante,  
> **quiero** crear una cuenta con mis datos personales (nombre, apellidos, CURP, fecha de nacimiento, email), username y contraseña,  
> **para** acceder al sistema de forma segura.

#### Criterios de aceptación (Gherkin)
* **Scenario:** Registro de cuenta exitoso
  * **Given** que el visitante llena el formulario con datos válidos y únicos,
  * **When** presiona el botón "Registrarse",
  * **Then** el sistema guarda los datos y lo redirige al login con un mensaje de confirmación.
* **Scenario:** Intento de registro con datos duplicados (Email, Username o CURP)
  * **Given** que el visitante introduce un dato ya registrado en el sistema,
  * **When** procesa el envío,
  * **Then** el sistema detiene la operación y muestra un mensaje de error específico.

#### Documentación de cierre
* Componente de formulario con validación nativa y expresiones regulares para la estructura de la CURP.
* **Estrategia de inserción:** Operación transaccional distribuida. Primero inserta en `PERSON`, recupera el ID generado, inserta en `USER` y propaga las credenciales hacia Supabase Auth.
* **Cumplimiento de estándares:** Satisface plenamente los requisitos `FR-01, FR-02, FR-03` y `NFR-04` (las contraseñas se procesan mediante hashing seguro, nunca en texto plano).

---

### #US-02 – Inicio de sesión (con username, no email)
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsable:** Michelle Cueto

> **Como** usuario registrado,  
> **quiero** iniciar sesión utilizando mi nombre de usuario (username) y contraseña,  
> **para** acceder a mi panel personalizado sin recordar mi correo.

#### Criterios de aceptación (Gherkin)
* **Scenario:** Autenticación válida con Username
  * **Given** un username y una contraseña que coinciden en el sistema,
  * **When** el usuario inicia sesión,
  * **Then** el sistema resuelve el email interno y redirige al dashboard.
* **Scenario:** Mitigación de enumeración de usuarios en error
  * **Given** un username inexistente o una contraseña errónea,
  * **When** se procesa la petición,
  * **Then** el sistema muestra un mensaje genérico *"Usuario o contraseña incorrectos"* por políticas de seguridad.

#### Documentación de cierre
* Capa de abstracción en JavaScript: intercepta el username, consulta el email asociado en la tabla `USER` y ejecuta el túnel de autenticación mediante `supabase.auth.signInWithPassword({ email, password })`.
* Cobertura completa de pruebas de caja negra (`FR-04`, `FR-05`).

---

### #US-03 – Cierre de sesión
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Michelle Cueto

> **Como** usuario logueado,  
> **quiero** cerrar mi sesión,  
> **para** proteger de forma inmediata la privacidad de mi cuenta.

#### Criterios de aceptación (Gherkin)
* **Scenario:** Desconexión y protección de rutas
  * **Given** que un usuario autenticado pulsa "Cerrar sesión",
  * **When** se invalida el token,
  * **Then** el sistema destruye la sesión y bloquea el acceso por URL a páginas privadas mediante middleware.

#### Documentación de cierre
* Destrucción de la sesión mediante `supabase.auth.signOut()`.
* Inyección de un script middleware síncrono en la cabecera de todos los módulos HTML privados para interceptar intentos de navegación sin un token JWT válido (`FR-06`, `FR-07`).

---

### #US-04 – Búsqueda de vuelos
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Edson Roldan, German García

> **Como** usuario logueado,  
> **quiero** buscar vuelos filtrando por origen, destino y fecha,  
> **para** revisar los itinerarios que mejor se adapten a mis necesidades.

#### Criterios de aceptación (Gherkin)
* **Scenario:** Búsqueda con coincidencias operacionales
  * **Given** un origen, destino y fecha válidos con operaciones,
  * **When** el usuario realiza la consulta,
  * **Then** visualiza las tarjetas de vuelos ordenadas de menor a mayor precio.
* **Scenario:** Restricción de temporalidad pasada
  * **Given** una fecha anterior al día en curso,
  * **When** se intenta buscar,
  * **Then** el sistema bloquea la acción mediante una alerta de validación.

#### Documentación de cierre
* Generación de menús dinámicos dependientes utilizando registros de `AIRPORT`.
* Script de extracción optimizado con la regla de negocio `NFR-24` (Fechas pasadas deshabilitadas desde la capa del cliente).

---

### #US-05 – Selección de asiento para vuelos
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Johana Cruz, Daniel López

> **Como** usuario logueado,  
> **quiero** ver de forma gráfica la distribución de asientos de un avión,  
> **para** elegir un lugar disponible con comodidad.

#### Criterios de aceptación (Gherkin)
* **Scenario:** Interacción con el mapa de abordaje
  * **Given** la carga del grid de asientos del avión asignado,
  * **When** el usuario inspecciona el mapa,
  * **Then** identifica asientos libres en color verde, ocupados en rojo y visualiza el número de fila/letra mediante un Tooltip al pasar el cursor.

#### Documentación de cierre
* Implementación de maquetación interactiva y accesibilidad visual (`UX-10`, `UX-12`).
* Filtrado preventivo en el lado de la base de datos: un asiento pasa a estado rojo si registra un estado transaccional `'confirmed'` o cuenta con un apartado pendiente cuyo temporizador no ha expirado (`expires_at > NOW()`). Cumple con `FR-11, FR-12, FR-13`.

---

### #US-06 – Confirmación de reserva de vuelo
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Michelle Cueto, German García

> **Como** usuario logueado,  
> **quiero** confirmar temporalmente mi asiento seleccionado,  
> **para** disponer de un tiempo límite de 10 minutos para pagar sin perder mi lugar.

#### Criterios de aceptación (Gherkin)
* **Scenario:** Apartado con temporizador crítico
  * **Given** la confirmación de un asiento libre,
  * **When** se crea el registro temporal con estado "pending",
  * **Then** inicia una cuenta regresiva de 10 minutos que cambia a color rojo de advertencia al restar solo 2 minutos. Al llegar a cero, cancela la transacción e informa al usuario.

#### Documentación de cierre
* Integración nativa con PostgreSQL: Bloqueo server-side determinista definiendo `expires_at = NOW() + interval '10 minutes'`.
* Control dinámico de interfaz gráfica para los estados del contador (`UX-13`, `UX-14`, `UX-15`).
* Protección contra colisiones: Bloqueo de solicitudes duplicadas de reservas concurrentes sobre el mismo vuelo e identificador de asiento (`FR-14` a `FR-17`, `NFR-08`, `NFR-09`).

---

### #US-07 – Ver rutas de trolebús turístico
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsable:** Edson Roldan

> **Como** usuario logueado,  
> **quiero** explorar los circuitos y rutas de trolebús que ofrece el sistema,  
> **para** planificar actividades turísticas locales.

#### Criterios de aceptación (Gherkin)
* **Scenario:** Consulta del catálogo de rutas terrestres
  * **Given** que existen rutas dadas de alta en la plataforma,
  * **When** el usuario navega a la sección turística,
  * **Then** se despliegan bloques interactivos detallando el nombre de la ruta, descripción extendida y terminal de salida.

#### Documentación de cierre
* Enlace con el módulo `ROUTE` y estructuración del maquetado mediante componentes responsivos integrados con llamadas a la acción directas para reserva (`FR-18`, `FR-19`).

---

### #US-08 – Reserva de trolebús
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** German García, Daniel López

> **Como** usuario logueado,  
> **quiero** reservar una plaza en un trolebús eligiendo la fecha del viaje y la parada de abordaje,  
> **para** asegurar mi traslado en el circuito seleccionado.

#### Criterios de aceptación (Gherkin)
* **Scenario:** Validación de aforo máximo permitido
  * **Given** una ruta con cupos agotados para un día específico,
  * **When** se intenta generar un nuevo apartado,
  * **Then** el sistema bloquea el calendario y emite un aviso de falta de disponibilidad.

#### Documentación de cierre
* Algoritmo de control de disponibilidad: Calcula en tiempo real la capacidad disponible cruzando la información de las tablas `TROLLEY_TRIP` y `TROLLEY_BOOKING`.
* Despliegue de paradas dinámicas obtenidas desde `ROUTE_STOP`. El flujo de tiempo y revocaciones automáticas se hereda a través de la arquitectura implementada en `expires_at` (`FR-20` a `FR-23`).

---

### #US-09 – Pago simulado de reserva
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Michelle Cueto, Johana Cruz

> **Como** usuario con una reservación en estado pendiente,  
> **quiero** procesar un pago bancario simulado dentro del tiempo reglamentario,  
> **para** formalizar la compra y consolidar mis pasajes.

#### Criterios de aceptación (Gherkin)
* **Scenario:** Transacción bancaria aprobada a tiempo
  * **Given** una reserva vigente en estado "pending",
  * **When** se procesan datos de pago válidos antes de la expiración del timer,
  * **Then** el sistema actualiza el estado a "confirmed", genera el recibo en `PAYMENT` y redirige al gestor de tickets.
* **Scenario:** Intento de pago sobre reserva vencida
  * **Given** que el temporizador de la reserva llegó a cero en el servidor,
  * **When** se envía el formulario de pago,
  * **Then** la base de datos rechaza la actualización y notifica la expiración del tiempo.

#### Documentación de cierre
* **Seguridad de Datos de Pago (`NFR-06`):** El sistema captura de manera exclusiva los últimos 4 dígitos de la tarjeta bancaria (`PAYMENT.card_last_four`) y la fecha de vencimiento. El código de seguridad (CVV) es destruido en memoria tras la simulación y **nunca** toca la persistencia de la base de datos.
* El pipeline actualiza de forma simultánea `FLIGHT_BOOKING.status` o `TROLLEY_BOOKING.status` según el caso de uso (`FR-24` a `FR-28`).

---

### #US-10 – Agregar reservas a un ticket
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsable:** Edson Roldan

> **Como** usuario con múltiples trayectos confirmados y pagados,  
> **quiero** agrupar mis reservas individuales en un único ticket maestro,  
> **para** centralizar la descarga de mis comprobantes de viaje.

#### Criterios de aceptación (Gherkin)
* **Scenario:** Consolidación de ítems aprobados
  * **Given** una lista de compras con estatus "confirmed" que no tienen un ticket asociado,
  * **When** el usuario hace clic en "Agregar",
  * **Then** los elementos se suman de manera temporal a una vista previa del ticket consolidado en pantalla.

#### Documentación de cierre
* Implementación de almacenamiento volátil controlado mediante `sessionStorage` para estructurar la pre-visualización del resumen de compra sin generar escrituras innecesarias en el servidor (`UX-17`, `FR-29`, `FR-30`).

---

### #US-11 – Descargar PDF del ticket (única vez)
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Michelle Cueto, Daniel López

> **Como** usuario con un ticket consolidado,  
> **quiero** exportar mi comprobante a formato PDF por única ocasión,  
> **para** disponer de un archivo físico e imprimible seguro contra fraudes de duplicidad.

#### Criterios de aceptación (Gherkin)
* **Scenario:** Descarga inicial del comprobante unificado
  * **Given** un ticket válido con reservas asociadas,
  * **When** se hace clic por primera vez en "Descargar PDF",
  * **Then** la librería compila el archivo, lo descarga en el equipo y el botón cambia de forma irreversible a "Ticket ya emitido", quedando totalmente deshabilitado.

#### Documentación de cierre
* **Estructura del PDF (`FR-32`):** Generación dinámica con jsPDF conteniendo metadatos obligatorios: nombres y especificaciones de las rutas o vuelos, asignación exacta de asientos, fechas/horarios de abordaje y el nombre completo del pasajero titular extraído de `PERSON`.
* **Control de estado absoluto (`NFR-10`):** Se utiliza la bandera persistente `downloaded` directamente en la base de datos para blindar el proceso. Cualquier petición repetida lee este estado, bloqueando la descarga tanto en el cliente como en el servidor (`FR-31`, `FR-33`, `FR-34`, `NFR-03`, `UX-19`).
### Sprint Duración: 15 marzo - 8 Mayo 2026
### Product Owner: Jose Octavio Sánchez Contreras
### Tareas: hechas 11 hechas / 14 planeadas (85% velocity)
