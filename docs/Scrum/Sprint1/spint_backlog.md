# 🚀 Sprint 1 Backlog & Cierre de Proyecto

Este documento contiene el desglose de tareas técnicas e historias de usuario desarrolladas, probadas y desplegadas durante el **Sprint 1**, incluyendo los criterios de aceptación cumplidos y la documentación de cierre de cada una.

---

## 🛠️ Infraestructura y Base de Datos

### #INFRA-01 – Crear esquema de base de datos en Supabase
* **Tipo:** Tarea técnica
* **Estado:** Done
* **Responsables:** German García Sánchez, Johana Cruz, Edson Roldan

#### Descripción
Diseño e implementación del esquema relacional en Supabase (PostgreSQL) siguiendo la **Tercera Forma Normal (3FN)** y las convenciones del equipo (tablas en `UPPERCASE`, columnas en `lowercase`, Clave Primaria como `id_tabla`).

Se crearon un total de **19 tablas**:
`PERSON`, `USER`, `EMPLOYEE`, `OCCUPATION`, `AIRPORT`, `AIRPLANE_MODEL`, `AIRPLANE`, `FLIGHT`, `FLIGHT_BOOKING`, `BOOKING_SEAT`, `ROUTE`, `BUS_STATION`, `ROUTE_STOP`, `TROLLEY_MODEL`, `TROLLEY`, `TROLLEY_ROUTE_SCHEDULE`, `SCHEDULE_DAY`, `TROLLEY_TRIP`, `TROLLEY_BOOKING`, `TICKET`, `PAYMENT`.

#### Documentación de cierre
* Script DDL ejecutado exitosamente en la consola SQL de Supabase.
* Verificación estricta de restricciones `NOT NULL`, `FOREIGN KEY` y `CHECK`.
* Inserción de datos de prueba: 10 vuelos, 3 rutas y 5 usuarios.
* Validadores de tiempo programados con `NOW() > expires_at`.
* **Evidencia:** Captura de pantalla de las tablas en el dashboard de Supabase y script `schema.sql` disponible en el repositorio.

---

### #INFRA-02 – Configurar autenticación (Supabase Auth)
* **Tipo:** Tarea técnica
* **Estado:** Done
* **Responsables:** Michelle Cueto, Daniel López

#### Descripción
Habilitación de Supabase Auth utilizando el proveedor de Email/Contraseña. Configuración e implementación de políticas de **Seguridad a Nivel de Fila (RLS)** para garantizar el aislamiento de datos por usuario. Integración del cliente JS de Supabase mediante CDN.

#### Documentación de cierre
* Confirmación de email deshabilitada temporalmente para agilizar la demo.
* Políticas RLS aplicadas directamente en las tablas de reservas y tickets.
* **Pruebas realizadas:** Registro de 3 usuarios concurrentes, inicio de sesión exitoso y validación del aislamiento de datos (un usuario no puede ver las reservas de otro).
* Creación del archivo modular `auth.js` que expone los métodos `signUp`, `signIn` y `signOut`.

---

## 👤 Historias de Usuario (User Stories)

### #US-01 – Registro de usuario
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Michelle Cueto, Johana Cruz

> **Como** nuevo visitante,  
> **quiero** crear una cuenta con mi información personal y una contraseña,  
> **para** poder acceder al sistema y realizar reservas.

#### Criterios de aceptación cumplidos
* **Registro exitoso:** El sistema muestra un mensaje de confirmación al usuario.
* **Correo duplicado:** Se arroja un error controlado si el email ya se encuentra registrado.
* **Campos vacíos:** Validaciones de front-end y back-end activas antes del envío.

#### Documentación de cierre
* Formulario de captura diseñado con los campos: Nombre completo, Email, CURP, Fecha de nacimiento y Contraseña.
* Al registrarse, se crea un registro espejo en las tablas `PERSON` y `USER`, vinculados directamente al `auth.users` global de Supabase.
* Gestión segura de contraseñas delegada a Supabase Auth.
* **Pruebas:** 5 usuarios de prueba registrados exitosamente; los intentos de duplicación fueron bloqueados.

---

### #US-02 – Inicio de sesión
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsable:** Michelle Cueto

> **Como** usuario registrado,  
> **quiero** iniciar sesión con mi email y contraseña,  
> **para** poder gestionar mis reservas.

#### Criterios de aceptación cumplidos
* **Credenciales correctas:** Redirección automática al *dashboard* principal.
* **Credenciales incorrectas:** Alerta o mensaje de error visible sin revelar datos sensibles.

#### Documentación de cierre
* Implementación del método estándar `supabase.auth.signInWithPassword()`.
* Persistencia de la sesión del usuario manejada en el `localStorage`.
* Pruebas de caja negra ejecutadas con credenciales válidas e inválidas de manera exitosa.

