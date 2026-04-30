# Technical Summary — Flying With You
**Version:** 1.0 (Sprint 1)
**Period:** February – March 2026
**Institution:** CBTis 47

---

## 1. General Description

**Flying With You** is a web-based tourism reservation system developed for a travel agency. It allows users to register, search and book flights or tourist trolleybus routes, complete a simulated payment, and download a PDF ticket as proof of their confirmed reservations.

---

## 2. System Objective

To develop a functional web application that automates the tourism service reservation process — from user registration to the issuance of a payment receipt — reducing the agency's manual workload and improving the end-user experience.

---

## 3. Development Team

| Name | Role |
|---|---|
| López Cabrera Daniel | Product Owner / Analyst & Designer |
| García Sánchez German | Scrum Master / SQL Developer |
| Cueto Madrigal Michelle | Developer — Query Master |
| Cruz Estrada Johana Elena | Developer — SQL Tester |
| Roldan Barrera Edson Yalan | Developer — DBA |

---

## 4. Technologies Used

| Component | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Database & Authentication | Supabase (PostgreSQL + Auth) |
| PDF Generation | jsPDF (via CDN) |
| Version Control | Git + GitHub |

> The project does not use any frontend framework or package manager. All external dependencies are loaded via CDN directly inside the HTML files.

---

## 5. Project Epics

| ID | Epic | Priority |
|---|---|---|
| EP-01 | User Authentication | High |
| EP-02 | Flight Reservation | High |
| EP-03 | Tourist Trolleybus Reservation | High |
| EP-04 | Payment Processing | High |
| EP-05 | PDF Ticket Generation | Medium |

---

## 6. Database Standards

### 6.1 Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Tables | UPPERCASE with underscores | `FLIGHT_BOOKING` |
| Columns | lowercase with underscores | `booking_date` |
| Primary keys | `id_` + singular table name | `id_flight`, `id_person` |
| Foreign keys | same name as the referenced PK | `id_flight FK → FLIGHT.id_flight` |
| Enumerations | lowercase values | `'pending'`, `'confirmed'` |

### 6.2 General Schema Rules

- Every table has an `INT` primary key with auto-increment.
- Foreign keys explicitly reference the source table and column.
- Date and time fields use `DATE`, `TIME`, or `DATETIME` as appropriate — never `VARCHAR` for storing dates.
- Status fields (`status`) are implemented as enumerations with predefined values to prevent inconsistent data.
- Prices are stored as `DECIMAL` and always displayed in Mexican Pesos (MXN).
- Passwords are never stored in the application database; they are managed exclusively by Supabase Auth.
- Full card numbers are never stored; only the last four digits are saved for receipt display purposes.

### 6.3 Normalization Applied

The schema follows **Third Normal Form (3NF)**:

**1NF:** All attributes are atomic. There are no repeating groups or multi-valued fields.

**2NF:** All non-key attributes depend on the full primary key. Intermediate tables like `BOOKING_SEAT` exist specifically to eliminate partial dependencies between flights and reservations.

**3NF:** There are no transitive dependencies. Airport data is stored in the `AIRPORT` table and referenced from `FLIGHT` via FK, rather than duplicating city and name in every flight record.

### 6.4 Key Design Decisions

**PERSON / USER Separation**
Personal user information (name, CURP, birth date) is separated from authentication credentials (username, password). This ensures that changes to the authentication system do not affect profile data.

**Double FK in FLIGHT**
The `FLIGHT` table references `AIRPORT` twice: once as the origin airport and once as the destination. Both foreign keys point to the same table, avoiding duplication of the airport entity.

**FLIGHT_BOOKING / BOOKING_SEAT Separation**
The general booking and each individual seat live in separate tables. This allows each seat to have its own independent timer and status.

**Database-side Timer**
The `selected_at` and `expires_at` fields in `BOOKING_SEAT` ensure that reservation expiry is validated server-side through Supabase, not only in the user's browser.

**Nullable FK in PAYMENT**
The `PAYMENT` table has two optional foreign keys: one for flight bookings and one for trolleybus bookings. Only one will have a value per record; the other will be `NULL`.

### 6.5 Tables Identified

