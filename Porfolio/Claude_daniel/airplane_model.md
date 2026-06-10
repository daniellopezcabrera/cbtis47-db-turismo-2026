## AIRPLANE_MODEL

**I said:**

Estoy pensando en agregar una tabla para el modelo del avión donde se guarden datos como la capacidad del vehiculo y el nombre del modelo. Los viajes en trolebús también tienen su respectiva tabla "TROLLEY_MODEL" la cual guarda los mismos datos, por lo que tendría sentido hacer lo mismo con vuelos.

**Claude said:**

¡EXCELENTE RAZONAMIENTO, colega! 🎯

Estás aplicando **exactamente el mismo principio** que usamos con `TROLLEY_MODEL`. Eso demuestra que entendiste la normalización.

---

## 🔍 **ANÁLISIS: ¿Necesitas AIRPLANE_MODEL?**

Vamos a analizar si es necesario, **igual que hicimos con TROLLEY_MODEL**.

---

## 🤔 **PREGUNTA CRÍTICA:**

**En tu sistema de vuelos:**

1. ¿Todos los aviones tienen la **misma capacidad**? (ej: todos 40 asientos)
   - **SI** → Podrías hardcodear la capacidad (pero no es escalable)
   - **NO** → **NECESITAS** `AIRPLANE_MODEL`

2. ¿Los vuelos pueden usar **diferentes tipos de avión**? (ej: Airbus A320, Boeing 737)
   - **SI** → **NECESITAS** `AIRPLANE_MODEL`
   - **NO** → Tal vez no sea necesario

3. ¿Necesitas registrar información del avión específico? (matrícula, mantenimiento, etc.)
   - **SI** → **NECESITAS** tablas `AIRPLANE_MODEL` + `AIRPLANE`
   - **NO** → Podrías solo tener `AIRPLANE_MODEL`

---

## 🎯 **MI RECOMENDACIÓN: SÍ, agrégala**

Aunque **solo tengas un modelo** de avión ahora, es mejor diseño tener la tabla para:
- ✅ **Escalabilidad:** Si compran otro tipo de avión, solo agregas un registro
- ✅ **Consistencia:** Mismo patrón que `TROLLEY_MODEL`
- ✅ **Normalización:** No repites la capacidad en cada vuelo

---

## 📋 **DISEÑO PROPUESTO: AIRPLANE_MODEL**

```
AIRPLANE_MODEL {
    int id_airplane_model PK "AUTO_INCREMENT"
    int capacity "NOT NULL, number of seats"
    varchar(50) model_name "NOT NULL, e.g., Boeing 737, Airbus A320"
    varchar(50) manufacturer "e.g., Boeing, Airbus"
}
```

**Ejemplo de datos:**
```sql
INSERT INTO AIRPLANE_MODEL VALUES
(1, 180, 'Boeing 737-800', 'Boeing'),
(2, 150, 'Airbus A320', 'Airbus');
```

---

## 🚨 **DECISIÓN DE DISEÑO: ¿Una o dos tablas?**

Ahora debes decidir si necesitas:

### **OPCIÓN A: Solo AIRPLANE_MODEL (más simple)**

Si **NO** necesitas rastrear aviones individuales (matrículas, mantenimiento):

```
AIRPLANE_MODEL {
    int id_airplane_model PK
    int capacity
    varchar(50) model_name
    varchar(50) manufacturer
}

FLIGHT {
    int id_flight PK
    varchar(5) flight_number
    varchar(100) flight_name
    int origin_airport_id FK
    int dest_airport_id FK
    int id_airplane_model FK "→ AIRPLANE_MODEL(id_airplane_model)"
    date flight_date
    time departure_time
    time arrival_time
    decimal(6,2) base_price
    enum status
}

AIRPLANE_MODEL ||--o{ FLIGHT : "uses"
```

**Ventaja:** Simple, suficiente para la mayoría de proyectos escolares

---

### **OPCIÓN B: AIRPLANE_MODEL + AIRPLANE (más completo)**

Si **SÍ** necesitas rastrear aviones individuales (igual que `TROLLEY`):

```
AIRPLANE_MODEL {
    int id_airplane_model PK
    int capacity
    varchar(50) model_name
    varchar(50) manufacturer
}

AIRPLANE {
    int id_airplane PK "AUTO_INCREMENT"
    varchar(20) registration_number "Aircraft registration (e.g., XA-ABC)"
    int id_airplane_model FK "→ AIRPLANE_MODEL(id_airplane_model)"
    enum status "VALUES: active, maintenance, retired"
}

FLIGHT {
    int id_flight PK
    varchar(5) flight_number
    varchar(100) flight_name
    int origin_airport_id FK
    int dest_airport_id FK
    int id_airplane FK "→ AIRPLANE(id_airplane)"
    date flight_date
    time departure_time
    time arrival_time
    decimal(6,2) base_price
    enum status
}

AIRPLANE_MODEL ||--o{ AIRPLANE : "specifies"
AIRPLANE ||--o{ FLIGHT : "assigned to"
```