---

### #US-03 – Cierre de sesión
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsable:** Michelle Cueto

> **Como** usuario logueado,  
> **quiero** cerrar mi sesión activa,  
> **para** proteger la privacidad de mi cuenta.

#### Criterios de aceptación cumplidos
* **Clic en cerrar sesión:** Destruye la sesión actual y redirige a la pantalla de login.
* **Protección de rutas:** Las páginas privadas quedan inaccesibles una vez cerrada la sesión.

#### Documentación de cierre
* El botón de cierre de sesión invoca correctamente la función `supabase.auth.signOut()`.
* **Prueba de seguridad:** Verificado que al intentar ingresar manualmente a `/dashboard.html` mediante la URL tras el *logout*, el sistema redirige automáticamente al login.

---

### #US-04 – Búsqueda de vuelos
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Edson Roldan, German García

> **Como** usuario logueado,  
> **quiero** buscar vuelos por origen, destino y fecha,  
> **para** planificar mi viaje de forma rápida.

#### Criterios de aceptación cumplidos
* **Con resultados:** Muestra la lista de vuelos con horarios exactos y precios.
* **Sin resultados:** Despliega el mensaje explícito *"No hay vuelos disponibles"*.

#### Documentación de cierre
* Filtros dinámicos en el Front-end: Origen (menú desplegable alimentado por la tabla `AIRPORT`), destino y fecha.
* Consulta SQL optimizada mediante `JOIN` entre las tablas `FLIGHT`, `AIRPLANE_MODEL` y `AIRPORT`.
* **Mejora Post-Sprint:** Se añadió un ordenamiento ascendente por precio por iniciativa del equipo.
* Pruebas cubiertas para escenarios con alta disponibilidad de vuelos y fechas sin operaciones.

---

### #US-05 – Selección de asiento
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Johana Cruz, Daniel López

> **Como** usuario logueado,  
> **quiero** visualizar el mapa de asientos de un vuelo y elegir uno disponible,  
> **para** asegurar mi lugar preferido.

#### Criterios de aceptación cumplidos
* **Mapa interactivo:** Asientos renderizados en Verde (libres) y Rojo (ocupados).
* **Asiento libre:** Al hacer clic, se marca y selecciona para el usuario.
* **Asiento ocupado:** No se permite interacción alguna ni selección.

#### Documentación de cierre
* Mapa interactivo construido dinámicamente mediante un contenedor Grid de CSS.
* El estado de ocupación se consulta en tiempo real desde `BOOKING_SEAT` filtrando por `expires_at > NOW()` o estados con valor `'confirmed'`.
* El asiento pre-seleccionado se almacena temporalmente en el `sessionStorage`.
* **Prueba extrema:** Se forzó una reserva manual vía SQL para comprobar que el cambio a color rojo se reflejara instantáneamente en la interfaz.

---

### #US-06 – Confirmación de reserva de vuelo (con timer)
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Michelle Cueto, German García

> **Como** usuario logueado,  
> **quiero** confirmar mi selección de asiento para apartarlo temporalmente,  
> **para** asegurar que nadie me gane el lugar mientras realizo el pago (máximo 10 minutos).

#### Criterios de aceptación cumplidos
* **Estado inicial:** La reserva se genera inicialmente en estado `"pending"`.
* **Temporizador visible:** Un contador en regresiva inicia exactamente en 10:00.
* **Expiración:** Si el tiempo llega a cero, el asiento se libera automáticamente.

#### Documentación de cierre
* Inserciones transaccionales en las tablas `FLIGHT_BOOKING` y `BOOKING_SEAT` aplicando la regla de base de datos `expires_at = NOW() + interval '10 minutes'`.
* Cronómetro regresivo síncrono programado en JavaScript.
* **Prueba de tiempo:** Se realizó un ajuste controlado reduciendo el timer a 1 minuto; la UI mostró correctamente *"Reserva expirada"* y el asiento en el mapa volvió al color verde de disponibilidad.

---

### #US-07 – Ver rutas de trolebús turístico
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsable:** Edson Roldan

> **Como** usuario logueado,  
> **quiero** ver las rutas de trolebús disponibles en la plataforma,  
> **para** conocer las opciones turísticas adicionales.

#### Criterios de aceptación cumplidos
* **Con rutas:** Tarjetas visuales que muestran nombre, descripción detallada y punto de salida.
* **Sin rutas:** Mensaje claro de *"No hay rutas disponibles"*.

#### Documentación de cierre
* Módulo exclusivo de "Trolebús" que realiza una petición de lectura (`SELECT`) a la tabla `ROUTE`.
* Renderizado a través de tarjetas dinámicas con botones directos para "Reservar".
* **Pruebas:** Verificado inicialmente con 3 rutas estáticas insertadas; posteriormente se ejecutó un truncado de tabla (`TRUNCATE`) para asegurar que el mensaje de "no disponibilidad" se activara correctamente.

