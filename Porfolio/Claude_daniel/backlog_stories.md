## USER STORIES (PRODUCT BACKLOG)

**I said:**

Estoy desarrollando un proyecto escolar de cuarto semestre de programación en base de datos SQL el cual registra vuelos y viajes en trolebús. El caso es que tengo el product backlog con las historias de usuario, son un total de 23 y son 9 épicas. Te voy a enviar una por una y me vas a decir si los escenarios planteados son suficientes o si hay algún otro que no esté y me lo puedas sugerir para que lo implemente.

**Claude said:**

¡Claro! Mándame la primera historia de usuario cuando quieras. Analizaré los escenarios planteados y te diré si están completos o si hay alguno adicional que valga la pena agregar. Adelante 🙂

## EP-01 User Aunthentication:

## US-01-User Registration:

¡Buena base! Los 5 escenarios cubren el flujo feliz y los casos de duplicados/campos vacíos. Te sugiero agregar estos escenarios adicionales:

---

**Escenarios que podrían faltar:**

**1. Formato inválido en campos con reglas específicas**
Tienes validación de campos vacíos, pero no de formato. La CURP tiene una estructura fija (18 caracteres alfanuméricos con patrón definido), el email debe tener formato válido, y la contraseña probablemente tenga requisitos mínimos.

```gherkin
Scenario: Registration fails with invalid field formats
  Given the user is on the registration page
  When the user enters a CURP that does not match the official format
  Or the user enters an email without a valid format (e.g. "userexample.com")
  Or the user enters a password shorter than the minimum required length
  And the user submits the registration form
  Then the system displays a format validation message for each invalid field
  And no new record is created
```

**2. Fecha de nacimiento inválida o fuera de rango**
Si el sistema requiere que el usuario sea mayor de cierta edad (o simplemente una fecha real):

```gherkin
Scenario: Registration fails with an invalid date of birth
  Given the user is on the registration page
  When the user enters a date of birth in the future
  Or the user enters a date that does not exist (e.g. February 30)
  And the user submits the registration form
  Then the system displays an error indicating the date of birth is not valid
  And no new record is created
```

**3. Fallo de conexión con Supabase Auth**
Útil para mostrar que el sistema maneja errores externos con gracia:

```gherkin
Scenario: Registration fails due to an external service error
  Given the user is on the registration page
  And the Supabase Auth service is unavailable
  When the user submits a valid registration form
  Then the system displays a generic error message indicating a temporary issue
  And the user is invited to try again later
  And no partial record is created in PERSON or USER
```

---

**Resumen de lo que ya tienes vs. lo sugerido:**

| Cobertura | Estado |
|---|---|
| Flujo exitoso | ✅ |
| Email duplicado | ✅ |
| Username duplicado | ✅ |
| CURP duplicada | ✅ |
| Campos vacíos | ✅ |
| Formato inválido (CURP, email, contraseña) | ⚠️ Falta |
| Fecha de nacimiento inválida | ⚠️ Falta |
| Error de servicio externo | ⚠️ Opcional pero recomendado |

Los más importantes para agregar serían el **1 y el 2**, ya que son validaciones de negocio muy comunes en un sistema de registros con datos oficiales como la CURP. El 3 es opcional, depende de qué tan robusto quieras presentar el proyecto. ¡Manda la siguiente cuando quieras!
