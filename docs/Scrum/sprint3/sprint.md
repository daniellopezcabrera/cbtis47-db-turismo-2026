# Sprint 3 — Technical Summary
**Project:** Flygth With You
**Version:** 1.2 (Release Candidate)
**Period:** May – June 2026
**Institution:** CBTis 47

> **Previous sprints:** See [`sprint-01.md`](./sprint-01.md) for database standards and initial design decisions, and [`sprint-02.md`](./sprint-02.md) for the detailed backlog, functional requirements, and the complete entity-relationship diagram.

---

## Table of Contents

1. [Sprint Goal](#1-sprint-goal)
2. [Development Team](#2-development-team)
3. [Project Context and Status](#3-project-context-and-status)
4. [Carry-Over Items from Sprint 2](#4-carry-over-items-from-sprint-2)
5. [Sprint Backlog](#5-sprint-backlog)
6. [Final Acceptance Criteria](#6-final-acceptance-criteria)
7. [Supabase Integration Plan](#7-supabase-integration-plan)
8. [Test Plan](#8-test-plan)
9. [Definition of Done](#9-definition-of-done)
10. [Final Scope and Project Closure](#10-final-scope-and-project-closure)

---

## 1. Sprint Goal

> Deliver a fully functional version of **Flygth With You** in which all modules are integrated with the Supabase database, the interfaces respond correctly to the real state of the system, and the end-to-end flows (registration → search → booking → payment → PDF ticket) work without manual intervention or locally mocked data.

By the end of this sprint, the system must be ready for its academic presentation at CBTis 47 as a finished product.

---

## 2. Development Team

| Name | Role |
|---|---|
| López Cabrera Daniel | Analyst & Designer — Final UI and frontend integration |
| García Sánchez German | SQL Developer — Flight queries and validations |
| Cueto Madrigal Michelle | Query Master — Trolleybus queries and tickets |
| Cruz Estrada Johana Elena | SQL Tester — Integration testing and bug reporting |
| Roldan Barrera Edson Yalan | DBA — RLS policies, triggers, and database cleanup |

---

## 3. Project Context and Status

### What was completed in Sprint 2

During Sprint 2, the team defined and documented:

- The complete database architecture (ER diagram with 21 tables).
- All functional, agile, UI/UX, and non-functional requirements.
- The Product Backlog with 11 user stories and 40 story points.
- Acceptance criteria in Gherkin format for every story.

Sprint 2 was a **detailed design and planning sprint**. Code development was intentionally left out of its scope.

### What this Sprint covers

Sprint 3 is the **implementation, integration, and closure sprint**. All real development work happens here. The user stories are already defined; this sprint takes them from specification to verified functionality.

---

## 4. Carry-Over Items from Sprint 2

The following items were identified as pending or incomplete at the close of Sprint 2 and must be resolved in this sprint:

| ID | Pending Item | Owner |
|---|---|---|
| PD-01 | Create the SQL schema in Supabase (tables, relationships, enums, constraints) | Roldan Barrera Edson |
| PD-02 | Configure Row Level Security (RLS) on sensitive tables | Roldan Barrera Edson |
| PD-03 | Implement the trigger for automatic reservation expiration | Roldan Barrera Edson |
| PD-04 | Connect the Supabase JS client across all frontend modules | López Cabrera Daniel |
| PD-05 | Functional authentication module (registration, login, logout with Supabase Auth) | García Sánchez German |
| PD-06 | Flight search and booking flow connected to real data | García Sánchez German |
| PD-07 | Trolleybus search and booking flow connected to real data | Cueto Madrigal Michelle |
| PD-08 | Simulated payment module with database status updates | Cueto Madrigal Michelle |
| PD-09 | PDF generation with jsPDF using real reservation data | López Cabrera Daniel |
| PD-10 | Re-download block validation persisted in Supabase | López Cabrera Daniel |
| PD-11 | Test data seed (flights, routes, stops, airports) | Cruz Estrada Johana |
| PD-12 | README updated with setup instructions and environment variables | García Sánchez German |

---

## 5. Sprint Backlog

This sprint does not add new stories to the Product Backlog. All 11 stories defined in Sprint 2 are implemented in full. The following section details the technical development tasks associated with each one.

---

### EP-01 · User Authentication

#### US-01 — User Registration

**Development tasks:**

- **T-01.1** Create the HTML registration form with fields: first name, last names, CURP, date of birth, email, username, and password.
- **T-01.2** Implement frontend validations: required fields, CURP format, email format, minimum password length.
- **T-01.3** Connect the form to `supabase.auth.signUp()` to create the account in Supabase Auth.
- **T-01.4** Insert personal data into the `PERSON` table and credentials into the `USER` table after successful registration.
- **T-01.5** Check uniqueness of email, username, and CURP before inserting (pre-check query or constraint error handling).
- **T-01.6** Display field-specific error messages directly below each input — not as generic pop-up alerts.
- **T-01.7** Redirect the user to the login page after successful registration, with a confirmation message.

---

#### US-02 — User Login

**Development tasks:**

- **T-02.1** Create the HTML login form with username and password fields.
- **T-02.2** Resolve the username to its associated email by querying the `USER` table before calling Supabase Auth.
- **T-02.3** Authenticate with `supabase.auth.signInWithPassword()` using the resolved email.
- **T-02.4** Redirect to the main dashboard after a successful login.
- **T-02.5** Display an error message if the credentials are incorrect.
- **T-02.6** Implement a show/hide toggle for the password field.

---

#### US-03 — User Logout

**Development tasks:**

- **T-03.1** Add a logout button to the persistent navigation menu.
- **T-03.2** Call `supabase.auth.signOut()` on click.
- **T-03.3** Redirect to the login page after the session is closed.
- **T-03.4** Implement a session guard on all protected pages: check `supabase.auth.getSession()` on load and redirect to login if no active session is found.

---

### EP-02 · Flight Reservation

#### US-04 — Flight Search

**Development tasks:**

- **T-04.1** Create the search form with origin, destination, and date selectors.
- **T-04.2** Populate the origin and destination selectors with real records from the `AIRPORT` table.
- **T-04.3** Query the `FLIGHT` table filtering by `origin_airport_id`, `dest_airport_id`, `flight_date`, and `status = 'scheduled'`.
- **T-04.4** Render results in a list showing flight number, departure/arrival times, and base price.
- **T-04.5** Display a "No flights found" message if the query returns no results.
- **T-04.6** Validate that all three filters are selected before executing the search.

---

#### US-05 — Seat Selection for Flights

**Development tasks:**

- **T-05.1** When a flight is selected, query the assigned airplane model (`AIRPLANE` → `AIRPLANE_MODEL`) to get its capacity and generate the seat map dynamically.
- **T-05.2** Query `BOOKING_SEAT` for seats with status `'pending'` or `'confirmed'` on the selected flight and mark them as occupied (red).
- **T-05.3** Render the seat map with labels (e.g. "12A") and visual state differentiation (green / red / blue when selected).
- **T-05.4** Display a color legend next to the seat map.
- **T-05.5** Show the seat label on hover (desktop) or tap (mobile).
- **T-05.6** Update the reservation summary when the user selects an available seat.
- **T-05.7** Block clicks on occupied seats and display an informative message.

---

#### US-06 — Flight Reservation Confirmation

**Development tasks:**

- **T-06.1** On confirmation, verify the user does not already have an active `'pending'` or `'confirmed'` reservation for the same flight.
- **T-06.2** Insert a record in `FLIGHT_BOOKING` with `status = 'pending'` and `booking_date = NOW()`.
- **T-06.3** Insert a record in `BOOKING_SEAT` with `selected_at = NOW()` and `expires_at = NOW() + INTERVAL '10 minutes'`.
- **T-06.4** Start the 10-minute countdown in the frontend by reading the `expires_at` value from the database — not calculated in the browser.
- **T-06.5** When the timer reaches zero, update `FLIGHT_BOOKING.status` and `BOOKING_SEAT.status` to `'expired'` and notify the user.
- **T-06.6** Show a visual warning when fewer than 2 minutes remain (timer turns red).

---

### EP-03 · Tourist Trolleybus Reservation

#### US-07 — Browse Trolleybus Routes

**Development tasks:**

- **T-07.1** Query all available routes from the `ROUTE` table.
- **T-07.2** For each route, retrieve its ordered stops from `ROUTE_STOP` joined with `BUS_STATION`.
- **T-07.3** Render the route list with name, description, and departure stop.
- **T-07.4** Display a message if no routes are registered in the database.

---

#### US-08 — Trolleybus Reservation

**Development tasks:**

- **T-08.1** When a route is selected, load available trips (`TROLLEY_TRIP`) filtering by the associated `id_route_schedule`, `trip_date >= TODAY`, and `status = 'scheduled'`.
- **T-08.2** Display a date selector; once a date is chosen, load the available boarding stops (`ROUTE_STOP` → `BUS_STATION`).
- **T-08.3** Check seat availability by querying active `TROLLEY_BOOKING` records for the `id_trip` and comparing against the capacity in `TROLLEY_MODEL`.
- **T-08.4** Insert a record in `TROLLEY_BOOKING` with `status = 'pending'` and `booking_date = NOW()`.
- **T-08.5** Start the 10-minute countdown in the frontend using the same behavior as for flights (read `expires_at` from the database).
- **T-08.6** On expiry, update `TROLLEY_BOOKING.status` to `'expired'` and notify the user.
- **T-08.7** Display a message if the selected date has no availability.

---

### EP-04 · Payment Processing

#### US-09 — Complete Payment for a Reservation

**Development tasks:**

- **T-09.1** Create the simulated payment form with fields: payment method (cash / card / transfer) and, if card, the last 4 digits.
- **T-09.2** When payment is attempted, verify that the reservation's `expires_at` has not been exceeded — by querying Supabase directly, not only relying on the browser timer.
- **T-09.3** If the reservation is still valid, insert a record in `PAYMENT` with `payment_status = 'completed'` and `completed_at = NOW()`.
- **T-09.4** Update `FLIGHT_BOOKING.status` or `TROLLEY_BOOKING.status` to `'confirmed'`.
- **T-09.5** Update `BOOKING_SEAT.status` to `'confirmed'` (for flight reservations).
- **T-09.6** Redirect to the ticket module after successful confirmation.
- **T-09.7** If payment fails (simulated error), keep the reservation in `'pending'` status and display an error message without cancelling the timer.
- **T-09.8** If the reservation has already expired at the time of payment, reject the transaction, update the status to `'expired'`, and display instructions for starting a new reservation.

---

### EP-05 · PDF Ticket Generation

#### US-10 — Add Reservations to a Ticket

**Development tasks:**

- **T-10.1** Query all reservations with `status = 'confirmed'` belonging to the authenticated user (both `FLIGHT_BOOKING` and `TROLLEY_BOOKING`).
- **T-10.2** Render the list of available reservations to add to the ticket.
- **T-10.3** Allow the user to add one or more confirmed reservations to the current ticket.
- **T-10.4** Block attempts to add reservations with any status other than `'confirmed'` and display an explanatory message.
- **T-10.5** Show the accumulated ticket summary before the user downloads.

---

#### US-11 — Download PDF Ticket

**Development tasks:**

- **T-11.1** On "Download" click, verify that at least one reservation has been added to the ticket; if not, keep the button disabled and display a validation message.
- **T-11.2** Generate the PDF with jsPDF including, for each reservation: flight or route name, seat number or boarding stop, travel date, and the passenger's full name (from the `PERSON` table).
- **T-11.3** Automatically download the file to the user's device.
- **T-11.4** After a successful download, insert or update the record in the `TICKET` table marking the booking as downloaded.
- **T-11.5** Change the button label to "Ticket already issued" and permanently disable it.
- **T-11.6** If the user returns to the module from another device or session, query the ticket status in Supabase and keep the button disabled if it has already been downloaded.

---

## 6. Final Acceptance Criteria

All criteria defined in Sprint 2 remain in effect. This sprint adds the following cross-cutting integration verification criteria:

**CI-01.** Every user flow (registration → login → booking → payment → ticket) must be completable end-to-end without console errors or failed Supabase requests.

**CI-02.** Data displayed in the frontend must match exactly the records stored in the Supabase database at all times.

**CI-03.** A reservation's expiration must be reflected in the database even if the user closes the browser before the timer reaches zero — enforced via the `expires_at` field and the corresponding trigger.

**CI-04.** A ticket marked as downloaded in Supabase must not be downloadable again from any device or session.

**CI-05.** No protected page must be accessible by navigating directly to its URL without an active session.

---

## 7. Supabase Integration Plan

### 7.1 Initial Setup

```javascript
// supabase-client.js — shared file used by all modules
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://<project>.supabase.co'
const SUPABASE_ANON_KEY = '<anon-key>'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

> Credentials are managed as environment variables documented in the README. They must not be included directly in versioned code.

### 7.2 Row Level Security (RLS) Policies

| Table | Policy | Description |
|---|---|---|
| `PERSON` | SELECT, UPDATE own | User can only read and edit their own record |
| `USER` | SELECT own | User can only read their own profile |
| `FLIGHT_BOOKING` | SELECT, INSERT own | User can only view and create their own reservations |
| `TROLLEY_BOOKING` | SELECT, INSERT own | Same, for trolleybus bookings |
| `BOOKING_SEAT` | SELECT all authenticated, INSERT own | Any authenticated user can view the seat map; only the owner can insert |
| `PAYMENT` | INSERT, SELECT own | User can only access their own payments |
| `TICKET` | SELECT, UPDATE own | User can only download and mark their own tickets |
| `FLIGHT`, `AIRPORT`, `ROUTE`, `BUS_STATION`, `TROLLEY_TRIP` | SELECT all authenticated | Catalog data: read access for all authenticated users |

### 7.3 Reservation Expiration Trigger

A trigger will be implemented in Supabase that automatically updates the status of `FLIGHT_BOOKING`, `BOOKING_SEAT`, and `TROLLEY_BOOKING` to `'expired'` when `expires_at < NOW()` and the current status is `'pending'`. This trigger fires on each seat availability query, ensuring data consistency without requiring an external scheduled job.

### 7.4 Test Data Seed

A `seed.sql` file will be included in the repository containing at least:

- 3 origin and destination airports.
- 5 flights with future dates, different routes, and prices.
- 2 airplane models with different capacities.
- 2 trolleybus routes with defined stops.
- 4 trolleybus trips with future dates.

---

## 8. Test Plan

### 8.1 Integration Tests by Module

| ID | Module | Scenario to Verify | Owner |
|---|---|---|---|
| PT-01 | Authentication | Successful registration creates records in `PERSON`, `USER`, and Supabase Auth | Cruz Estrada Johana |
| PT-02 | Authentication | Login with a non-existent user displays the correct error | Cruz Estrada Johana |
| PT-03 | Authentication | Direct navigation to a protected URL without a session redirects to login | Cruz Estrada Johana |
| PT-04 | Flights | Search by origin/destination/date returns only matching flights | Cruz Estrada Johana |
| PT-05 | Flights | The seat map reflects seats actually reserved in the database | Cruz Estrada Johana |
| PT-06 | Flights | Timer expiration updates the status in the database even when the browser is closed | Cruz Estrada Johana |
| PT-07 | Trolleybus | Seat availability is correctly calculated against the trolleybus model capacity | Cruz Estrada Johana |
| PT-08 | Payment | Payment is rejected if `expires_at` has already been exceeded | Cruz Estrada Johana |
| PT-09 | Payment | Reservation status changes to `'confirmed'` in the database after payment | Cruz Estrada Johana |
| PT-10 | Ticket | An already-downloaded ticket cannot be downloaded again from a different session | Cruz Estrada Johana |
| PT-11 | Ticket | The generated PDF contains the correct passenger and reservation data | Cruz Estrada Johana |

### 8.2 Approval Criteria

A user story is considered **approved** when:

1. All its Gherkin scenarios defined in Sprint 2 pass against the real Supabase environment.
2. No errors appear in the browser console during the execution of the flow.
3. Data state changes are verifiable directly in the Supabase dashboard.

---

## 9. Definition of Done

A user story is considered **done** in this sprint only when it meets **all** of the following:

- [ ] Code is committed to the corresponding branch and merged to `main` on GitHub.
- [ ] The commit author is the team member responsible for the task — repositories with a single author are not acceptable.
- [ ] The feature is integrated with Supabase and operates with real data (no hardcoded values).
- [ ] Gherkin acceptance criteria from Sprint 2 have been manually verified.
- [ ] The interface meets the UI/UX requirements defined in Sprint 2 (inline validation messages, loading indicators, timer visual states).
- [ ] No sensitive data (passwords, full card numbers, API keys) is present in the versioned code.
- [ ] The tester (Cruz Estrada Johana) has signed off on the story's approval.

---

## 10. Final Scope and Project Closure

### Sprint 3 Deliverables

| Deliverable | Description |
|---|---|
| Functional web application | All modules operational and integrated with Supabase |
| Production database | Complete schema with test data in the Supabase project |
| Source code on GitHub | Repository with commits from all team members and an updated README |
| Technical documentation | Sprint 1, Sprint 2, and Sprint 3 documents in the repository |
| `seed.sql` file | Script to populate the database with demo data |

### Features Completed in v1.0

- ✅ User registration, login, and logout with Supabase Auth
- ✅ Flight search with real filters
- ✅ Dynamic seat map with real-time states
- ✅ Flight reservation with 10-minute timer validated at the database level
- ✅ Trolleybus route browsing
- ✅ Trolleybus reservation with availability validation
- ✅ Simulated payment with status update in Supabase
- ✅ PDF ticket generation with jsPDF using real reservation data
- ✅ Permanent re-download block persisted in Supabase

### Out of Scope (v1.0) — Unchanged

- Real payment gateway integration
- Native mobile application
- Advanced admin panel for the agency
- Email notification system
- Real-time seat map synchronization between simultaneous user sessions

### Closing Notes

This sprint concludes the academic development cycle of **Flygth With You** for the school term at CBTis 47. The system will not be deployed to a public production server; its demonstration will take place in a local environment or on Supabase's free tier with controlled access during the final presentation.

---

*Flygth With You — CBTis 47 · May – June 2026*
