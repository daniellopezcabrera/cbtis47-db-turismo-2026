# Sprint Backlog 3 — Flying With You
**Período:** 11 de mayo – 12 de junio de 2026 (5 semanas)
**Institución:** CBTis 47
**Sprint anterior:** Sprint 2 (Base de datos + interfaces + datos de prueba parciales)

---

## 1. Sprint Goal (Objetivo del Sprint)

**El programa debe ser funcional en su totalidad a nivel escolar.**  
Al final del sprint, el equipo debe tener: (1) todas las historias de usuario (23) completamente implementadas, (2) el enlace total entre frontend y Supabase funcionando, (3) los datos de prueba completos, (4) todos los roles funcionando (End User, Pilot, Co-pilot, Flight Attendant, Driver, Administrator), y (5) el flujo completo de extremo a extremo operativo para todos los tipos de usuario.

---

## 2. Datos del Sprint

| Concepto | Valor |
|----------|-------|
| Duración | 5 semanas |
| Días hábiles por semana | 4 días (lunes a jueves) |
| Total de días | 20 días |
| Horas efectivas por día | 3 horas |
| **Capacidad total del sprint** | **300 horas** (20 días × 3 h × 5 integrantes) |
| Story Points planeados | 83 puntos |
| Story Points completados | — (en proceso) |

---

## 3. Product Backlog Actualizado (23 User Stories)

Al inicio del Sprint 3, el Product Backlog creció de 11 a **23 historias de usuario**.  
Las 12 nuevas historias corresponden a los epics:

- EP-06 · Assigned Flight Management (Pilot / Co-pilot)
- EP-07 · In-Flight Service Management (Flight Attendant)
- EP-08 · Trolleybus Route Management (Driver)
- EP-09 · System Administration (Administrator)

---

## 4. Sprint Backlog — Historias Asignadas al Sprint 3

| ID | Historia | Epic | Prioridad | SP | Responsable | Estado |
|----|----------|------|-----------|----|-------------|--------|
| **Pendientes del Sprint 2** | | | | | | |
| DB-10 | Definir políticas de seguridad RLS en Supabase | — | High | 3 | German | En curso |
| DATA-03 | Insertar datos de prueba: vuelos | — | High | 2 | Michelle | En curso |
| DATA-04 | Insertar datos de prueba: rutas de trolebús | — | High | 2 | Johana | En curso |
| INT-01 | Conectar formulario de registro a Supabase Auth | EP-01 | High | 3 | Equipo | En curso |
| INT-02 | Conectar formulario de login a Supabase Auth | EP-01 | High | 2 | Equipo | En curso |
| INT-03 | Cargar vuelos desde BD al buscador | EP-02 | High | 3 | Equipo | En curso |
| **Nuevas historias Sprint 3** | | | | | | |
| **EP-01** | | | | | | |
| US-01 | User Registration | EP-01 | High | 5 | Daniel | Por iniciar |
| US-02 | User Login | EP-01 | High | 2 | Daniel | Por iniciar |
| US-03 | User Logout | EP-01 | Medium | 1 | Daniel | Por iniciar |
| **EP-02** | | | | | | |
| US-04 | Flight Search | EP-02 | High | 5 | Michelle | Por iniciar |
| US-05 | Seat Selection for Flights | EP-02 | High | 5 | Michelle | Por iniciar |
| US-06 | Flight Reservation Confirmation | EP-02 | High | 3 | Michelle | Por iniciar |
| **EP-03** | | | | | | |
| US-07 | Browse Trolleybus Routes | EP-03 | High | 3 | Johana | Por iniciar |
| US-08 | Trolleybus Reservation | EP-03 | High | 5 | Johana | Por iniciar |
| **EP-04** | | | | | | |
| US-09 | Complete Payment for a Reservation | EP-04 | High | 5 | Edson | Por iniciar |
| **EP-05** | | | | | | |
| US-10 | Add Reservations to a Ticket | EP-05 | Medium | 3 | Edson | Por iniciar |
| US-11 | Download PDF Ticket | EP-05 | Medium | 5 | Edson | Por iniciar |
| **EP-06** | | | | | | |
| US-12 | Consult Assigned Flights | EP-06 | High | 3 | German | Por iniciar |
| US-13 | View Flight Passenger Manifest | EP-06 | High | 3 | German | Por iniciar |
| US-14 | Update Flight Status | EP-06 | High | 3 | German | Por iniciar |
| **EP-07** | | | | | | |
| US-15 | Consult Passengers and Assigned Seats | EP-07 | High | 3 | Michelle | Por iniciar |
| US-16 | Record In-Flight Incidents | EP-07 | Medium | 3 | Michelle | Por iniciar |
| **EP-08** | | | | | | |
| US-17 | Consult Daily Trips and Passengers | EP-08 | High | 3 | Johana | Por iniciar |
| US-18 | Update Trolleybus Trip Status | EP-08 | Medium | 2 | Johana | Por iniciar |
| **EP-09** | | | | | | |
| US-19 | Manage Flights (CRUD) | EP-09 | High | 5 | Edson | Por iniciar |
| US-20 | Manage Trolleybus Routes and Trips (CRUD) | EP-09 | High | 5 | Edson | Por iniciar |
| US-21 | Manage Agency Staff | EP-09 | High | 5 | Daniel | Por iniciar |
| US-22 | View Reservation and Payment Reports | EP-09 | Medium | 3 | German | Por iniciar |
| US-23 | Cancel or Modify a Reservation | EP-09 | High | 3 | German | Por iniciar |

