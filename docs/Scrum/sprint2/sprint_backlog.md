# Sprint Backlog 2 — Flying With You
**Período:** 31 de marzo – 8 de mayo de 2026 (5 semanas)
**Institución:** CBTis 47
**Sprint anterior:** Sprint 1 (Diseño del modelo de datos)

---

## 1. Sprint Goal (Objetivo del Sprint)

**Construir la base de datos real en Supabase, crear el primer prototipo funcional de interfaces y conectar la base de datos con el frontend.**  
Al final del sprint, el equipo debe tener: (1) la base de datos implementada en Supabase con todas las tablas del modelo ER, (2) un primer borrador de las interfaces HTML/CSS/JS, (3) datos de prueba insertados manualmente en las tablas, (4) la conexión funcional entre la base de datos y el frontend.  
La generación de datos de prueba masivos no se completó.

---

## 2. Datos del Sprint

| Concepto | Valor |
|----------|-------|
| Duración | 5 semanas |
| Días hábiles por semana | 4 días  |
| Total de días | 20 días |
| Horas efectivas por día | 3 horas |
| **Capacidad total del sprint** | **300 horas** |
| Story Points planeados | 34 puntos |
| Story Points completados | 28 puntos (≈82% de cumplimiento) |

---

## 3. Product Backlog Actualizado (11 User Stories)

Al cierre del Sprint 1, el Product Backlog se mantuvo en **11 historias de usuario**.  
Para el Sprint 2 se seleccionaron todas las historias de alta prioridad relacionadas con base de datos + interfaces + conexión.

---

## 4. Sprint Backlog — Historias Asignadas al Sprint 2

| ID | Historia | Prioridad | SP | Responsable | Estado |
|----|----------|-----------|----|--------------|--------|
| **DB-01** | Crear proyecto en Supabase y configurar autenticación | High | 2 | German | ✅ Hecho |
| **DB-02** | Crear tabla PERSON con todas las columnas definidas | High | 2 | Edson | ✅ Hecho |
| **DB-03** | Crear tabla USER (vinculada a Supabase Auth) | High | 2 | Edson | ✅ Hecho |
| **DB-04** | Crear tablas AIRPORT, AIRPLANE_MODEL, AIRPLANE, FLIGHT | High | 3 | German | ✅ Hecho |
| **DB-05** | Crear tablas FLIGHT_BOOKING y BOOKING_SEAT | High | 2 | Michelle | ✅ Hecho |
| **DB-06** | Crear tablas de trolebús (ROUTE, BUS_STATION, ROUTE_STOP) | High | 2 | Johana | ✅ Hecho |
| **DB-07** | Crear tablas TROLLEY_MODEL, TROLLEY, TROLLEY_TRIP | Medium | 2 | Johana | ✅ Hecho |
| **DB-08** | Crear tablas TROLLEY_BOOKING y TICKET | High | 2 | Michelle | ✅ Hecho |
| **DB-09** | Crear tabla PAYMENT con FKs opcionales | High | 2 | German | ✅ Hecho |
| **DB-10** | Definir políticas de seguridad RLS en Supabase | Medium | 3 | Edson | ❌ **Pendiente (S3)** |
| **UI-01** | Maquetar página de registro de usuario (HTML/CSS) | High | 2 | Daniel | ✅ Hecho |
| **UI-02** | Maquetar página de login | High | 1 | Daniel | ✅ Hecho |
| **UI-03** | Maquetar dashboard principal | High | 2 | Daniel | ✅ Hecho |
| **UI-04** | Maquetar buscador de vuelos | High | 2 | Michelle | ✅ Hecho |
| **UI-05** | Maquetar mapa de asientos (visual, sin lógica) | High | 3 | Michelle | ✅ Hecho |
| **UI-06** | Maquetar listado de rutas de trolebús | High | 2 | Johana | ✅ Hecho |
| **UI-07** | Maquetar pantalla de pago simulado | High | 2 | Johana | ✅ Hecho |
| **UI-08** | Maquetar pantalla de ticket y botón de PDF | Medium | 2 | Daniel | ✅ Hecho |
| **DATA-01** | Insertar datos de prueba: aeropuertos | High | 1 | German | ✅ Hecho |
| **DATA-02** | Insertar datos de prueba: modelos de avión y aviones | High | 1 | German | ✅ Hecho |
| **DATA-03** | Insertar datos de prueba: vuelos | High | 2 | Michelle | ⚠️ Parcial |
| **DATA-04** | Insertar datos de prueba: rutas de trolebús | High | 2 | Johana | ⚠️ Parcial |
| **DATA-05** | Insertar datos de prueba: usuarios de prueba | Medium | 1 | Edson | ✅ Hecho |
| **INT-01** | Conectar formulario de registro a Supabase Auth | High | 3 | Equipo | ❌ **Pendiente (S3)** |
| **INT-02** | Conectar formulario de login a Supabase Auth | High | 2 | Equipo | ❌ **Pendiente (S3)** |
| **INT-03** | Cargar vuelos desde BD al buscador | High | 3 | Equipo | ❌ **Pendiente (S3)** |