| Table | Description |
|---|---|
| `PERSON` | User personal data |
| `USER` | Authentication credentials (linked to Supabase Auth) |
| `EMPLOYEE` | Agency staff |
| `OCCUPATION` | Staff job types |
| `AIRPORT` | Origin and destination airports |
| `AIRPLANE_MODEL` | Aircraft model (capacity, name) |
| `AIRPLANE` | Physical aircraft unit |
| `FLIGHT` | Available flights |
| `FLIGHT_BOOKING` | Flight reservations |
| `BOOKING_SEAT` | Individual seats per reservation |
| `ROUTE` | Tourist trolleybus routes |
| `BUS_STATION` | Physical stops |
| `ROUTE_STOP` | Ordered stops per route |
| `TROLLEY_MODEL` | Trolleybus model |
| `TROLLEY` | Physical trolleybus unit |
| `TROLLEY_ROUTE_SCHEDULE` | Recurring schedules per route |
| `SCHEDULE_DAY` | Operating days per schedule |
| `TROLLEY_TRIP` | Concrete trip on a specific date |
| `TROLLEY_BOOKING` | Trolleybus reservations |
| `TICKET` | Reservation receipt |
| `PAYMENT` | Payment record |

---

## 7. Product Backlog — User Stories

> The following stories represent the first version of the backlog, defined at the close of Sprint 1. Acceptance criteria are an initial approximation that will be refined during Sprint 2.

---

### EP-01 · Authentication

#### US-01 — User Registration

**As a** new visitor, **I want to** create an account with my personal data and password, **so that** I can access the reservation system.

**Priority:** High | **Story Points:** 3

**Acceptance Criteria**

```gherkin
Scenario: Successful registration
  Given the user is on the registration page
  When they enter a valid name, email, and password and submit the form
  Then the system creates the account and displays a confirmation message

Scenario: Email already registered
  Given the user enters an email that already exists in the system
  When they submit the form
  Then the system displays an error message and does not create a new account

Scenario: Empty required fields
  Given the user leaves one or more required fields blank
  When they submit the form
  Then the system displays a validation message for each missing field
```

---

#### US-02 — User Login

**As a** registered user, **I want to** log in with my email and password, **so that** I can manage my reservations.

**Priority:** High | **Story Points:** 2

**Acceptance Criteria**

```gherkin
Scenario: Successful login
  Given the user has a registered account
  When they enter their correct credentials
  Then the system redirects them to the dashboard

Scenario: Incorrect credentials
  Given the user enters a wrong email or password
  When they attempt to log in
  Then the system displays an authentication error message
```

---

#### US-03 — User Logout

**As a** logged-in user, **I want to** log out of my session, **so that** my account stays protected when I stop using the system.

**Priority:** Medium | **Story Points:** 1

**Acceptance Criteria**

```gherkin
Scenario: Successful logout
  Given the user is authenticated
  When they click the logout button
  Then the system ends the active session and redirects to the login page
  And the user cannot access protected pages without logging in again
```

---

### EP-02 · Flight Reservation

#### US-04 — Flight Search

**As a** logged-in user, **I want to** search for flights by origin, destination, and date, **so that** I can find the one that best fits my travel plans.

**Priority:** High | **Story Points:** 5

**Acceptance Criteria**

```gherkin
Scenario: Search with results
  Given the user fills in the origin, destination, and date filters
  When they run the search
  Then the system displays available flights with schedule and pricing

Scenario: No results found
  Given the selected combination has no available flights
  When the user runs the search
  Then the system informs them that no flights are available for those criteria
```

---

#### US-05 — Seat Selection

**As a** logged-in user, **I want to** view the seat map of a flight and choose an available seat, **so that** I can secure my preferred spot.

**Priority:** High | **Story Points:** 5

**Acceptance Criteria**

```gherkin
Scenario: View seat map
  Given the user has selected a flight from the results
  When the seat selection screen loads
  Then the system displays the seat map with available seats in green and occupied seats in red

Scenario: Select an available seat
  Given the user clicks on a green seat
  Then the seat is marked as selected

Scenario: Attempt to select an occupied seat
  Given the user clicks on a red seat
  Then the system does not allow the selection
```

---

#### US-06 — Flight Reservation Confirmation

**As a** logged-in user, **I want to** confirm my seat selection to create a reservation, **so that** my seat is held while I complete the payment.

**Priority:** High | **Story Points:** 3

**Acceptance Criteria**

```gherkin
Scenario: Reservation created successfully
  Given the user confirmed their seat selection
  Then the system creates the reservation record with status "pending"
  And starts the 10-minute countdown timer

Scenario: Timer expires before payment is completed
  Given the reservation is in pending status and the timer reaches zero
  Then the system automatically cancels the reservation and releases the seat
```

---

### EP-03 · Trolleybus Reservation

#### US-07 — Browse Trolleybus Routes