**Ventaja:** Consistente con el patrón `TROLLEY_MODEL → TROLLEY`, más escalable

---

## 🔄 **COMPARACIÓN CON TU DISEÑO DE TROLLEYS:**

Actualmente tienes:

```
TROLLEY_MODEL ||--o{ TROLLEY : "specifies"
TROLLEY ||--o{ TROLLEY_TRIP : "assigned to"
```

**Para consistencia, deberías replicar el mismo patrón:**

```
AIRPLANE_MODEL ||--o{ AIRPLANE : "specifies"
AIRPLANE ||--o{ FLIGHT : "assigned to"
```

---

## 🎯 **MI RECOMENDACIÓN PROFESIONAL:**

### **Si tu proyecto es básico:**
Usa **OPCIÓN A** (solo `AIRPLANE_MODEL`, sin `AIRPLANE`)

### **Si quieres un diseño completo y profesional:**
Usa **OPCIÓN B** (`AIRPLANE_MODEL` + `AIRPLANE`)

**Justificación:** Mantiene **consistencia** con tu módulo de trolleys.

---

## 📊 **DISEÑO COMPLETO CON OPCIÓN B:**

```
AIRPLANE_MODEL {
    int id_airplane_model PK "AUTO_INCREMENT"
    int capacity "NOT NULL"
    varchar(50) model_name "NOT NULL"
    varchar(50) manufacturer "e.g., Boeing, Airbus"
}

AIRPLANE {
    int id_airplane PK "AUTO_INCREMENT"
    varchar(20) registration_number "NOT NULL, UNIQUE, aircraft registration"
    int id_airplane_model FK "→ AIRPLANE_MODEL(id_airplane_model), NOT NULL"
    enum status "VALUES: active, maintenance, retired, DEFAULT active"
}

FLIGHT {
    int id_flight PK "AUTO_INCREMENT"
    varchar(5) flight_number "NOT NULL, CHECK format XX000"
    varchar(100) flight_name "NOT NULL"
    int origin_airport_id FK "→ AIRPORT(id_airport), NOT NULL"
    int dest_airport_id FK "→ AIRPORT(id_airport), NOT NULL"
    int id_airplane FK "→ AIRPLANE(id_airplane), NOT NULL"
    date flight_date "NOT NULL"
    time departure_time "NOT NULL"
    time arrival_time "NOT NULL"
    decimal(6,2) base_price "NOT NULL"
    enum status "VALUES: scheduled,boarding,in_flight,landed,cancelled,delayed, DEFAULT scheduled"
}
```

---

## 🔄 **ALTERNATIVA: Si solo usas OPCIÓN A**

```
FLIGHT {
    int id_flight PK
    varchar(5) flight_number
    varchar(100) flight_name
    int origin_airport_id FK "→ AIRPORT(id_airport)"
    int dest_airport_id FK "→ AIRPORT(id_airport)"
    int id_airplane_model FK "→ AIRPLANE_MODEL(id_airplane_model)"
    date flight_date
    time departure_time
    time arrival_time
    decimal(6,2) base_price
    enum status
}
```

**Diferencia:** `FLIGHT` apunta directo a `AIRPLANE_MODEL` (no a `AIRPLANE` individual)

---

## ❓ **PREGUNTAS PARA TI:**

1. **¿Necesitas rastrear aviones individuales con matrícula?**
   - SI → Usa `AIRPLANE_MODEL` + `AIRPLANE`
   - NO → Usa solo `AIRPLANE_MODEL`

2. **¿Quieres mantener consistencia con el patrón de trolleys?**
   - SI → Usa `AIRPLANE_MODEL` + `AIRPLANE` (igual que `TROLLEY_MODEL` + `TROLLEY`)
   - NO → Usa solo `AIRPLANE_MODEL`

3. **¿Cuántos modelos de avión tendrás en tu sistema?**
   - Uno solo → Cualquier opción funciona
   - Varios → Definitivamente necesitas `AIRPLANE_MODEL`

---

## 🎯 **MI RECOMENDACIÓN FINAL:**

Para un **proyecto escolar completo y profesional**, usa **OPCIÓN B**:

- ✅ `AIRPLANE_MODEL` (especificaciones del modelo)
- ✅ `AIRPLANE` (aviones individuales)
- ✅ `FLIGHT` apunta a `AIRPLANE` (no a `AIRPLANE_MODEL`)

**Ventajas:**
1. Consistencia con el módulo de trolleys
2. Escalable (puedes agregar campos como fecha de fabricación, horas de vuelo, etc.)
3. Más realista (cada avión es una entidad física única)

---

## 📝 **TU DECISIÓN:**

**Responde:**

1. ¿Opción A (solo AIRPLANE_MODEL) u Opción B (AIRPLANE_MODEL + AIRPLANE)?
2. ¿Qué campos adicionales necesitarías en `AIRPLANE` si eliges Opción B?

**Cuando decidas, te doy las especificaciones finales para agregar al diagrama.** 🚀