---

## 5. Tareas Realizadas (Desglose por historia cumplida)

| Historia | Tareas ejecutadas |
|----------|-------------------|
| **DB-01 a DB-09** | Creación de todas las tablas del modelo ER en Supabase SQL Editor. Definición de PK, FK, tipos ENUM, restricciones NOT NULL. |
| **UI-01 a UI-08** | Diseño de interfaces en HTML5/CSS3 con layout responsivo (Flex/Grid). Implementación de maquetas sin lógica JS de backend. |
| **DATA-01,02,05** | Inserción manual de registros mediante sentencias INSERT. |
| **DATA-03 (parcial)** | Inserción parcial de vuelos. Causa: tiempo insuficiente por complejidad de FKs. |
| **DATA-04 (parcial)** | Inserción parcial de rutas de trolebús. Pendiente para S3. |

---

## 6. Tareas Pendientes (Pasan al Sprint 3)

| ID | Tarea | Prioridad | Justificación |
|----|-------|-----------|---------------|
| DB-10 | Políticas RLS (Row Level Security) en Supabase | High | Requiere investigación adicional |
| DATA-03 | Insertar vuelos restantes | High | No se completó por tiempo |
| DATA-04 | Insertar rutas de trolebús restantes | High | No se completó por tiempo |
| INT-01 | Conectar registro a Supabase Auth | High | El enlace BD-frontend no se completó |
| INT-02 | Conectar login a Supabase Auth | High | El enlace BD-frontend no se completó |
| INT-03 | Cargar vuelos dinámicamente desde BD | High | El enlace BD-frontend no se completó |

---

## 7. Estimación vs. Realidad

| Concepto | Planeado | Realizado | Diferencia |
|----------|----------|-----------|------------|
| Story Points completados | 34 | 28 | -6 SP |
| Tareas finalizadas | 25 | 19 | -6 tareas |
| Horas invertidas | 300 h | 280 h | -20 h (baja asistencia un día) |
| Velocidad real | — | 5.6 SP/semana | Menor a lo esperado |

**Causas principales de desviación:**
- Complejidad no prevista en el enlace de la BD-frontend.
- Configuración de Supabase RLS resultó más compleja de lo estimado.

---

## 8. Impedimentos y Dependencias

| Tipo | Descripción | Impacto | Resolución |
|------|-------------|---------|------------|
| **Impedimento** | Dificultad para entender las políticas RLS de Supabase | DB-10 no se completó | Se investigará en S3 con tutoriales |
| **Dependencia** | Las interfaces UI-04 y UI-05 dependían de tener datos de vuelos | Retraso en pruebas visuales | Se usaron datos mock (HTML estático) |
| **Impedimento** | El equipo no sabía cómo enlazar JS con Supabase | INT-01,02,03 completamente pendientes | Se agendó capacitación para S3 |

---

## 9. Entregables del Sprint 2

| Entregable | Estado | Ubicación |
|------------|--------|------------|
| Base de datos en Supabase (tablas creadas) | ✅ Completado | Supabase Project |
| Datos de prueba parciales | ⚠️ Parcial | Tablas correspondientes |
| Primer borrador de interfaces (pantallas HTML/CSS) | ✅ Completado | Repositorio `/frontend` |
| Conexión BD-Frontend | ❌ No completado | Pendiente S3 |
| Documentación actualizada (este documento) | ✅ Completado | Repositorio `/docs` |

---

## 10. Definition of Done (DoD) para Sprint 2

Una historia se considera **TERMINADA** cuando:

1. ✅ La tarea está implementada en el repositorio (rama `sprint-2`).
2. ✅ Ha sido revisada por al menos otro miembro del equipo.
3. ✅ En caso de ser base de datos: la tabla existe en Supabase y se puede ejecutar `SELECT * FROM tabla`.
4. ✅ En caso de ser interfaz: la pantalla se ve correctamente en Chrome/Edge.
5. ❌ **No se requiere** enlace BD-Frontend para considerar una UI como "terminada" en este sprint (eso es S3).

---

## 11. Retrospectiva Rápida (Sprint 2)

**Qué salió bien:**
- Se completó la creación de todas las tablas según el modelo ER.
- Las interfaces visuales están listas para recibir datos reales.
- El equipo aprendió lo básico de Supabase.

**Qué salió mal:**
- Subestimación de RLS y enlace BD-Frontend.
- Falta de datos de prueba suficientes.
- Desconocimiento de conseptos que afectaron la productividad.

**Qué mejorar para Sprint 3:**
- Capacitación previa en Supabase JS Client.
- Distribuir la carga de inserción de datos desde la semana 1.
- Tener un "día de reserva" para imprevistos.

---

## 12. Compromiso para Sprint 3

El equipo se compromete a:
1. Completar el enlace entre frontend y Supabase (INT-01,02,03).
2. Insertar los datos de prueba faltantes.
3. Implementar las políticas RLS básicas.
4. Tener un flujo completo: registro → login → ver vuelos .

---

*Flying With You — CBTis 47 · Sprint 2 (31 marzo – 8 mayo 2026)*