---

## 5. Tareas Pendientes del Sprint 2 (por completar)

| ID | Tarea | Estado | Plan de cierre |
|----|-------|--------|----------------|
| DB-10 | Políticas RLS en Supabase | En curso | Semana 1 del Sprint 3 |
| DATA-03 | Insertar datos de prueba: vuelos | En curso | Semana 1 del Sprint 3 |
| DATA-04 | Insertar datos de prueba: rutas de trolebús | En curso | Semana 1 del Sprint 3 |
| INT-01 | Conectar registro a Supabase Auth | En curso | Semana 1-2 del Sprint 3 |
| INT-02 | Conectar login a Supabase Auth | En curso | Semana 1-2 del Sprint 3 |
| INT-03 | Cargar vuelos dinámicamente desde BD | En curso | Semana 2 del Sprint 3 |

---

## 6. Tareas del Sprint 3 por Epic

### EP-01 · User Authentication (Daniel)

| Tarea | Descripción |
|-------|-------------|
| INT-01 completar | Conexión registro → Supabase Auth + inserción en PERSON y USER |
| INT-02 completar | Conexión login → resolución username a email → autenticación |
| US-01 finalizar | Validaciones CURP, email duplicado, formatos, manejo de errores |
| US-02 finalizar | Bloqueo tras intentos fallidos, manejo de cuenta deshabilitada |
| US-03 implementar | Cierre de sesión + expiración por inactividad |

### EP-02 · Flight Reservation (Michelle)

| Tarea | Descripción |
|-------|-------------|
| INT-03 completar | Cargar vuelos desde FLIGHT al buscador HTML |
| US-04 finalizar | Filtros, validaciones (fecha pasada, mismo origen/destino) |
| US-05 finalizar | Mapa de asientos desde AIRPLANE_MODEL, colores según BOOKING_SEAT |
| US-06 finalizar | Creación de FLIGHT_BOOKING + BOOKING_SEAT, timer de 10 min, expiración |

### EP-03 · Tourist Trolleybus Reservation (Johana)

| Tarea | Descripción |
|-------|-------------|
| DATA-04 completar | Insertar rutas restantes en ROUTE y ROUTE_STOP |
| US-07 finalizar | Listado de rutas con parada de salida desde ROUTE_STOP |
| US-08 finalizar | Reserva con boarding_stop, TROLLEY_BOOKING, timer de 10 min |

### EP-04 · Payment Processing (Edson)

| Tarea | Descripción |
|-------|-------------|
| US-09 finalizar | Pago simulado, inserción en PAYMENT, cambio de status a confirmed |
| Validar | Rechazo de pago si expires_at ya pasó, manejo de pago fallido |
| Cash payment | Cálculo de cambio, validación de monto insuficiente |

### EP-05 · PDF Ticket Generation (Edson)

| Tarea | Descripción |
|-------|-------------|
| US-10 finalizar | Acumular reservas confirmadas en ticket, evitar duplicados, límite |
| US-11 finalizar | Generación PDF con jsPDF, bloqueo de segunda descarga (TICKET table) |

### EP-06 · Assigned Flight Management (German)

| Tarea | Descripción |
|-------|-------------|
| US-12 finalizar | Mostrar vuelos asignados al piloto/co-piloto logueado |
| US-13 finalizar | Mostrar manifiesto de pasajeros (FLIGHT_BOOKING + BOOKING_SEAT + PERSON) |
| US-14 finalizar | Actualizar status: scheduled → departed → cancelled (solo piloto) |

### EP-07 · In-Flight Service Management (Michelle)

| Tarea | Descripción |
|-------|-------------|
| US-15 finalizar | Mostrar pasajeros + asientos para vuelo asignado (solo flight attendant) |
| US-16 finalizar | Crear tabla INCIDENT, registrar incidentes solo en vuelos departed |

### EP-08 · Trolleybus Route Management (Johana)

| Tarea | Descripción |
|-------|-------------|
| US-17 finalizar | Mostrar trips del día para el driver logueado + pasajeros por trip |
| US-18 finalizar | Actualizar status: scheduled → in_progress → completed |

### EP-09 · System Administration (Edson, Daniel, German)

| Tarea | Descripción | Responsable |
|-------|-------------|-------------|
| US-19 | CRUD de FLIGHT (crear, editar, eliminar con validaciones) | Edson |
| US-20 | CRUD de ROUTE, TROLLEY_ROUTE_SCHEDULE, TROLLEY_TRIP | Edson |
| US-21 | CRUD de EMPLOYEE + PERSON + USER + Supabase Auth | Daniel |
| US-22 | Reportes de reservas y pagos con filtros | German |
| US-23 | Cancelar o modificar reservas (cambiar status) | German |

