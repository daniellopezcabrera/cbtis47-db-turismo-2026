# Software Requirements Specification (SRS)
## Flygth With You
**Versión 1.0 · CBTis 47 · 2026**

---

## Equipo de Desarrollo

| Nombre | Rol |
|---|---|
| López Cabrera Daniel | Analyst & Designer |
| García Sánchez German | SQL Developer |
| Cueto Madrigal Michelle | Query Master |
| Cruz Estrada Johana Elena | SQL Tester |
| Roldan Barrera Edson Yalan | DBA (Database Administrator) |

---

## 1. Descripción General

**Flygth With You** es un sistema web de gestión de reservaciones para una agencia de turismo. Permite a los usuarios registrarse, iniciar sesión, buscar y reservar vuelos o viajes en trolebús turístico, procesar pagos y descargar su boleto en formato PDF como comprobante de la reservación confirmada.

### 1.1 Objetivo del Sistema

Desarrollar una aplicación web funcional que automatice el proceso de contratación de servicios turísticos, desde el registro del usuario hasta la emisión del comprobante de pago, garantizando una experiencia simple y accesible.

### 1.2 Alcance

**Dentro del alcance (v1.0):**
- Registro e inicio de sesión de usuarios.
- Búsqueda, reservación y pago de vuelos.
- Búsqueda, reservación y pago de viajes en trolebús turístico.
- Descarga única del boleto en PDF.
- Gestión de vuelos y rutas por parte del administrador.
- Consulta de vuelos asignados para pilotos y copilotos.
- Registro de incidentes a bordo por azafatos.
- Consulta de viajes diarios para choferes de trolebús.

**Fuera del alcance (v1.0):**
- Integración con pasarela de pago real (el pago es simulado).
- Aplicación móvil nativa.
- Sincronización en tiempo real del mapa de asientos entre sesiones simultáneas.
- Sistema de notificaciones por correo electrónico.
- Despliegue en servidor de producción público.

---

## 2. Stack Tecnológico

El sistema se construye exclusivamente con tecnologías web estándar del lado del cliente, sin frameworks de backend adicionales, en cumplimiento con NFR-17.

| Componente | Tecnología / Versión | Propósito en el proyecto |
|---|---|---|
| Estructura de páginas | HTML5 (Living Standard) | Marcado semántico de todas las vistas del sistema. |
| Presentación visual | CSS3 (Living Standard) | Estilos, diseño responsivo, animaciones y mapa de asientos. |
| Lógica del cliente | JavaScript ES2025 (ECMAScript 16ª edición) | Manejo de eventos, validaciones, temporizador de 10 min, integración con Supabase y generación de PDF. |
| Base de datos y autenticación | Supabase · supabase-js v2.107.0 | PostgreSQL como base de datos principal y Supabase Auth para gestión de sesiones y credenciales. |
| Generación de PDF | jsPDF v4.2.1 | Creación y descarga del boleto en PDF directamente desde el navegador, sin servidor intermediario. |
| Framework CSS | Tailwind CSS v3.4 | Clases utilitarias para construir la interfaz de forma rápida y consistente, sin CSS personalizado redundante. Compatible con el stack HTML + JS puro del proyecto. |
| Control de versiones | Git + GitHub | Historial de cambios, colaboración entre integrantes y respaldo del código fuente (AG-08, AG-09). |

### 2.1 Justificación del Framework CSS — Tailwind CSS v3

El proyecto prohíbe frameworks de backend adicionales (NFR-17), pero no restringe el uso de herramientas del lado del cliente. Tailwind CSS v3 se selecciona por las siguientes razones:

- Es una herramienta puramente del frontend (archivo CSS). No requiere servidor ni proceso de compilación obligatorio; puede integrarse mediante CDN en cualquier archivo HTML.
- Permite mantener la consistencia visual requerida por UX-01 sin duplicar reglas CSS en múltiples archivos.
- Su versión 3.x es ampliamente compatible con navegadores Chromium modernos (NFR-23).
- Facilita el diseño responsivo exigido en UX-02 a través de sus prefijos de breakpoint (`sm:`, `md:`, `lg:`).

### 2.2 Carga de Dependencias (sin gestor de paquetes)

El proyecto no utiliza gestor de paquetes (npm/yarn). Todas las bibliotecas externas se cargan directamente mediante etiquetas `<script>` en el `<head>` de cada archivo HTML:

