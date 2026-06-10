## PAYMENT

**I said:**

Una tabla que no había contemplado es sobre el pago que realiza el usuario a la hora de hacer una reservación. Ayudame contemplando posibles campos que crees que podría llevar.

**Claude said:**

¡EXCELENTE, colega! 🎯

Estás pensando en **completar el flujo de negocio**. El método de pago es **crítico** para cualquier sistema de reservas.

Vamos a diseñar esta tabla correctamente.

---

## 🔍 **ANÁLISIS: ¿Qué información necesitas del pago?**

### **Preguntas clave:**

1. **¿Qué métodos de pago aceptas?**
   - Tarjeta de crédito/débito
   - PayPal
   - Transferencia bancaria
   - Efectivo (pago en sucursal)
   - Otros

2. **¿Guardas información de la tarjeta?**
   - ⚠️ **MUY IMPORTANTE:** Por seguridad y PCI-DSS, **NO debes guardar** números de tarjeta completos
   - Solo guardas últimos 4 dígitos para referencia

3. **¿Un pago puede cubrir múltiples reservas?**
   - Ejemplo: Usuario compra 1 vuelo + 1 trolley en una transacción

4. **¿Necesitas historial de intentos de pago fallidos?**
   - Usuario intenta pagar 3 veces, falla 2, la 3ra funciona

5. **¿Usas pasarela de pago (Stripe, PayPal, MercadoPago)?**
   - Necesitas guardar `transaction_id` de la pasarela

---

## 🎯 **DISEÑO PROPUESTO: PAYMENT**

### **OPCIÓN A: Pago por reserva (1:1)**

Si **cada reserva tiene UN pago**:

```
PAYMENT {
    int id_payment PK "AUTO_INCREMENT"
    int id_booking FK "→ FLIGHT_BOOKING(id_booking) o TROLLEY_BOOKING(id_booking)"
    enum payment_method "VALUES: credit_card, debit_card, paypal, bank_transfer, cash, NOT NULL"
    decimal(10,2) amount "NOT NULL, total amount paid"
    enum payment_status "VALUES: pending, processing, completed, failed, refunded, DEFAULT pending, NOT NULL"
    varchar(100) transaction_id "External payment gateway transaction ID (e.g., Stripe, PayPal)"
    varchar(4) card_last_four "Last 4 digits of card (if applicable)"
    varchar(50) card_brand "e.g., Visa, Mastercard, Amex"
    datetime payment_date "NOT NULL, DEFAULT CURRENT_TIMESTAMP"
    datetime completed_at "When payment was completed"
    text notes "Additional payment notes or error messages"
}
```

**Relación:**
```
FLIGHT_BOOKING ||--|| PAYMENT : "paid with"
TROLLEY_BOOKING ||--|| PAYMENT : "paid with"
```

---

### **OPCIÓN B: Pago puede cubrir múltiples reservas (1:N)**

Si un usuario puede pagar **varios boletos en una transacción**:

```
PAYMENT {
    int id_payment PK "AUTO_INCREMENT"
    int id_user FK "→ USER(id_user), NOT NULL"
    enum payment_method "VALUES: credit_card, debit_card, paypal, bank_transfer, cash, NOT NULL"
    decimal(10,2) total_amount "NOT NULL, total amount of transaction"
    enum payment_status "VALUES: pending, processing, completed, failed, refunded, DEFAULT pending, NOT NULL"
    varchar(100) transaction_id "UNIQUE, external payment gateway ID"
    varchar(4) card_last_four
    varchar(50) card_brand
    datetime payment_date "NOT NULL, DEFAULT CURRENT_TIMESTAMP"
    datetime completed_at
    text notes
}

PAYMENT_BOOKING {
    int id_payment_booking PK "AUTO_INCREMENT"
    int id_payment FK "→ PAYMENT(id_payment), NOT NULL"
    int id_booking FK "Generic reference to booking"
    enum booking_type "VALUES: flight, trolley, NOT NULL"
    decimal(10,2) amount "Amount allocated to this specific booking"
    
    UNIQUE(id_payment, id_booking, booking_type)
}
```

**Relación:**
```
USER ||--o{ PAYMENT : "makes"
PAYMENT ||--o{ PAYMENT_BOOKING : "covers"
FLIGHT_BOOKING ||--o{ PAYMENT_BOOKING : "paid by"
TROLLEY_BOOKING ||--o{ PAYMENT_BOOKING : "paid by"
```