---

## 7. Impedimentos y Dependencias

| Tipo | Descripción | Impacto | Plan de mitigación |
|------|-------------|---------|---------------------|
| **Impedimento** | RLS (Row Level Security) requiere investigación profunda | Puede retrasar acceso por roles | Capacitación en semana 1, implementación en semana 2 |
| **Dependencia** | US-12 a US-18 dependen de tener EMPLOYEE con roles asignados | No se pueden probar sin datos | DATA-05 debe incluir empleados de prueba |
| **Impedimento** | jsPDF requiere formato específico para tablas | Posible retraso en US-11 | Prototipo de PDF en semana 2 |
| **Dependencia** | US-19 a US-23 requieren que INT-01 e INT-02 estén completos | El admin debe poder loguearse | Priorizar INT-01 e INT-02 en semana 1 |
| **Riesgo** | 83 SP en 5 semanas puede ser agresivo | Posible incumplimiento | Priorizar historias High, Medium pueden pasar a S4 si es necesario |

---

## 8. Definición de Roles para Pruebas (Datos de prueba necesarios)

| Rol | Tablas involucradas | Datos mínimos necesarios |
|-----|---------------------|--------------------------|
| End User | PERSON, USER, Supabase Auth | 3 cuentas de usuario |
| Pilot | EMPLOYEE (id_occupation = piloto), FLIGHT | 2 pilotos, 4 vuelos asignados |
| Co-pilot | EMPLOYEE (id_occupation = copiloto), FLIGHT | 2 copilotos, 4 vuelos asignados |
| Flight Attendant | EMPLOYEE (id_occupation = sobrecargo), FLIGHT | 2 asistentes, 4 vuelos asignados |
| Driver | EMPLOYEE (id_occupation = conductor), TROLLEY_TRIP | 2 conductores, 6 trips asignados |
| Administrator | EMPLOYEE (id_occupation = administrador) + USER | 1 administrador |

---

## 9. Estimación de Carga por Semana

| Semana | Foco principal | SP planeados | Responsables |
|--------|----------------|--------------|--------------|
| Semana 1 (11-14 mayo) | Completar pendientes S2 (DB-10, DATA-03, DATA-04, INT-01, INT-02, INT-03) | ~15 | Todo el equipo |
| Semana 2 (18-21 mayo) | EP-01, EP-02, EP-03 (flujo usuario final) | ~20 | Daniel, Michelle, Johana |
| Semana 3 (25-28 mayo) | EP-04, EP-05 (pago y ticket) + inicio EP-06 | ~18 | Edson, German |
| Semana 4 (1-4 junio) | EP-06, EP-07, EP-08 (roles operativos) | ~15 | German, Michelle, Johana |
| Semana 5 (8-12 junio) | EP-09 (administrador) + integración + pruebas finales | ~15 | Edson, Daniel, German |

---

## 10. Definition of Done (DoD) para Sprint 3

Una historia se considera **TERMINADA** cuando:

1. ✅ El código está implementado en la rama `sprint-3` y fusionado a `main`.
2. ✅ Ha sido revisada por al menos otro miembro del equipo (peer review).
3. ✅ La base de datos tiene las tablas, FKs y RLS necesarios para la historia.
4. ✅ Los datos de prueba existen para demostrar la funcionalidad.
5. ✅ Los criterios de aceptación en Gherkin se cumplen (probados manualmente).
6. ✅ El flujo funciona en Chrome/Edge sin errores de consola.
7. ✅ La historia ha sido demostrada al Product Owner (Daniel López Cabrera).
8. ✅ No hay bugs críticos que bloqueen el flujo principal del usuario.

**Criterio general para el sprint completo:**  
Una persona con cualquier rol (End User, Pilot, Driver, Administrator) puede completar su flujo principal sin errores.

---

## 11. Entregables del Sprint 3 (proyectados)

| Entregable | Estado proyectado |
|------------|-------------------|
| 23 historias de usuario implementadas | ⚠️ En progreso |
| Conexión total frontend ↔ Supabase | ⚠️ En progreso |
| Datos de prueba completos (vuelos, rutas, empleados, usuarios) | ⚠️ En progreso |
| RLS configurado para todos los roles | ⚠️ En progreso |
| Flujo End User: registro → login → buscar vuelo → seleccionar asiento → pagar → PDF | ⚠️ En progreso |
| Flujo Pilot: ver vuelos asignados → ver manifiesto → actualizar status | ⚠️ En progreso |
| Flujo Driver: ver trips del día → ver pasajeros → actualizar status | ⚠️ En progreso |
| Flujo Administrator: CRUD de vuelos, rutas, empleados, reportes, cancelaciones | ⚠️ En progreso |
| Documentación actualizada (este documento) | ✅ Completado |

---

*Flying With You — CBTis 47 · Sprint 3 (11 mayo – 12 junio 2026)*