**As a** logged-in user, **I want to** browse available trolleybus routes, **so that** I can choose the one I'm interested in before making a reservation.

**Priority:** High | **Story Points:** 3

**Acceptance Criteria**

```gherkin
Scenario: Routes available
  Given the user enters the trolleybus section
  Then the system displays all routes with name, description, and departure location

Scenario: No routes available
  Given there are no routes registered in the database
  Then the system displays a message informing the user that no routes are currently available
```

---

#### US-08 — Trolleybus Reservation

**As a** logged-in user, **I want to** book a spot on a trolleybus route by selecting a date and boarding stop, **so that** I can secure my place on the tour.

**Priority:** High | **Story Points:** 5

**Acceptance Criteria**

```gherkin
Scenario: Reservation created successfully
  Given the user selected a route, date, and boarding stop
  When they confirm the reservation
  Then the system creates it with status "pending" and starts the 10-minute timer

Scenario: No availability on the selected date
  Given the chosen date has no available slots
  Then the system informs the user and prompts them to select a different date
```

---

### EP-04 · Payment Processing

#### US-09 — Complete Payment for a Reservation

**As a** logged-in user with a pending reservation, **I want to** complete the payment before the time runs out, **so that** my reservation is confirmed and I can receive my ticket.

**Priority:** High | **Story Points:** 5

**Acceptance Criteria**

```gherkin
Scenario: Successful payment within the time limit
  Given the user has a pending reservation and the timer is still active
  When they complete the payment process
  Then the system updates the status to "confirmed" and redirects to the ticket screen

Scenario: Payment attempted after timer expiry
  Given the 10-minute timer has already reached zero
  When the user attempts to pay
  Then the system rejects the transaction and informs the user that the reservation has expired
```

---

### EP-05 · PDF Ticket

#### US-10 — Add Reservations to a Ticket

**As a** user with confirmed reservations, **I want to** add one or more to a single ticket, **so that** I can consolidate them into one downloadable document.

**Priority:** Medium | **Story Points:** 3

**Acceptance Criteria**

```gherkin
Scenario: Adding a confirmed reservation
  Given the user has at least one confirmed reservation
  When they add it to the ticket
  Then the reservation appears in the ticket summary

Scenario: Attempting to add a pending reservation
  Given the reservation has status "pending"
  When the user tries to add it to the ticket
  Then the system prevents the action and displays an explanatory message
```

---

#### US-11 — Download PDF Ticket

**As a** user with reservations added to the ticket, **I want to** download it as a PDF file, **so that** I have a printable proof of my bookings.

**Priority:** Medium | **Story Points:** 5

**Acceptance Criteria**

```gherkin
Scenario: Successful download
  Given the user has at least one reservation in the ticket
  When they click "Download"
  Then the system generates a PDF with the reservation details and downloads it

Scenario: Second download attempt
  Given the ticket has already been downloaded once
  When the user tries to download it again
  Then the system blocks the download and displays an informative message

Scenario: No reservations added to the ticket
  Given no reservations have been added to the ticket
  When the user attempts to download
  Then the system displays a validation message and does not generate any file
```

---

## 8. Product Backlog Summary

| ID | User Story | Epic | Priority | Points |
|---|---|---|---|---|
| US-01 | User Registration | EP-01 | High | 3 |
| US-02 | User Login | EP-01 | High | 2 |
| US-03 | User Logout | EP-01 | Medium | 1 |
| US-04 | Flight Search | EP-02 | High | 5 |
| US-05 | Seat Selection | EP-02 | High | 5 |
| US-06 | Flight Reservation Confirmation | EP-02 | High | 3 |
| US-07 | Browse Trolleybus Routes | EP-03 | High | 3 |
| US-08 | Trolleybus Reservation | EP-03 | High | 5 |
| US-09 | Complete Payment | EP-04 | High | 5 |
| US-10 | Add Reservations to Ticket | EP-05 | Medium | 3 |
| US-11 | Download PDF Ticket | EP-05 | Medium | 5 |
| **Total** | | | | **40 pts** |

---

## 9. System Scope

### In Scope (v1.0)
- User registration, login, and logout
- Flight search and reservation with visual seat selection
- Tourist trolleybus route reservation
- Simulated payment with reservation status update
- PDF ticket download (one time per ticket)

### Out of Scope (v1.0)
- Real payment gateway integration
- Native mobile application
- Agency admin panel
- Email notification system
- Real-time seat map synchronization between simultaneous sessions

---

*Flygth With You — CBTis 47 · February – March 2026*