---

## 🤔 **¿CUÁL OPCIÓN NECESITAS?**

### **Usa OPCIÓN A si:**
- Un pago = Una reserva
- Usuario paga cada boleto por separado
- **Más simple para proyecto escolar** ✅

### **Usa OPCIÓN B si:**
- Usuario puede comprar múltiples boletos en una transacción
- Carrito de compras (vuelo + trolley + hotel)
- **Más complejo pero más realista**

---

## 📋 **MI RECOMENDACIÓN PARA TU PROYECTO:**

### **OPCIÓN A SIMPLIFICADA:**

Dado que ya tienes `FLIGHT_BOOKING` y `TROLLEY_BOOKING` separados, usa:

```
PAYMENT {
    int id_payment PK "AUTO_INCREMENT"
    int id_user FK "→ USER(id_user), NOT NULL"
    int id_flight_booking FK "→ FLIGHT_BOOKING(id_booking), NULL"
    int id_trolley_booking FK "→ TROLLEY_BOOKING(id_booking), NULL"
    enum payment_method "VALUES: credit_card, debit_card, paypal, cash, NOT NULL"
    decimal(8,2) amount "NOT NULL, amount paid"
    enum payment_status "VALUES: pending, completed, failed, refunded, DEFAULT pending, NOT NULL"
    varchar(100) transaction_id "External payment reference"
    varchar(4) card_last_four "Last 4 digits (if card payment)"
    datetime payment_date "NOT NULL, DEFAULT CURRENT_TIMESTAMP"
    datetime completed_at "When payment succeeded"
    
    CHECK (
        (id_flight_booking IS NOT NULL AND id_trolley_booking IS NULL) OR
        (id_flight_booking IS NULL AND id_trolley_booking IS NOT NULL)
    ) "Must reference exactly one booking type"
}
```

**Constraint CHECK:** Asegura que el pago sea para **un vuelo O un trolley**, no ambos ni ninguno.

---

## 🔐 **CONSIDERACIONES DE SEGURIDAD:**

### **❌ NUNCA GUARDES:**
```sql
-- ❌ PELIGRO - Violación PCI-DSS
varchar(16) card_number        -- Número completo de tarjeta
varchar(3) cvv                 -- Código de seguridad
varchar(10) expiry_date        -- Fecha de expiración
```

### **✅ SÍ PUEDES GUARDAR:**
```sql
-- ✅ Seguro
varchar(4) card_last_four      -- "4242" (últimos 4 dígitos)
varchar(50) card_brand         -- "Visa", "Mastercard"
varchar(100) transaction_id    -- "ch_3NqF8v2eZvKYlo2C0vY6gPWk" (ID de Stripe)
```

**Razón:** Si guardas tarjetas completas, necesitas cumplir **PCI-DSS Level 1** (carísimo y complejo). Mejor usa pasarelas como Stripe/PayPal que lo manejan por ti.

---

## 💳 **MÉTODOS DE PAGO COMUNES:**

```sql
enum payment_method (
    'credit_card',        -- Tarjeta de crédito
    'debit_card',         -- Tarjeta de débito
    'paypal',             -- PayPal
    'bank_transfer',      -- Transferencia bancaria
    'cash',               -- Efectivo en sucursal
    'mercadopago',        -- MercadoPago (México/LATAM)
    'oxxo',               -- Pago en OXXO
    'spei'                -- SPEI (México)
)
```

**Elige los que apliquen a tu región/proyecto.**

---

## 📊 **ESTADOS DE PAGO:**

```sql
enum payment_status (
    'pending',       -- Pago iniciado pero no completado
    'processing',    -- Procesando con pasarela
    'completed',     -- Pago exitoso
    'failed',        -- Pago rechazado
    'refunded',      -- Dinero devuelto
    'cancelled'      -- Pago cancelado por usuario
)
```

---

## 🔄 **FLUJO DE PAGO:**

### **1. Usuario selecciona asientos:**
```sql
-- BOOKING_SEAT con status = 'selected'
-- expires_at = ahora + 10 minutos
```