**Supabase JS Client (v2.107.0)**
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.107.0/dist/umd/supabase.min.js"></script>
```

**jsPDF (v4.2.1)**
```html
<script src="https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js"></script>
```

**Tailwind CSS (v3.4)**
```html
<script src="https://cdn.tailwindcss.com"></script>
```

---

## 3. Requerimientos Funcionales

Los requerimientos funcionales describen **qué debe hacer el sistema** — los comportamientos y funcionalidades específicas que debe proveer a sus usuarios.

---

### 3.1 Autenticación

**FR-01.** El sistema debe permitir a nuevos usuarios registrarse proporcionando su nombre completo, dirección de correo electrónico y contraseña.

**FR-02.** El sistema debe validar que el correo ingresado durante el registro no esté ya asociado a una cuenta existente.

**FR-03.** El sistema debe mostrar un mensaje de validación por cada campo requerido que quede vacío al enviar un formulario.

**FR-04.** El sistema debe autenticar a los usuarios a través de Supabase Auth utilizando correo electrónico y contraseña.

**FR-05.** El sistema debe redirigir al usuario al dashboard principal después de un inicio de sesión exitoso.

**FR-06.** El sistema debe permitir a los usuarios cerrar su sesión activa en cualquier momento.

**FR-07.** Después del cierre de sesión, el sistema debe impedir el acceso a páginas protegidas sin que el usuario vuelva a autenticarse.

---

### 3.2 Reservación de Vuelos

**FR-08.** El sistema debe permitir a los usuarios buscar vuelos disponibles por origen, destino y fecha de viaje.

**FR-09.** El sistema debe mostrar una lista de vuelos disponibles con información de horario y precio cuando una búsqueda devuelve resultados.

**FR-10.** El sistema debe informar al usuario cuando ningún vuelo coincida con los criterios de búsqueda seleccionados.

**FR-11.** El sistema debe mostrar un mapa visual de asientos para el vuelo seleccionado por el usuario.

**FR-12.** Los asientos disponibles deben mostrarse en verde; los asientos ocupados o reservados deben mostrarse en rojo.

**FR-13.** El sistema debe impedir que los usuarios seleccionen asientos ocupados o reservados.

**FR-14.** Al confirmar el asiento, el sistema debe crear un registro de reservación en la base de datos con estatus "pending".

**FR-15.** Al crear la reservación, el sistema debe iniciar y mostrar al usuario un temporizador de cuenta regresiva de 10 minutos.

**FR-16.** Si el temporizador llega a cero antes de completar el pago, el sistema debe cancelar automáticamente la reservación y liberar el asiento.

**FR-17.** El sistema debe impedir que el mismo usuario tenga más de una reservación activa para el mismo vuelo al mismo tiempo.

---

### 3.3 Reservación de Trolebús

**FR-18.** El sistema debe mostrar todas las rutas de trolebús disponibles con su nombre, descripción y lugar de salida.

**FR-19.** El sistema debe informar al usuario si no hay rutas de trolebús disponibles actualmente.

**FR-20.** El sistema debe permitir al usuario seleccionar una ruta, una fecha y una parada de abordaje para crear una reservación.

**FR-21.** Al crear la reservación de trolebús, el sistema debe asignar el estatus "pending" e iniciar el temporizador de 10 minutos.

**FR-22.** El sistema debe informar al usuario si la fecha seleccionada no tiene cupos disponibles para la ruta elegida.

**FR-23.** Si el temporizador expira antes del pago, el sistema debe cancelar la reservación de trolebús y restaurar la disponibilidad del cupo.

---

### 3.4 Pago

**FR-24.** El sistema debe permitir a los usuarios completar un pago simulado para una reservación pendiente.

**FR-25.** Al realizarse el pago exitoso, el sistema debe actualizar el estatus de la reservación de "pending" a "confirmed".

**FR-26.** El sistema debe redirigir al usuario a la pantalla de boleto después de confirmar el pago.

**FR-27.** El sistema debe rechazar intentos de pago si el temporizador de la reservación ya ha expirado.

**FR-28.** Si ocurre un error durante el procesamiento del pago, la reservación debe permanecer en estatus "pending" y el temporizador debe continuar corriendo.

---

### 3.5 Generación de Boleto PDF

**FR-29.** El sistema debe permitir a los usuarios agregar una o más reservaciones confirmadas a un único boleto.

**FR-30.** El sistema debe impedir que reservaciones con estatus "pending" sean agregadas a un boleto.

**FR-31.** El sistema debe generar un archivo PDF descargable que contenga los detalles de todas las reservaciones acumuladas.

**FR-32.** El PDF debe incluir: nombre del vuelo o ruta, número de asiento, fecha de viaje y nombre completo del pasajero.

**FR-33.** Cada boleto solo puede descargarse una vez; intentos posteriores de descarga deben bloquearse con un mensaje explicativo.

**FR-34.** Si no se han agregado reservaciones al boleto, el sistema debe impedir la descarga y mostrar un mensaje de validación.

---

## 4. Requerimientos Ágiles

Los requerimientos ágiles definen **cómo debe organizarse y conducirse el proceso de desarrollo** bajo la metodología Scrum.

**AG-01.** El proyecto debe organizarse en Sprints de duración fija, cada uno con un objetivo definido y alcanzable.

**AG-02.** Cada Sprint debe iniciar con una sesión de planeación donde el equipo selecciona Historias de Usuario del Product Backlog.

**AG-03.** Toda Historia de Usuario debe seguir el formato: *Como [tipo de usuario], quiero [acción], para que [beneficio]*.

**AG-04.** Toda Historia de Usuario debe contar con criterios de aceptación escritos en formato Gherkin (Given / When / Then).

**AG-05.** Toda Historia de Usuario debe tener un valor de Story Points estimado antes de iniciar el desarrollo.

**AG-06.** El equipo debe mantener un Product Backlog ordenado por prioridad (Alta / Media / Baja).

**AG-07.** Al finalizar cada Sprint, el equipo debe realizar un Sprint Review demostrando la funcionalidad completada.

**AG-08.** Todo el código fuente debe estar bajo control de versiones con Git y alojado en GitHub.

**AG-09.** Cada integrante del equipo debe hacer commits de su propio trabajo bajo su propia cuenta de GitHub — repositorios con un solo autor no son aceptables.

**AG-10.** La documentación del proyecto (Resumen Técnico, Backlog, Requerimientos) debe mantenerse actualizada en el repositorio.

---

## 5. Requerimientos UI/UX

Los requerimientos UI/UX definen **cómo debe verse y comportarse la interfaz** para garantizar una experiencia clara y usable para todos los usuarios.

---

### 5.1 Interfaz General

**UX-01.** La aplicación debe tener una identidad visual consistente en todas las páginas: colores, tipografía y logotipo.

**UX-02.** Todas las páginas deben ser responsivas y adaptarse correctamente a tamaños de pantalla de escritorio.

**UX-03.** La navegación entre las secciones principales (vuelos, trolebús, boletos) debe ser accesible desde un menú superior persistente.

**UX-04.** Todos los botones que desencadenan una acción del sistema deben tener una etiqueta visible que describa dicha acción (ej. "Confirmar reservación").

**UX-05.** El sistema debe mostrar un indicador de carga durante cualquier operación que requiera esperar una respuesta del servidor.

---

### 5.2 Formularios y Validación

**UX-06.** Los campos requeridos en todos los formularios deben estar claramente marcados.

**UX-07.** Los mensajes de validación deben aparecer directamente debajo del campo que falló, no como un pop-up genérico.

**UX-08.** Las contraseñas deben estar ocultas por defecto, con opción de revelarlas durante la captura.

**UX-09.** El usuario debe recibir un mensaje de confirmación visible después de completar exitosamente el registro o inicio de sesión.

---

### 5.3 Mapa de Asientos

**UX-10.** El mapa de asientos debe mostrar la etiqueta de cada asiento (ej. "12A") cuando el usuario pasa el cursor o toca un asiento.

**UX-11.** Los asientos seleccionados deben tener un estado visual distinto (ej. azul), separado de disponible (verde) y ocupado (rojo).

**UX-12.** Una leyenda debe ser visible cerca del mapa de asientos explicando el significado de cada color.

---

### 5.4 Temporizador y Retroalimentación de Estatus

**UX-13.** El temporizador de cuenta regresiva de 10 minutos debe ser permanentemente visible durante el flujo de pago y no debe ser colapsable ni ocultable.

**UX-14.** Cuando queden menos de 2 minutos en el temporizador, una advertencia visual debe alertar al usuario (ej. el temporizador se vuelve rojo).

**UX-15.** Cuando una reservación expire, el usuario debe ser notificado de inmediato con un mensaje claro y una indicación sobre cómo iniciar una nueva reservación.

**UX-16.** El estatus de la reservación (pending / confirmed / expired) debe ser visible para el usuario en todo momento dentro del resumen de reservación.

---

### 5.5 Boleto y PDF

**UX-17.** La pantalla de boleto debe mostrar una vista previa de todas las reservaciones acumuladas antes de que el usuario haga clic en "Descargar".

**UX-18.** El botón "Descargar" debe estar deshabilitado (en gris) si no se han agregado reservaciones al boleto.

**UX-19.** Después de una descarga exitosa, el botón debe cambiar su etiqueta a "Boleto ya emitido" y permanecer deshabilitado de forma permanente.

---

## 6. Requerimientos No Funcionales

Los requerimientos no funcionales definen **qué tan bien debe desempeñarse el sistema** — atributos de calidad que no son características visibles pero que afectan directamente la confiabilidad, seguridad y experiencia del usuario.

---

### 6.1 Rendimiento

**NFR-01.** Los resultados de búsqueda de vuelos y trolebús deben cargar en menos de 3 segundos bajo condiciones normales de red.

**NFR-02.** El mapa de asientos debe renderizarse completamente dentro de 2 segundos a partir de que el usuario selecciona un vuelo.

**NFR-03.** La generación y descarga del PDF debe completarse dentro de 5 segundos después de que el usuario haga clic en "Descargar".

---

### 6.2 Seguridad

**NFR-04.** Las contraseñas de los usuarios nunca deben almacenarse en texto plano; Supabase Auth debe gestionar todas las credenciales.

**NFR-05.** Las páginas protegidas (dashboard, reservaciones, pago) no deben ser accesibles sin una sesión autenticada activa.

**NFR-06.** Los números de tarjeta completos nunca deben almacenarse en la base de datos; solo los últimos cuatro dígitos pueden guardarse para fines de visualización del recibo.

**NFR-07.** Toda la comunicación entre el frontend y Supabase debe utilizar HTTPS.

---

### 6.3 Confiabilidad

**NFR-08.** El temporizador de retención de asiento de 10 minutos debe aplicarse del lado del servidor mediante marcas de tiempo en la base de datos (campos `selected_at` y `expires_at` en la tabla `BOOKING_SEAT`), no únicamente en el navegador del usuario.

**NFR-09.** Cuando una reservación de asiento expire, la base de datos debe actualizar su estatus automáticamente, sin requerir ninguna acción del usuario.

**NFR-10.** Un boleto marcado como descargado debe permanecer bloqueado permanentemente para re-descarga, incluso si el usuario cambia de dispositivo o inicia una nueva sesión.

---

### 6.4 Usabilidad

**NFR-11.** Un usuario sin experiencia previa con el sistema debe poder completar una reservación desde la búsqueda hasta el pago en menos de 5 minutos.

**NFR-12.** Todos los mensajes de error deben estar escritos en lenguaje sencillo, explicando qué ocurrió y qué puede hacer el usuario a continuación.

**NFR-13.** El sistema no debe requerir ninguna instalación o complemento; debe ejecutarse completamente en un navegador web moderno.

---

### 6.5 Mantenibilidad

**NFR-14.** El código del frontend debe organizarse en archivos separados por módulo: autenticación, reservaciones, pagos y boletos.

**NFR-15.** Las consultas SQL deben escribirse de forma que todos los integrantes del equipo puedan leerlas y comprenderlas sin documentación adicional extensa.

**NFR-16.** El repositorio de GitHub debe incluir un archivo README que explique cómo configurar y ejecutar el proyecto localmente.

---

### 6.6 Restricciones

**NFR-17.** El sistema debe construirse exclusivamente con HTML5, CSS3, JavaScript y Supabase — no se permiten frameworks de backend adicionales.

**NFR-18.** El procesamiento de pagos es simulado; no ocurrirán transacciones financieras reales en la versión 1.0.

**NFR-19.** El sistema está diseñado para navegadores web de escritorio; el soporte de aplicación móvil nativa queda fuera del alcance de esta versión.

**NFR-20.** El sistema no garantiza sincronización en tiempo real del mapa de asientos entre sesiones de usuario simultáneas. Si dos usuarios abren el mapa de asientos del mismo vuelo al mismo tiempo, un asiento puede aparecer disponible para ambos hasta que uno de ellos confirme la reservación primero.

**NFR-21.** Todos los precios mostrados en el sistema están denominados en Pesos Mexicanos (MXN).

**NFR-22.** El sistema se desarrolla y está destinado exclusivamente para uso académico dentro del CBTis 47. No se desplegará en un servidor de producción público en la versión 1.0.

**NFR-23.** El sistema está diseñado y probado para su uso en navegadores modernos basados en Chromium (Google Chrome, Microsoft Edge). La compatibilidad con otros navegadores como Firefox o Safari no está garantizada en esta versión.

**NFR-24.** El sistema no permitirá registrar vuelos o viajes en trolebús en fechas u horas pasadas; enviará un mensaje de error.

---

*Flygth With You — CBTis 47 · 2026*
