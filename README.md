# ✈️ Flying With You

> Sistema web de gestión de reservaciones para una agencia de turismo.  
> Permite a los usuarios registrarse, buscar y reservar vuelos o viajes en trolebús turístico, realizar pagos simulados y descargar su boleto en PDF — sin instalaciones, directamente desde el navegador.

---

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![jsPDF](https://img.shields.io/badge/jsPDF-FF0000?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)
![Status](https://img.shields.io/badge/Status-En%20Desarrollo-orange?style=for-the-badge)
![Version](https://img.shields.io/badge/Versión-1.0.0-blue?style=for-the-badge)
![Académico](https://img.shields.io/badge/Uso-Académico%20CBTis%2047-purple?style=for-the-badge)

---

## 📋 Tabla de Contenidos

- [Sobre el proyecto](#-sobre-el-proyecto)
- [Funcionalidades principales](#-funcionalidades-principales)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y configuración](#-instalación-y-configuración)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Flujo general del sistema](#-flujo-general-del-sistema)
- [Estados de una reservación](#-estados-de-una-reservación)
- [Diagrama Entidad-Relación](#️-diagrama-entidad-relación)
- [Metodología de trabajo](#-metodología-de-trabajo)
- [Product Backlog](#-product-backlog)
- [Cómo contribuir](#-cómo-contribuir)
- [Alcance y limitaciones](#️-alcance-y-limitaciones)
- [Equipo de desarrollo](#-equipo-de-desarrollo)
- [Licencia](#-licencia)
---

## 🛡️ Data Security Protocol (DML Operations)

To prevent accidental data loss, this project follows a strict transaction protocol when executing destructive statements (`DELETE` or `UPDATE`).

### Safe Deletion Workflow
Every deletion must be wrapped in a transaction to allow for manual verification before making changes permanent.

```sql
-- 1. Start the transaction context
BEGIN;

-- 2. Execute the filtered delete
-- ALWAYS use a WHERE clause with a Primary Key
DELETE FROM "USER" 
WHERE id_person = 5;

-- 3. Verification Step
-- Run a SELECT to ensure only the intended record was affected.
-- If the row count is incorrect or you made a mistake:
ROLLBACK;

-- 4. If everything is correct, commit the changes:
COMMIT;

---

## 📖 Sobre el proyecto

**Flygth With You** es una aplicación web desarrollada para una agencia de turismo que automatiza el proceso de reservación de servicios turísticos. El sistema cubre el ciclo completo: desde el registro del usuario hasta la emisión de un comprobante de pago descargable en PDF, reduciendo la carga manual de la agencia y mejorando la experiencia del viajero.

El sistema no requiere instalación de software adicional — corre completamente en un navegador moderno basado en Chromium y se conecta a Supabase como backend en la nube.

> 📌 Proyecto desarrollado exclusivamente para uso académico en **CBTis 47 · Abril 2026**.  
> Los precios del sistema están denominados en **Pesos Mexicanos (MXN)**.

---

## ✨ Funcionalidades principales

### 🔐 Autenticación
- Registro de nuevos usuarios (nombre completo, correo, contraseña)
- Inicio y cierre de sesión mediante Supabase Auth
- Validación de campos con mensajes de error por campo individual
- Protección de rutas: las páginas protegidas no son accesibles sin sesión activa

### ✈️ Reservación de vuelos
- Búsqueda de vuelos por origen, destino y fecha
- Mapa visual de asientos: 🟢 disponible · 🔴 ocupado · 🔵 seleccionado
- Leyenda de colores visible junto al mapa en todo momento
- Creación de reservación con estado `pending` y temporizador de 10 minutos
- Cancelación automática server-side si el pago no se completa a tiempo
- Prevención de reservaciones duplicadas para el mismo vuelo y usuario

### 🚎 Reservación de trolebús turístico
- Visualización de rutas disponibles con nombre, descripción y punto de salida
- Reservación por ruta, fecha y parada de abordaje
- Temporizador de 10 minutos con cancelación automática y liberación del lugar

### 💳 Pago simulado
- Procesamiento de pago para reservaciones en estado `pending`
- Cambio de estado de `pending` a `confirmed` al completar el pago exitosamente
- Rechazo automático del pago si el temporizador ya expiró
- La reservación permanece en `pending` si ocurre un error de procesamiento

### 🎫 Generación de boleto PDF
- Acumulación de una o más reservaciones confirmadas en un solo boleto
- Solo se pueden agregar reservaciones con estado `confirmed`
- El PDF incluye: nombre del pasajero, vuelo o ruta, número de asiento, fecha y precio
- Descarga única por boleto — intentos posteriores quedan bloqueados permanentemente, incluso desde otro dispositivo o sesión

---

## 🛠️ Tecnologías utilizadas

| Componente | Tecnología | Notas |
|---|---|---|
| Base de datos | Supabase (PostgreSQL) | Tablas, relaciones y lógica de expiración |
| Autenticación | Supabase Auth | Manejo seguro de sesiones y contraseñas |
| Frontend | HTML5, CSS3, JavaScript | Sin frameworks adicionales |
| Generación de PDF | jsPDF | Cargado vía CDN |
| Control de versiones | Git / GitHub | Un commit por miembro bajo su propia cuenta |

> ⚠️ El proyecto **no utiliza frameworks de backend ni gestor de paquetes** (npm, pip, etc.).  
> Todas las dependencias externas se cargan directamente mediante CDN.

---

## 📋 Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener lo siguiente:

- Navegador basado en Chromium actualizado: **Google Chrome** o **Microsoft Edge**
- Cuenta activa en [Supabase](https://supabase.com) con un proyecto creado
- El esquema SQL del sistema aplicado en ese proyecto de Supabase
- Conexión a internet activa (requerida para CDN y conexión con Supabase)

> ℹ️ No se necesita instalar Node.js, Python, ni ningún otro entorno de ejecución local.

---

## 🚀 Instalación y configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/flygth-with-you.git
cd flygth-with-you
```

### 2. Aplica el esquema de la base de datos

Abre el editor SQL de tu proyecto en Supabase y ejecuta el script `database/schema.sql` del repositorio. Esto creará todas las tablas necesarias: `PERSON`, `USER`, `FLIGHT`, `BOOKING_SEAT`, `TICKET`, `PAYMENT`, entre otras.

### 3. Configura las credenciales de Supabase

Abre el archivo `config/supabase.js` y reemplaza los valores con los de tu proyecto:

```javascript
const SUPABASE_URL = "https://tu-proyecto.supabase.co";
const SUPABASE_KEY = "tu-anon-public-key";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
```

> 🔐 Usa únicamente la `anon key` (clave pública) de Supabase.  
> **Nunca subas una clave de servicio (`service_role`) al repositorio.**

### 4. Incluye las dependencias CDN en tus archivos HTML

Agrega estas etiquetas en el `<head>` de cada HTML que las requiera:

```html
<!-- Supabase: base de datos y autenticación -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- jsPDF: generación de boleto en PDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

### 5. Abre el proyecto en el navegador

Abre `index.html` directamente en tu navegador, o usa la extensión **Live Server** de VS Code para un servidor local con recarga automática.

---

## 📁 Estructura del proyecto

```
flygth-with-you/
│
├── index.html                  # Login / página de entrada
├── register.html               # Registro de nuevo usuario
├── dashboard.html              # Panel principal post-login
│
├── flights/
│   ├── search.html             # Búsqueda de vuelos
│   ├── seat-map.html           # Mapa visual de asientos
│   └── reservation.html        # Confirmación y creación de reservación
│
├── trolleybus/
│   ├── routes.html             # Listado de rutas disponibles
│   └── reservation.html        # Reservación de trolebús
│
├── payment/
│   └── checkout.html           # Flujo de pago simulado con temporizador
│
├── tickets/
│   └── download.html           # Acumulación y descarga única del boleto PDF
│
├── css/
│   └── styles.css              # Estilos globales del sistema
│
├── js/
│   ├── auth.js                 # Módulo: registro, login, logout
│   ├── reservations.js         # Módulo: vuelos y trolebús
│   ├── payment.js              # Módulo: procesamiento de pago
│   └── tickets.js              # Módulo: generación de PDF
│
├── config/
│   └── supabase.js             # Inicialización del cliente Supabase
│
└── database/
    └── schema.sql              # Script SQL con todas las tablas del sistema
```

---

## 🔄 Flujo general del sistema

```
┌──────────────────────────────────────────────┐
│            REGISTRO / LOGIN                  │
└──────────────────┬───────────────────────────┘
                   │ Autenticación exitosa
                   ▼
┌──────────────────────────────────────────────┐
│           DASHBOARD PRINCIPAL                │
│        [Vuelos]      [Trolebús]              │
└──────────┬───────────────────┬───────────────┘
           │                   │
           ▼                   ▼
    Búsqueda de vuelo    Rutas disponibles
    por origen/destino   de trolebús
           │                   │
           ▼                   ▼
    Selección de         Selección de ruta,
    asiento en mapa      fecha y parada
           │                   │
           └─────────┬─────────┘
                     ▼
     ┌───────────────────────────────┐
     │     Reservación creada        │
     │     Estado: PENDING           │
     │     ⏱ Temporizador: 10 min   │
     └───────────────┬───────────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
        ▼                          ▼
 Pago completado          Temporizador expira
 dentro del tiempo        sin pago
        │                          │
        ▼                          ▼
 Estado: CONFIRMED         Estado: EXPIRED
        │                  Asiento liberado
        ▼                  Usuario notificado
 Pantalla de boleto               │
        │                          ▼
        ▼                   Nueva búsqueda
 Agregar al ticket
        │
        ▼
 Generar y descargar PDF
 (una única vez)
        │
        ▼
 Ticket marcado como DOWNLOADED
 Botón bloqueado permanentemente
```

---

## 🔁 Estados de una reservación

El sistema maneja cuatro estados posibles para cada reservación. Comprender este ciclo de vida es clave para el desarrollo:

| Estado | Descripción | Quién lo activa |
|---|---|---|
| `pending` | Reservación creada. Asiento bloqueado. Temporizador activo. | Sistema al confirmar selección |
| `confirmed` | Pago completado con éxito dentro del tiempo límite. | Sistema al procesar el pago |
| `expired` | El temporizador llegó a cero sin que se completara el pago. | Server-side vía `expires_at` en BD |
| `cancelled` | Reservación anulada manualmente o por error del sistema. | Sistema en caso de fallo |

> ⚙️ **Importante:** El temporizador se gestiona **server-side** mediante los campos `selected_at` y `expires_at` en la tabla `BOOKING_SEAT`. El frontend solo muestra la cuenta regresiva visual; la lógica real de expiración vive en la base de datos.

---

## 🗄️ Diagrama Entidad-Relación

```mermaid
erDiagram

    %% SECTION 1 — PERSONAS Y CUENTAS
    PERSON ||--|| USER : "registra como"
    PERSON ||--|| EMPLOYEE : "es"
    OCCUPATION ||--o{ EMPLOYEE : "ocupa"

    PERSON {
        int id_person PK
        varchar name
        varchar last_names
        varchar curp
        date birth_date
        varchar email
    }
    USER {
        int id_person PK "FK compartida con PERSON"
        varchar user_name
        varchar password
    }
    EMPLOYEE {
        int id_person PK "FK compartida con PERSON"
        varchar rfc
        int id_occupation FK
    }
    OCCUPATION {
        int id_occupation PK
        varchar name
    }

    %% SECTION 2 — AEROPUERTOS Y VUELOS
    AIRPORT ||--o{ FLIGHT : "origen de"
    AIRPORT ||--o{ FLIGHT : "destino de"
    AIRPLANE_MODEL ||--o{ AIRPLANE : "especifica"
    AIRPLANE ||--o{ FLIGHT : "asignado a"

    AIRPORT {
        int id_airport PK
        varchar city_name
        varchar airport_name
        varchar airport_code
    }
    AIRPLANE_MODEL {
        int id_airplane_model PK
        int capacity
        varchar model_name
    }
    AIRPLANE {
        int id_airplane PK
        varchar registration_number
        int id_airplane_model FK
        enum status "active | maintenance | retired"
    }
    FLIGHT {
        int id_flight PK
        varchar flight_number
        varchar flight_name
        int origin_airport_id FK
        int dest_airport_id FK
        int id_airplane FK
        date flight_date
        time departure_time
        time arrival_time
        decimal base_price
        enum status "scheduled | departed | cancelled"
    }

    %% SECTION 3 — RESERVACIONES DE VUELO
    USER ||--o{ FLIGHT_BOOKING : "realiza"
    FLIGHT ||--o{ FLIGHT_BOOKING : "reservado en"
    FLIGHT_BOOKING ||--o{ BOOKING_SEAT : "incluye"

    FLIGHT_BOOKING {
        int id_booking PK
        int id_user FK
        int id_flight FK
        int number_of_seats
        datetime booking_date
        enum status "pending | confirmed | expired | cancelled"
    }
    BOOKING_SEAT {
        int id_booking_seat PK
        int id_booking FK
        int id_flight FK
        varchar seat_number
        datetime selected_at
        datetime expires_at "= selected_at + 10 minutos"
        enum status "pending | confirmed | expired | cancelled"
    }

    %% SECTION 4 — TROLEBÚS
    TROLLEY_MODEL ||--o{ TROLLEY : "especifica"
    ROUTE ||--|{ ROUTE_STOP : "contiene"
    BUS_STATION ||--o{ ROUTE_STOP : "es parada en"
    ROUTE ||--o{ TROLLEY_ROUTE_SCHEDULE : "tiene"
    TROLLEY_ROUTE_SCHEDULE ||--o{ SCHEDULE_DAY : "ocurre en"
    TROLLEY_ROUTE_SCHEDULE ||--o{ TROLLEY_TRIP : "genera"
    TROLLEY ||--o{ TROLLEY_TRIP : "asignado a"

    TROLLEY_MODEL { int id_model PK; int capacity; varchar model_name }
    TROLLEY { int id_trolley PK; varchar plate_number; int id_model FK }
    ROUTE { int id_route PK; varchar route_name }
    BUS_STATION {
        int id_station PK
        varchar city_name
        varchar station_name
        varchar station_code
        varchar address
    }
    ROUTE_STOP {
        int id_route_stop PK
        int id_route FK
        int id_station FK
        int stop_order
    }
    TROLLEY_ROUTE_SCHEDULE {
        int id_route_schedule PK
        int id_route FK
        time departure_time
        time arrival_time
    }
    SCHEDULE_DAY {
        int id_schedule_day PK
        int id_route_schedule FK
        enum day_of_week "monday|tuesday|...|sunday"
    }
    TROLLEY_TRIP {
        int id_trip PK
        int id_route_schedule FK
        int id_trolley FK
        int origin_station_id FK
        int dest_station_id FK
        date trip_date
        time departure_time
        time arrival_time
        decimal base_price
        enum status "scheduled | in_progress | completed | cancelled"
    }

    %% SECTION 5 — RESERVACIONES DE TROLEBÚS
    USER ||--o{ TROLLEY_BOOKING : "realiza"
    TROLLEY_TRIP ||--o{ TROLLEY_BOOKING : "reservado en"

    TROLLEY_BOOKING {
        int id_booking PK
        int id_user FK
        int id_trip FK
        int boarding_stop_id FK
        int alighting_stop_id FK
        int number_of_seats
        datetime booking_date
        enum status "pending | confirmed | expired | cancelled"
    }

    %% SECTION 6 — BOLETOS Y PAGOS
    FLIGHT_BOOKING ||--|{ TICKET : "genera"
    TROLLEY_BOOKING ||--|{ TICKET : "genera"
    USER ||--o{ PAYMENT : "realiza"
    FLIGHT_BOOKING ||--o| PAYMENT : "pagado con"
    TROLLEY_BOOKING ||--o| PAYMENT : "pagado con"

    TICKET {
        int id_ticket PK
        int id_booking FK
        datetime booking_date
        varchar passenger_full_name
        decimal ticket_price
    }
    PAYMENT {
        int id_payment PK
        int id_user FK
        int id_flight_booking FK "NULL si es pago de trolebús"
        int id_trolley_booking FK "NULL si es pago de vuelo"
        enum payment_method "cash | card | transfer"
        decimal amount
        enum payment_status "pending | completed | failed | refunded"
        datetime payment_date
        datetime completed_at
        varchar reference_number
        varchar card_last_four "solo últimos 4 dígitos"
    }
```

---

## 🏃 Metodología de trabajo

El proyecto se desarrolla bajo la metodología **Scrum**, con las siguientes convenciones:

- El desarrollo está organizado en **Sprints de duración fija**, cada uno con un objetivo claro y alcanzable.
- Cada Sprint comienza con una **sesión de planeación** donde el equipo selecciona User Stories del Product Backlog.
- Cada User Story sigue el formato: *Como [tipo de usuario], quiero [acción], para que [beneficio]*.
- Los criterios de aceptación están escritos en formato **Gherkin** (Given / When / Then).
- Cada User Story tiene un valor de **Story Points** asignado antes del desarrollo.
- El Product Backlog se mantiene ordenado por prioridad: **Alta / Media / Baja**.
- Al final de cada Sprint se realiza un **Sprint Review** demostrando la funcionalidad completada.

### Reglas de control de versiones

- Todo el código está versionado con **Git** y alojado en **GitHub**.
- Cada miembro del equipo debe realizar commits bajo **su propia cuenta de GitHub**.
- No se aceptan repositorios con un único autor.
- La documentación (Resumen Técnico, Backlog, Requisitos) debe mantenerse actualizada en el repositorio.

---

## 📦 Product Backlog

### 🎯 Objetivo del producto

> Permitir a los usuarios de una agencia de turismo registrarse, buscar, reservar y pagar vuelos o viajes en trolebús de forma autónoma a través de una aplicación web, recibiendo un boleto PDF descargable como comprobante de su reservación confirmada.

### Épicas

| ID | Épica | Prioridad |
|---|---|---|
| EP-01 | Autenticación de usuarios | Alta |
| EP-02 | Reservación de vuelos | Alta |
| EP-03 | Reservación de trolebús turístico | Alta |
| EP-04 | Procesamiento de pagos | Alta |
| EP-05 | Generación de boleto PDF | Media |

### User Stories

| ID | User Story | Épica | Prioridad | Puntos |
|---|---|---|---|---|
| US-01 | Registro de usuario | EP-01 | Alta | 3 |
| US-02 | Login de usuario | EP-01 | Alta | 2 |
| US-03 | Logout de usuario | EP-01 | Media | 1 |
| US-04 | Búsqueda de vuelos | EP-02 | Alta | 5 |
| US-05 | Selección de asiento en mapa visual | EP-02 | Alta | 5 |
| US-06 | Confirmación de reservación de vuelo | EP-02 | Alta | 3 |
| US-07 | Explorar rutas de trolebús | EP-03 | Alta | 3 |
| US-08 | Reservación de trolebús | EP-03 | Alta | 5 |
| US-09 | Completar pago de reservación | EP-04 | Alta | 5 |
| US-10 | Agregar reservaciones al boleto | EP-05 | Media | 3 |
| US-11 | Descargar boleto PDF | EP-05 | Media | 5 |
| **Total** | | | | **40 pts** |

---

## 🤝 Cómo contribuir

Este es un proyecto académico de equipo. Sigue estas reglas para mantener el historial limpio y cumplir con los requisitos del proyecto.

### Flujo de trabajo con Git

**1. Siempre trabaja en tu propia rama**
```bash
# Nombra tu rama con tu nombre o la funcionalidad que desarrollas
git checkout -b feature/nombre-de-la-funcionalidad

# Ejemplo:
git checkout -b feature/daniel-seat-map
```

**2. Haz commits pequeños y descriptivos**
```bash
git add .
git commit -m "feat: agrega mapa visual de asientos con colores por estado"
```

**3. Sube tu rama y abre un Pull Request hacia `main`**
```bash
git push origin feature/daniel-seat-map
# Luego abre un Pull Request en GitHub
```

### Convención de commits

| Prefijo | Cuándo usarlo |
|---|---|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de un bug |
| `style:` | Cambios de CSS o UI sin lógica |
| `refactor:` | Restructuración de código sin cambiar comportamiento |
| `docs:` | Cambios en documentación |
| `db:` | Cambios en esquema SQL o queries |

> ⚠️ **Regla obligatoria (AG-09):** Cada miembro del equipo debe hacer commits desde su propia cuenta de GitHub. Los repositorios con un único autor no son aceptables.

---

## ⚠️ Alcance y limitaciones (v1.0)

### Dentro del alcance
- Registro e inicio de sesión de usuarios
- Reservación y pago simulado de vuelos y trolebús
- Descarga única de boleto PDF por reservación confirmada

### Fuera del alcance (v1.0)
- Integración con pasarela de pago real — el pago es completamente simulado
- Aplicación móvil nativa
- Panel administrativo avanzado para la agencia
- Notificaciones por correo electrónico
- Sincronización en tiempo real del mapa de asientos entre sesiones simultáneas

### Restricciones técnicas
- Compatible únicamente con navegadores **Chromium** (Chrome, Edge) — Firefox y Safari no están garantizados
- Diseñado y probado para **escritorio** — el soporte móvil está fuera del alcance en v1.0
- No se pueden registrar vuelos o trolebuses con **fechas u horas pasadas**
- Si dos usuarios abren el mismo vuelo simultáneamente, un asiento puede aparecer disponible para ambos hasta que uno lo confirme primero — no hay sincronización en tiempo real

---

## 👥 Equipo de desarrollo

| Nombre | Rol |
|---|---|
| López Cabrera Daniel | Analista y Diseñador |
| García Sánchez German | Desarrollador SQL |
| Cueto Madrigal Michelle | Query Master |
| Cruz Estrada Johana Elena | SQL Tester |
| Roldan Barrera Edson Yalan | DBA (Administrador de Base de Datos) |

---

## 📄 Licencia

Este proyecto fue desarrollado con fines exclusivamente académicos como parte del plan de estudios del **CBTis 47 (Centro de Bachillerato Tecnológico industrial y de servicios No. 47)**.

**No está permitido:**
- Usar este sistema en un entorno de producción real
- Redistribuirlo con fines comerciales
- Publicarlo como trabajo propio sin atribuir al equipo original

© 2026 Flying With You — CBTis 47. Todos los derechos reservados.

---

*Flying With You — CBTis 47 · Abril 2026*
