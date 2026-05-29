# Sprint 1 – Planificación y Ejecución (Diseño de Base de Datos)

## 1. Sprint Goal (Objetivo del Sprint)

**Entregar el modelo de datos completo y validado para el sistema Flying With You.**  
Al final del sprint, el equipo debe tener: diagrama entidad-relación (ER) en 3NF, diccionario de datos con todas las tablas y columnas, y las convenciones de nomenclatura definidas. No se construye código ni base de datos real en este sprint.

## 2. Duración del Sprint y Estimación de Tiempo Total

| Concepto | Valor |
|----------|-------|
| Duración | 6 semanas (Febrero-Marzo 2026) |
| Capacidad del equipo | 5 integrantes × 3 horas efectivas/día (clases + proyecto) = 15 horas/día |
| Horas totales del sprint | 405 horas( 15 h/día × 27 días hábiles) |
| Story Points estimados | 21 puntos (solo diseño) |

## 3. Historias de Usuario (Solo Diseño)

Se trabajaron las historias US-01 a US-11, pero **solo en su capa de datos**:
- Tablas necesarias para cada historia fueron identificadas.
- Se modelaron las relaciones y restricciones.
- No se escribió código ni se conectó a Supabase.
-**Se encuentran en el produc backlog correspondiente**

## 4. Desglose de Tareas por Historia 

| Historia | Tareas de diseño realizadas |
|----------|----------------------------|
| **US-01** Registro | Identificar entidades PERSON y USER. Definir atributos (CURP, nombre, email). Establecer relación 1:1. |
| **US-02** Login | Revisar que el modelo permita autenticación. Decidir si o no almacenar contraseñas en tablas. |
| **US-03** Logout | Sin impacto en modelo de datos (solo sesión). |
| **US-04** Búsqueda de vuelos | Crear entidades FLIGHT, AIRPORT, AIRPLANE, AIRPLANE_MODEL. Definir FKs. |
| **US-05** Selección de asiento | Modelar BOOKING_SEAT con expires_at. Decidir si hay tabla SEAT separada o solo un campo seat_number. |
| **US-06** Confirmar reserva | Definir FLIGHT_BOOKING y su relación con BOOKING_SEAT. Establecer status (pending/confirmed/cancelled). |
| **US-07** Ver rutas de trolebús | Crear ROUTE, ROUTE_STOP, BUS_STATION. Definir orden de paradas. |
| **US-08** Reserva de trolebús | Modelar TROLLEY_BOOKING con fecha, status y timer. |
| **US-09** Pago | Crear PAYMENT con last_four_digits (sin número completo). Decidir FK nullable para flight o trolley. |
| **US-10** Agregar a ticket | Modelar TICKET como tabla de cabecera-detalle (relación con reservas confirmadas). |
| **US-11** Descargar PDF | Agregar campo downloaded_at o download_count en TICKET (para bloqueo de segunda descarga). |

## 5. Estimación de Actividades en el Tiempo Establecido

| ID | Historia | Story Points | Esfuerzo real (días) |
|----|----------|--------------|----------------------|
| US-01 | Registro | 2 | 1 día |
| US-02 | Login | 1 | 0.5 día |
| US-03 | Logout | 0 (no aplica) | - |
| US-04 | Búsqueda de vuelos | 3 | 1.5 días |
| US-05 | Selección de asiento | 3 | 1.5 días |
| US-06 | Confirmar reserva | 2 | 1 día |
| US-07 | Ver rutas | 2 | 1 día |
| US-08 | Reserva trolebús | 2 | 1 día |
| US-09 | Pago | 2 | 1 día |
| US-10 | Agregar a ticket | 2 | 1 día |
| US-11 | Descargar PDF | 2 | 1 día |
| **Totales** | | **21 SP** | **≈ 11 días**  |

## 6. Impedimentos y Dependencias

| Tipo | Descripción | Estado |
|------|-------------|--------|
| **Impedimento** | Duda inicial sobre si incluir tabla SEAT independiente o solo un campo en BOOKING_SEAT | Se resolvió en reunión: se optó por campo seat_number por simplicidad en Sprint 1 (pospuesto a Sprint 2) |
| **Impedimento** | Confusión con FKs dobles en FLIGHT (origen y destino apuntan a AIRPORT) | Se documentó en las convenciones y se validó con ejemplos |
| **Dependencia** | Aprobación del profesor/Product Owner sobre el modelo 3NF | Se entregó para revisión al final de la semana 2 |
| **No impedimento** | Herramienta usada: IA de preferencia (1 o mas/persona) / lápiz y papel | Sin bloqueos |

## 7. Definition of Done (DoD) para Sprint 1 (Diseño)

Una tarea o historia de este sprint se considera **TERMINADA** cuando:

1. ✅ **Diagrama ER dibujado** (digital o papel) mostrando todas las tablas, columnas, PK y FK.
2. ✅ **Normalización verificada** hasta 3NF (sin dependencias transitivas ni parciales).
3. ✅ **Diccionario de datos completado** con: nombre de tabla, columna, tipo de dato, restricciones (NOT NULL, UNIQUE, etc.).
4. ✅ **Revisión por pares** (al menos otro miembro del equipo revisó y dio feedback).
5. ✅ **Documentación actualizada** (este resumen técnico refleja el estado final).

**Criterio general del sprint:**  
El modelo de datos es completo, consistente y puede pasar directamente a la fase de implementación (SQL y Supabase) en el Sprint 2.