---

### #US-08 – Reserva de trolebús
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** German García, Daniel López

> **Como** usuario logueado,  
> **quiero** reservar un espacio en una ruta de trolebús seleccionando fecha y parada,  
> **para** complementar mi itinerario de viaje.

#### Criterios de aceptación cumplidos
* **Reserva exitosa:** Cambia a estado `"pending"` y activa un temporizador de 10 minutos.
* **Sin disponibilidad:** Muestra el error *"No hay lugares disponibles"* en la fecha deseada.

#### Documentación de cierre
* Ventana modal equipada con calendario dinámico (bloquea fechas que no tienen capacidad operativa) y un menú desplegable con paradas específicas.
* Inserción directa de registros en la tabla `TROLLEY_BOOKING`.
* **Prueba de carga máxima:** Se simularon 15 reservaciones consecutivas (tope de capacidad del vehículo); el intento número 16 fue rechazado con éxito por el sistema emitiendo la alerta configurada.

---

### #US-09 – Pago simulado de reserva
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Michelle Cueto, Johana Cruz

> **Como** usuario con reserva pendiente,  
> **quiero** completar el pago antes de que expire el tiempo límite,  
> **para** confirmar mi reserva de manera definitiva y generar mi ticket.

#### Criterios de aceptación cumplidos
* **Pago a tiempo:** Cambia a estado `"confirmed"` y redirige de inmediato a la sección de tickets.
* **Pago a destiempo:** El pago se rechaza y notifica la leyenda *"Reserva expirada"*.

#### Documentación de cierre
* Formulario de pasarela simulada: Se captura nombre del titular, los últimos 4 dígitos de la tarjeta bancaria (almacenados con fines de auditoría), fecha de vencimiento y CVV (este último **nunca** se persiste en BD por seguridad).
* Actualización del estado a `'confirmed'` en cascada y registro del evento en la tabla `PAYMENT`.
* Pruebas exitosas de pago fluido antes de la expiración tanto para vuelos como para trolebús. Pagos intentados tras el vencimiento fueron denegados por la base de datos.

---

### #US-10 – Agregar reservas a un ticket
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsable:** Edson Roldan

> **Como** usuario con múltiples reservas confirmadas,  
> **quiero** consolidar una o más reservas en un único ticket unificado,  
> **para** mantener un control más ordenado de mis itinerarios.

#### Criterios de aceptación cumplidos
* **Agregar reserva:** Si la reserva está confirmada, se añade al resumen dinámico del ticket.
* **Reserva pendiente:** Se bloquea su inserción mostrando un mensaje de advertencia.

#### Documentación de cierre
* Desarrollo de una sección dentro del Perfil de Usuario que lista de forma exclusiva aquellas reservas marcadas como confirmadas y que carecen aún de un identificador de ticket asociado.
* Botón interactivo `"+ Agregar al ticket"` por cada elemento del listado.
* Los elementos seleccionados provisionalmente se gestionan en el `sessionStorage`.
* **Pruebas:** Se agruparon de manera exitosa 2 reservas de vuelo y 1 de trolebús en un mismo lote. Intentos de inyección de reservas pendientes arrojaron el error esperado.

---

### #US-11 – Descargar PDF del ticket (única vez)
* **Tipo:** Historia de usuario
* **Estado:** Done
* **Responsables:** Michelle Cueto, Daniel López

> **Como** usuario con reservas consolidadas en un ticket,  
> **quiero** descargar el comprobante en formato PDF para poder imprimirlo,  
> **con la condición** de poder descargarlo solo una vez por cuestiones de seguridad.

#### Criterios de aceptación cumplidos
* **Ticket válido:** Generación y descarga inmediata del archivo PDF con toda la información consolidada.
* **Segundo intento de descarga:** Bloqueo con la advertencia *"Ya has descargado este ticket"*.
* **Ticket vacío:** El botón de descarga permanece deshabilitado por defecto.

#### Documentación de cierre
* Integración de la biblioteca abierta **jsPDF** mediante CDN.
* El documento PDF estructurado contiene: Encabezado institucional, desglose pormenorizado de reservas agregadas, código alfanumérico único de verificación y la leyenda de advertencia de descarga única.
* Control del flujo mediante la bandera booleana `ticket_downloaded` mapeada directamente en la tabla `TICKET` (para persistencia absoluta).
* **Pruebas de flujo:** Descarga inicial perfecta; los reintentos posteriores se bloquearon mostrando la validación.
### Duració del sprint: 13 de febrero 2026 - 11 marzo 2026
### Product owner: Jose Octavio Sánchez Contreras
### Tareas: 11 entregadas / 11 planeadas (80% de velocity)