### **2. Usuario procede a pagar:**
```sql
INSERT INTO PAYMENT VALUES (
    NULL,                           -- id_payment (auto)
    123,                            -- id_user
    456,                            -- id_flight_booking
    NULL,                           -- id_trolley_booking
    'credit_card',                  -- payment_method
    850.00,                         -- amount
    'pending',                      -- payment_status
    NULL,                           -- transaction_id (aún no)
    NULL,                           -- card_last_four
    NOW(),                          -- payment_date
    NULL                            -- completed_at
);
```

### **3. Pago exitoso con pasarela:**
```sql
UPDATE PAYMENT 
SET 
    payment_status = 'completed',
    transaction_id = 'ch_3NqF8v2eZvKYlo2C0vY6gPWk',
    card_last_four = '4242',
    completed_at = NOW()
WHERE id_payment = 1;

-- Confirmar asientos
UPDATE BOOKING_SEAT 
SET status = 'confirmed', expires_at = NULL
WHERE id_booking = 456;

-- Confirmar reserva
UPDATE FLIGHT_BOOKING
SET status = 'confirmed'
WHERE id_booking = 456;
```

### **4. Pago fallido:**
```sql
UPDATE PAYMENT 
SET 
    payment_status = 'failed',
    notes = 'Card declined: insufficient funds'
WHERE id_payment = 1;

-- Los asientos siguen en 'selected' hasta que expire
-- Si expira, se marcan como 'expired' y se liberan
```

---

## 🎯 **RELACIÓN CON OTRAS TABLAS:**

### **Actualiza FLIGHT_BOOKING y TROLLEY_BOOKING:**

Necesitas saber si una reserva **está pagada**:

```
FLIGHT_BOOKING {
    ...
    enum status "VALUES: pending, confirmed, cancelled"
}

TROLLEY_BOOKING {
    ...
    enum status "VALUES: pending, confirmed, cancelled"
}
```

**Lógica:**
- `status = 'pending'` → Creada pero no pagada
- `status = 'confirmed'` → Pagada (existe PAYMENT con status='completed')
- `status = 'cancelled'` → Cancelada por usuario o expiración

---

## 📋 **DISEÑO FINAL RECOMENDADO:**

```
PAYMENT {
    int id_payment PK "AUTO_INCREMENT"
    int id_user FK "→ USER(id_user), NOT NULL"
    int id_flight_booking FK "→ FLIGHT_BOOKING(id_booking), NULL"
    int id_trolley_booking FK "→ TROLLEY_BOOKING(id_booking), NULL"
    enum payment_method "VALUES: credit_card,debit_card,paypal,cash, NOT NULL"
    decimal(8,2) amount "NOT NULL, amount paid in local currency"
    enum payment_status "VALUES: pending,processing,completed,failed,refunded,cancelled, DEFAULT pending, NOT NULL"
    varchar(100) transaction_id "External payment gateway transaction ID"
    varchar(4) card_last_four "Last 4 digits of card (if applicable)"
    varchar(50) card_brand "e.g., Visa, Mastercard, Amex"
    datetime payment_date "NOT NULL, DEFAULT CURRENT_TIMESTAMP"
    datetime completed_at "Timestamp when payment was completed"
    text notes "Payment notes, error messages, or additional info"
    
    CHECK (
        (id_flight_booking IS NOT NULL AND id_trolley_booking IS NULL) OR
        (id_flight_booking IS NULL AND id_trolley_booking IS NOT NULL)
    ) "Payment must be for exactly one booking type"
}
```

**Relaciones:**
```mermaid
USER ||--o{ PAYMENT : "makes"
FLIGHT_BOOKING ||--o| PAYMENT : "paid with"
TROLLEY_BOOKING ||--o| PAYMENT : "paid with"
```

---

## 🎯 **PREGUNTAS PARA TI:**

1. **¿Qué métodos de pago vas a soportar?**
   - Solo tarjetas
   - PayPal
   - Efectivo
   - Otros

2. **¿Usarás pasarela de pago real (Stripe, PayPal)?**
   - SI → Necesitas `transaction_id`
   - NO (proyecto escolar simulado) → Puedes simplificar

3. **¿Un usuario puede pagar múltiples reservas en una transacción?**
   - SI → Usa OPCIÓN B (tabla PAYMENT_BOOKING)
   - NO → Usa OPCIÓN A (1 pago = 1 reserva)

4. **¿Necesitas manejar reembolsos?**
   - SI → Incluye `payment_status = 'refunded'`
   - NO → Puedes omitirlo

**Responde y te doy el diseño exacto para tu caso.** 🚀
