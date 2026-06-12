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
11. [Backlog Summary](#11-backlog-summary)

---

## 1. Sprint Goal

> Deliver a fully functional version of **Flygth With You** in which all modules — end-user flows, staff portals, and the administration panel — are integrated with the Supabase database, interfaces respond correctly to the real state of the system, and the complete end-to-end flows work without manual intervention or locally mocked data.

By the end of this sprint, the system must be ready for its academic presentation at CBTis 47 as a finished product.

---

## 2. Development Team

| Name | Role |
|---|---|
| López Cabrera Daniel | Analyst & Designer — Final UI and frontend integration |
| García Sánchez German | SQL Developer — Flight queries, staff management, and validations |
| Cueto Madrigal Michelle | Query Master — Trolleybus queries, reports, and tickets |
| Cruz Estrada Johana Elena | SQL Tester — Integration testing and bug reporting |
| Roldan Barrera Edson Yalan | DBA — RLS policies, triggers, role-based access, and database cleanup |

---

## 3. Project Context and Status

### What was completed in Sprint 2

During Sprint 2, the team defined and documented:

- The complete database architecture (ER diagram with 21 tables).
- All functional, agile, UI/UX, and non-functional requirements.
- The initial Product Backlog with 11 user stories (EP-01 through EP-05) and 40 story points.
- Acceptance criteria in Gherkin format for every story.

Sprint 2 was a **detailed design and planning sprint**. Code development was intentionally left out of its scope.

### What this Sprint covers

Sprint 3 is the **implementation, integration, and closure sprint**. All real development work happens here. The Product Backlog has been expanded to 23 user stories across 9 epics, adding staff and administrator portals (EP-06 through EP-09). This sprint takes all stories from specification to verified functionality.

### Scope Expansion — New Epics

The Product Backlog was refined between Sprint 2 and Sprint 3 to include four additional epics covering internal system roles:

| ID | Epic | Role | New Stories |
|---|---|---|---|
| EP-06 | Assigned Flight Management | Pilot / Co-pilot | US-12, US-13, US-14 |
| EP-07 | In-Flight Service Management | Flight Attendant | US-15, US-16 |
| EP-08 | Trolleybus Route Management | Driver | US-17, US-18 |
| EP-09 | System Administration | Administrator | US-19, US-20, US-21, US-22, US-23 |

These epics require role-based access control (RBAC) implemented through Supabase RLS policies and enforced in the frontend session guard.

---

## 4. Carry-Over Items from Sprint 2

The following items were identified as pending or incomplete at the close of Sprint 2 and must be resolved in this sprint:

| ID | Pending Item | Owner |
|---|---|---|
| PD-01 | Create the full SQL schema in Supabase (tables, relationships, enums, constraints) including the new `INCIDENT` table for EP-07 | Roldan Barrera Edson |
| PD-02 | Configure Row Level Security (RLS) on all tables, including role-based policies for staff and admin roles | Roldan Barrera Edson |
| PD-03 | Implement the trigger for automatic reservation expiration | Roldan Barrera Edson |
| PD-04 | Connect the Supabase JS client across all frontend modules | López Cabrera Daniel |
| PD-05 | Functional authentication module (registration, login, logout with Supabase Auth) | García Sánchez German |
| PD-06 | Flight search and booking flow connected to real data | García Sánchez German |
| PD-07 | Trolleybus search and booking flow connected to real data | Cueto Madrigal Michelle |
| PD-08 | Simulated payment module with database status updates | Cueto Madrigal Michelle |
| PD-09 | PDF generation with jsPDF using real reservation data | López Cabrera Daniel |
| PD-10 | Re-download block validation persisted in Supabase | López Cabrera Daniel |
| PD-11 | Test data seed (flights, routes, stops, airports, employees, occupations) | Cruz Estrada Johana |
| PD-12 | README updated with setup instructions and environment variables | García Sánchez German |
| PD-13 | Staff portal implementation (EP-06, EP-07, EP-08) with role-gated navigation | García Sánchez German |
| PD-14 | Administrator panel implementation (EP-09) with full CRUD and reports module | Cueto Madrigal Michelle |

---

## 5. Sprint Backlog

This sprint implements all 23 user stories across 9 epics. Stories US-01 through US-11 are carried forward from Sprint 2 without changes to their acceptance criteria; stories US-12 through US-23 are new additions defined in the refined Product Backlog.

---

### EP-01 · User Authentication

#### US-01 — User Registration

**As a** new visitor,
**I want to** create an account with my personal data and credentials,
**so that** I can access the reservation system securely.

**Priority:** High | **Story Points:** 5

**Development Tasks:**

- **T-01.1** Create the HTML registration form: first name, last names, CURP, date of birth, email, username, and password.
- **T-01.2** Implement frontend validations: required fields, CURP format (official 18-character format), email format, minimum password length.
- **T-01.3** Connect the form to `supabase.auth.signUp()` to create the account in Supabase Auth.
- **T-01.4** Insert personal data into `PERSON` and credentials into `USER` after successful registration.
- **T-01.5** Check uniqueness of email, username, and CURP before inserting.
- **T-01.6** Display field-specific error messages directly below each input — not as generic pop-up alerts.
- **T-01.7** Redirect the user to the login page after successful registration with a confirmation message.
- **T-01.8** Handle Supabase Auth unavailability gracefully: display a generic error and ensure no partial records are created.

##### Acceptance Criteria

```gherkin
Feature: User Registration

  Scenario: Successful registration with valid data
    Given the user is on the registration page
    When the user enters a valid name, last names, CURP, date of birth,
         email address, username, and password
    And the user submits the registration form
    Then the system creates a new account via Supabase Auth
    And personal data are stored in the PERSON table
    And username and password are stored in the USER table
    And the user is redirected to the login page
    And a confirmation message is displayed

  Scenario: Registration fails with an existing email
    Given the user enters an email already registered in the PERSON table
    When the user submits the form
    Then the system displays an error indicating the email is already in use
    And no new record is created in PERSON, USER, or Supabase Auth

  Scenario: Registration fails with an existing username
    Given the user enters a username that already exists in the USER table
    When the user submits the form
    Then the system displays an error indicating the username is already in use
    And no new record is created

  Scenario: Registration fails with an existing CURP
    Given the user enters a CURP already stored in the PERSON table
    When the user submits the form
    Then the system displays an error indicating the CURP is already in use
    And no new account is created

  Scenario: Registration fails with incomplete fields
    Given the user leaves one or more required fields empty
    When the user submits the form
    Then the system highlights each empty field
    And displays a validation message directly below each missing field

  Scenario: Registration fails with invalid field formats
    Given the user enters a CURP that does not match the official format,
         or an email without a valid format,
         or a password shorter than the minimum required length
    When the user submits the form
    Then the system displays a format validation message for each invalid field
    And no new record is created

  Scenario: Registration fails due to an external service error
    Given the Supabase Auth service is unavailable
    When the user submits a valid registration form
    Then the system displays a generic error indicating a temporary issue
    And no partial record is created in PERSON or USER
```

---

#### US-02 — User Login

**As a** registered user,
**I want to** log in with my username and password,
**so that** I can access my account and manage my reservations.

**Priority:** High | **Story Points:** 2

**Development Tasks:**

- **T-02.1** Create the HTML login form with username and password fields.
- **T-02.2** Resolve the username to its associated email by querying the `USER` table before calling Supabase Auth.
- **T-02.3** Authenticate with `supabase.auth.signInWithPassword()` using the resolved email.
- **T-02.4** Detect the authenticated user's role from `EMPLOYEE` + `OCCUPATION` and redirect to the correct dashboard (end-user, staff portal, or admin panel).
- **T-02.5** Display an error message if credentials are incorrect or the account is disabled.
- **T-02.6** Implement a show/hide toggle for the password field.

##### Acceptance Criteria

```gherkin
Feature: User Login

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user enters a registered username and the correct password
    And the user clicks the login button
    Then the system resolves the username to its associated email
         and authenticates via Supabase Auth
    And the user is redirected to the dashboard corresponding to their role

  Scenario: Login fails with incorrect credentials
    Given the user enters an incorrect username or password
    Then the system displays an authentication error message
    And the user remains on the login page

  Scenario: Login fails with empty fields
    Given the user submits the form with one or more empty fields
    Then the system displays a validation message below each empty field
    And does not attempt authentication

  Scenario: Login fails due to a disabled account
    Given the user enters valid credentials for a disabled account
    Then the system displays a message indicating the account is not active
    And the user is not granted access to the dashboard
```

---

#### US-03 — User Logout

**As a** logged-in user,
**I want to** log out of my active session,
**so that** my account remains secure when I finish using the system.

**Priority:** Medium | **Story Points:** 1

**Development Tasks:**

- **T-03.1** Add a logout button to the persistent navigation menu across all role-specific dashboards.
- **T-03.2** Call `supabase.auth.signOut()` on click and redirect to the login page.
- **T-03.3** Implement a session guard on all protected pages: check `supabase.auth.getSession()` on load and redirect to login if no active session is found.
- **T-03.4** Prevent back-navigation to protected pages after logout.

##### Acceptance Criteria

```gherkin
Feature: User Logout

  Scenario: Successful logout
    Given the user is logged in and on any page of the application
    When the user clicks the logout button
    Then the system terminates the active Supabase Auth session
    And the user is redirected to the login page
    And the user cannot navigate to any protected page without re-authenticating

  Scenario: Accessing a protected page after logout is denied
    Given the user has successfully logged out
    When the user navigates to a protected page via browser back or direct URL
    Then the system redirects the user to the login page
    And no protected content is displayed
```

---

### EP-02 · Flight Reservation

#### US-04 — Flight Search

**As a** logged-in user,
**I want to** search for available flights by origin, destination, and travel date,
**so that** I can find the flight that best fits my travel plans.

**Priority:** High | **Story Points:** 5

**Development Tasks:**

- **T-04.1** Create the search form with origin, destination, and date selectors populated from the `AIRPORT` table.
- **T-04.2** Validate that origin and destination are different and the selected date is not in the past.
- **T-04.3** Query `FLIGHT` filtering by `origin_city`, `destination_city`, `flight_date`, and `status = 'scheduled'`.
- **T-04.4** Exclude flights with no remaining available seats from the results.
- **T-04.5** Render results showing flight number, departure/arrival times, and base price.
- **T-04.6** Display a "No flights found" message if the query returns no results.

##### Acceptance Criteria

```gherkin
Feature: Flight Search

  Scenario: Successful search with matching results
    Given the user selects an origin, a destination, and a valid travel date
    When the user clicks the search button
    Then the system queries the FLIGHT table and displays matching flights
         with departure time, arrival time, and base_price

  Scenario: Search returns no results
    Given the user selects a combination with no matching records
    Then the system displays a message indicating no flights were found
    And suggests the user try a different date or route

  Scenario: Search submitted with incomplete filters
    Given the user submits without filling in all required filters
    Then the system highlights the missing fields
    And does not execute any query

  Scenario: Search fails when origin and destination are the same
    Given the user selects the same city for both origin and destination
    Then the system displays a validation message and does not execute any query

  Scenario: Search fails with a past travel date
    Given the user selects a travel date earlier than today
    Then the system displays a validation message and does not execute any query

  Scenario: Search results only show flights with available seats
    Given a valid search is performed
    When some matching flights have no remaining available seats
    Then the system excludes fully booked flights from the results
```

---

#### US-05 — Seat Selection for Flights

**As a** logged-in user,
**I want to** view the seat map of a selected flight and choose an available seat,
**so that** I can secure the specific seat I prefer before proceeding to payment.

**Priority:** High | **Story Points:** 5

**Development Tasks:**

- **T-05.1** Query the airplane model (`AIRPLANE` → `AIRPLANE_MODEL`) to generate the seat map dynamically from real capacity data.
- **T-05.2** Query `BOOKING_SEAT` for seats with `status = 'pending'` or `'confirmed'` and mark them occupied (red).
- **T-05.3** Render the seat map with labels (e.g. "12A") and visual states: green (available), red (occupied), blue (selected).
- **T-05.4** Display a color legend; show seat label on hover or tap.
- **T-05.5** Allow the user to change their seat selection before confirming.
- **T-05.6** Block navigation to the next step if no seat has been selected.
- **T-05.7** Detect and handle seat conflicts if another user reserves the same seat during the session.

##### Acceptance Criteria

```gherkin
Feature: Flight Seat Selection

  Scenario: Viewing the seat map
    Given the user has selected a flight from the search results
    When the seat selection screen loads
    Then the system displays a visual seat map from AIRPLANE_MODEL capacity
    And available seats are shown in green, occupied seats in red
    And a color legend is visible near the seat map

  Scenario: Selecting an available seat
    Given the user clicks on a green seat
    Then the seat is marked as selected (blue)
    And the seat label is displayed in the reservation summary

  Scenario: Attempting to select an occupied seat
    Given the user clicks on a red seat
    Then the system does not allow the selection
    And displays a message indicating the seat is unavailable

  Scenario: User changes seat selection before proceeding
    Given the user has already selected a seat
    When the user clicks on a different available seat
    Then the previously selected seat returns to green
    And the new seat is marked as selected

  Scenario: User attempts to proceed without selecting a seat
    Given no seat has been selected
    When the user attempts to continue
    Then the system displays a message indicating a seat must be selected

  Scenario: A seat becomes occupied while the user is viewing the map
    Given another user reserves a seat during the current session
    When the current user attempts to select that seat
    Then the system detects the conflict, notifies the user,
         and refreshes the seat map
```

---

#### US-06 — Flight Reservation Confirmation

**As a** logged-in user,
**I want to** confirm my seat selection and create a reservation with pending status,
**so that** my seat is held while I complete the payment process.

**Priority:** High | **Story Points:** 3

**Development Tasks:**

- **T-06.1** Verify the user has no active `'pending'` or `'confirmed'` reservation for the same flight.
- **T-06.2** Insert a record in `FLIGHT_BOOKING` with `status = 'pending'` and `booking_date = NOW()`.
- **T-06.3** Insert a record in `BOOKING_SEAT` with `selected_at = NOW()` and `expires_at = NOW() + INTERVAL '10 minutes'`.
- **T-06.4** Start the countdown by reading `expires_at` from the database — not calculated in the browser.
- **T-06.5** On expiry, update both `FLIGHT_BOOKING.status` and `BOOKING_SEAT.status` to `'expired'` and notify the user.
- **T-06.6** Show a visual warning (timer turns red) when fewer than 2 minutes remain.
- **T-06.7** Roll back any partial inserts if a database error occurs.

##### Acceptance Criteria

```gherkin
Feature: Flight Reservation Creation

  Scenario: Reservation created with pending status
    Given the user has selected a seat on a flight
    When the user confirms the selection
    Then the system inserts a record in FLIGHT_BOOKING with status = "pending"
    And inserts a record in BOOKING_SEAT with selected_at = NOW()
         and expires_at = selected_at + 10 minutes
    And a 10-minute countdown timer starts and is permanently displayed

  Scenario: Reservation expires before payment
    Given the countdown reaches zero without payment
    Then the system updates FLIGHT_BOOKING and BOOKING_SEAT status to "expired"
    And the seat becomes available again
    And the user receives an immediate notification

  Scenario: Duplicate reservation attempt
    Given the user already has an active reservation for the same flight
    Then the system displays a message indicating an active reservation exists
    And does not insert a new record

  Scenario: Reservation creation fails due to a database error
    Given an error occurs during the insert
    Then the system rolls back any partial inserts
    And displays an error message inviting the user to try again

  Scenario: User is warned before reservation expires
    Given fewer than 2 minutes remain on the countdown
    Then the system displays a prominent visual warning
    And encourages the user to complete the payment immediately
```

---

### EP-03 · Tourist Trolleybus Reservation

#### US-07 — Browse Trolleybus Routes

**As a** logged-in user,
**I want to** browse available tourist trolleybus routes,
**so that** I can choose the route that interests me before making a reservation.

**Priority:** High | **Story Points:** 3

**Development Tasks:**

- **T-07.1** Query all available routes from the `ROUTE` table.
- **T-07.2** For each route, retrieve ordered stops from `ROUTE_STOP` joined with `BUS_STATION`.
- **T-07.3** Render each route with name and departure stop; handle missing stop data gracefully.
- **T-07.4** Display a message if no routes are found.
- **T-07.5** Allow filtering routes by departure station.
- **T-07.6** Show full route details (all stops in order, duration, price) on route selection.

##### Acceptance Criteria

```gherkin
Feature: Trolleybus Route Browsing

  Scenario: Displaying available routes
    Given the user is on the trolleybus section
    When the page loads
    Then the system retrieves all routes from ROUTE
    And each route displays its route_name and departure location

  Scenario: No routes available
    Given the ROUTE table returns no records
    Then the system displays a message informing the user no routes are available

  Scenario: User views the details of a specific route
    Given the user clicks on a route
    Then the system displays all stops in order, estimated duration, and price
    And a "Reserve" button is visible to proceed

  Scenario: Route with missing stop data is handled gracefully
    Given a route has no associated ROUTE_STOP entries
    Then the route is excluded from the list or displayed with a placeholder
    And no unhandled error is shown to the user

  Scenario: User filters routes by departure station
    Given the user selects a departure station filter
    Then the system displays only routes whose first stop matches the selection
```

---

#### US-08 — Trolleybus Reservation

**As a** logged-in user,
**I want to** select a trolleybus route, a date, and a boarding stop to create a reservation,
**so that** I can secure my spot on the tour before proceeding to payment.

**Priority:** High | **Story Points:** 5

**Development Tasks:**

- **T-08.1** Load available trips (`TROLLEY_TRIP`) filtering by `id_route_schedule`, `trip_date >= TODAY`, and `status = 'scheduled'`.
- **T-08.2** Validate that the selected `boarding_stop_id` belongs to the selected route in `ROUTE_STOP`.
- **T-08.3** Check seat availability against `TROLLEY_MODEL` capacity.
- **T-08.4** Prevent duplicate reservations for the same trip.
- **T-08.5** Insert a record in `TROLLEY_BOOKING` with `status = 'pending'`; start the 10-minute countdown from `expires_at`.
- **T-08.6** On expiry, update `TROLLEY_BOOKING.status` to `'expired'` and notify the user.

##### Acceptance Criteria

```gherkin
Feature: Trolleybus Reservation

  Scenario: Successful reservation creation
    Given the user selects a valid trip date and a boarding stop
    When the user confirms the reservation
    Then the system inserts a record in TROLLEY_BOOKING with status = "pending"
    And a 10-minute countdown timer starts and is displayed

  Scenario: Reservation attempt with no availability on selected date
    Given the user selects a date with no available slots
    Then the system displays a message indicating no availability
    And the user is prompted to choose a different date

  Scenario: Reservation expires before payment
    Given the timer reaches zero without payment
    Then the system updates TROLLEY_BOOKING status to "expired"
    And the slot is restored to available inventory
    And the user is notified immediately

  Scenario: Reservation fails when boarding stop is not selected
    Given the user attempts to confirm without selecting a boarding stop
    Then the system displays a validation message
    And does not insert any record in TROLLEY_BOOKING

  Scenario: Duplicate reservation attempt on the same trip
    Given the user already has an active reservation for the same trip
    Then the system displays a message indicating an active reservation exists
    And does not insert a new record

  Scenario: Reservation fails when boarding stop is not part of the route
    Given the user selects a boarding stop not associated with the selected route
    Then the system displays a validation error
    And does not insert any record in TROLLEY_BOOKING

  Scenario: User is warned before reservation expires
    Given fewer than 2 minutes remain on the countdown
    Then the system displays a prominent visual warning
```

---

### EP-04 · Payment Processing

#### US-09 — Complete Payment for a Reservation

**As a** logged-in user,
**I want to** pay for my pending reservation within the allotted time,
**so that** my reservation is confirmed and I can receive my ticket.

**Priority:** High | **Story Points:** 5

**Development Tasks:**

- **T-09.1** Create the payment form with method selector (cash / card / transfer); for cash, calculate and display change.
- **T-09.2** Verify `expires_at` has not been exceeded by querying Supabase directly — not only relying on the browser timer.
- **T-09.3** On success, insert a `PAYMENT` record with `payment_status = 'completed'`; store only the last 4 digits for card payments.
- **T-09.4** Update `FLIGHT_BOOKING.status` or `TROLLEY_BOOKING.status` to `'confirmed'`. Update `BOOKING_SEAT.status` to `'confirmed'` for flight reservations.
- **T-09.5** On simulated failure, insert `PAYMENT` with `payment_status = 'failed'` and keep the reservation in `'pending'` status.
- **T-09.6** Allow retrying payment after a failed attempt while the timer is active.
- **T-09.7** Redirect to the ticket module after successful confirmation.

##### Acceptance Criteria

```gherkin
Feature: Reservation Payment

  Scenario: Successful payment within the time limit
    Given the user has a pending reservation and the timer is still active
    When the user completes the simulated payment process
    Then the system inserts a record in PAYMENT with payment_status = "completed"
    And updates the reservation status to "confirmed"
    And redirects the user to the ticket screen

  Scenario: Payment attempted after timer expiry
    Given the expires_at timestamp has already passed
    When the user attempts to submit payment
    Then the system rejects the transaction
    And prompts the user to start a new reservation

  Scenario: Payment fails due to a processing error
    Given the payment simulation returns an error
    Then the system inserts a PAYMENT record with payment_status = "failed"
    And the reservation remains in "pending" status
    And the countdown timer continues running

  Scenario: Payment fails when no payment method is selected
    Given the user submits payment without selecting a method
    Then the system displays a validation message
    And does not insert any record in PAYMENT

  Scenario: Successful cash payment with change calculation
    Given the user selects "cash" and enters an amount greater than the total
    Then the system calculates and displays the change
    And inserts a PAYMENT record with payment_method = "cash"
    And updates the reservation status to "confirmed"

  Scenario: Cash payment fails when amount received is less than total
    Given the user enters an amount less than the reservation total
    Then the system displays a message indicating the amount is insufficient
    And does not insert any record in PAYMENT

  Scenario: User retries payment after a failed attempt
    Given a previous PAYMENT record with payment_status = "failed" exists
    When the user submits payment again before the timer expires and succeeds
    Then the system inserts a new PAYMENT record with payment_status = "completed"
    And updates the reservation status to "confirmed"
```

---

### EP-05 · PDF Ticket Generation

#### US-10 — Add Reservations to a Ticket

**As a** logged-in user with at least one confirmed reservation,
**I want to** add one or more confirmed reservations to a single ticket,
**so that** I can consolidate multiple bookings into one downloadable document.

**Priority:** Medium | **Story Points:** 3

**Development Tasks:**

- **T-10.1** Query all reservations with `status = 'confirmed'` for the authenticated user (both booking types).
- **T-10.2** Prevent adding the same reservation twice.
- **T-10.3** Allow removing a reservation from the ticket before downloading.
- **T-10.4** Disable the download button when no reservations are accumulated.
- **T-10.5** Show the accumulated ticket summary before the user downloads.

##### Acceptance Criteria

```gherkin
Feature: Ticket Accumulation

  Scenario: Adding a confirmed reservation to the ticket
    Given the user has at least one confirmed reservation
    When the user clicks the "Add" button
    Then the reservation details are appended to the current ticket summary

  Scenario: Attempting to add an unconfirmed reservation
    Given the reservation has status = "pending"
    When the user attempts to add it
    Then the system prevents the action
    And displays a message indicating only confirmed reservations can be added

  Scenario: Adding the same reservation twice is prevented
    Given a reservation is already included in the ticket
    When the user attempts to add it again
    Then the system displays a message indicating it is already included

  Scenario: User removes a reservation from the ticket before downloading
    Given the user clicks "Remove" on a specific reservation
    Then that reservation is removed from the ticket summary
    And the download button is disabled if no reservations remain
```

---

#### US-11 — Download PDF Ticket

**As a** logged-in user with at least one confirmed reservation added to the ticket,
**I want to** download my ticket as a PDF file,
**so that** I have a printable proof of my confirmed bookings.

**Priority:** Medium | **Story Points:** 5

**Development Tasks:**

- **T-11.1** Keep the download button disabled until at least one reservation is added.
- **T-11.2** Generate the PDF with jsPDF. For flight reservations include: flight name, seat number, travel date, departure/arrival time, passenger full name. For trolleybus reservations include: route name, boarding stop, trip date, passenger full name.
- **T-11.3** Mark the booking as downloaded in the `TICKET` table after a successful download.
- **T-11.4** Change the button label to "Ticket already issued" and permanently disable it.
- **T-11.5** On jsPDF error, display a retry message without marking the ticket as downloaded.
- **T-11.6** Persist the download block across sessions and devices by checking the `TICKET` table on page load.

##### Acceptance Criteria

```gherkin
Feature: PDF Ticket Download

  Scenario: Successful first-time download
    Given the user has added at least one confirmed reservation
    When the user clicks the "Download" button
    Then the system generates a PDF using jsPDF with all reservation details
    And the file is downloaded to the user's device
    And the ticket is marked as downloaded in the TICKET table

  Scenario: Attempting to download a ticket already issued
    Given the ticket has a record in TICKET marked as downloaded
    When the user attempts to download again
    Then the system displays a message indicating the ticket has already been issued
    And the button label changes to "Ticket already issued" and remains disabled
    And the block persists across devices and sessions

  Scenario: Download attempted with no reservations added
    Given no reservations have been added
    When the user clicks the "Download" button
    Then the system displays a validation message
    And does not generate or download any file

  Scenario: PDF generation fails due to a client-side error
    Given jsPDF encounters an error during file generation
    Then the system displays a message indicating the download failed
    And does not insert a record in TICKET
    And the "Download" button remains enabled for a retry

  Scenario: PDF content includes all required fields per reservation type
    Given the ticket contains both a flight and a trolleybus reservation
    When the PDF is generated
    Then for the flight reservation the PDF includes:
         flight name, seat number, travel date, departure and arrival time,
         and passenger full name
    And for the trolleybus reservation the PDF includes:
         route name, boarding stop, trip date, and passenger full name
```

---

### EP-06 · Assigned Flight Management
> **Roles:** Pilot / Co-pilot
> **Tables involved:** `FLIGHT`, `FLIGHT_BOOKING`, `BOOKING_SEAT`, `PERSON`, `AIRPORT`, `AIRPLANE`, `AIRPLANE_MODEL`

#### US-12 — Consult Assigned Flights

**As a** pilot or co-pilot,
**I want to** consult the flights assigned to me with their route, aircraft, date, and schedule details,
**so that** I can plan and prepare correctly before each operation.

**Priority:** High | **Story Points:** 3

**Development Tasks:**

- **T-12.1** Create the "My Flights" section in the staff portal, accessible only to pilot and co-pilot roles.
- **T-12.2** Query `FLIGHT` records linked to the authenticated employee; exclude `status = 'cancelled'`.
- **T-12.3** Implement date and status filters on the flight list.
- **T-12.4** On flight selection, display full details: airplane registration and model, origin/destination airport names, co-pilot or pilot name, and total confirmed passengers.

##### Acceptance Criteria

```gherkin
Feature: Assigned Flight Consultation

  Scenario: Successful display of assigned flights
    Given the pilot or co-pilot navigates to "My Flights"
    Then the system displays all flights assigned to that employee
    And each record shows flight_number, origin_city, destination_city,
         flight_date, departure_time, arrival_time, and status
    And cancelled flights are excluded

  Scenario: No assigned flights available
    Given no FLIGHT records are linked to the employee
    Then the system displays a message stating no flights are assigned

  Scenario: Filter flights by date or status
    Given the employee applies a date or status filter
    Then the system displays only matching FLIGHT records

  Scenario: Pilot views full details of a specific assigned flight
    Given the pilot clicks on a flight
    Then the system displays airplane registration and model,
         airport names, co-pilot or pilot name, and total confirmed passengers

  Scenario: Regular user attempts to access "My Flights"
    Given a logged-in user with role "passenger"
    When they attempt to navigate to "My Flights"
    Then the system denies access and redirects to their dashboard
```

---

#### US-13 — View Flight Passenger Manifest

**As a** pilot or co-pilot,
**I want to** view the passenger manifest of an assigned flight,
**so that** I can review confirmed occupancy before operating.

**Priority:** High | **Story Points:** 3

**Development Tasks:**

- **T-13.1** Join `FLIGHT_BOOKING`, `BOOKING_SEAT`, and `PERSON` filtered by `id_flight` and `status = 'confirmed'`.
- **T-13.2** Display the manifest in read-only mode with occupancy summary (confirmed passengers, total capacity, occupancy percentage).
- **T-13.3** Implement passenger name search within the manifest.
- **T-13.4** Deny access if the flight is not linked to the authenticated employee.

##### Acceptance Criteria

```gherkin
Feature: Flight Passenger Manifest

  Scenario: Manifest with confirmed passengers
    Given the pilot or co-pilot opens a flight detail view
    Then the system displays for each confirmed passenger: full name and seat number
    And shows a summary of total confirmed passengers, total seats,
         and occupancy percentage

  Scenario: Flight with no confirmed reservations
    Given no FLIGHT_BOOKING records with status = "confirmed" exist
    Then the system displays a message stating no passengers have been confirmed

  Scenario: Manifest is displayed in read-only mode
    Given the pilot or co-pilot is viewing the manifest
    Then no options to edit or delete records are visible

  Scenario: Pilot searches for a specific passenger
    Given the pilot enters a name in the search field
    Then the system filters the list to show only matching records

  Scenario: Pilot attempts to access the manifest of an unassigned flight
    Given the flight is not linked to the employee's profile
    Then the system denies access and redirects to the assigned flight list
```

---

#### US-14 — Update Flight Status

**As a** pilot,
**I want to** update the operational status of an assigned flight,
**so that** the system accurately reflects the real progress of the operation.

**Priority:** High | **Story Points:** 3

> **Valid status transitions in `FLIGHT`:** `scheduled` → `departed` → `cancelled`

**Development Tasks:**

- **T-14.1** Show the status update control only to users with the pilot occupation.
- **T-14.2** Enforce valid transitions: `scheduled → departed`, `scheduled → cancelled`, `departed → cancelled`. Block any other transition.
- **T-14.3** Show a confirmation dialog before applying the status change.
- **T-14.4** On cancellation, cascade the update to all linked `FLIGHT_BOOKING` records.

##### Acceptance Criteria

```gherkin
Feature: Flight Status Update

  Scenario: Change status from "scheduled" to "departed"
    Given the pilot accesses a flight with status = "scheduled"
    When they select "Mark as departed" and confirm
    Then the system executes an UPDATE on FLIGHT setting status = "departed"
    And the new status is immediately reflected in the pilot's view

  Scenario: Invalid status reversal attempt
    Given the flight has status = "departed"
    When the pilot attempts to revert to "scheduled"
    Then the system displays an error indicating the transition is not valid

  Scenario: Co-pilot cannot modify the flight status
    Given a co-pilot accesses a flight detail view
    Then the status control is not visible or accessible

  Scenario: Pilot cancels a flight
    Given the pilot selects "Cancel flight" and confirms
    Then the system sets FLIGHT status to "cancelled"
    And all linked FLIGHT_BOOKING records are updated to status = "cancelled"

  Scenario: System requires confirmation before applying a status change
    Given the pilot selects a new status
    Then the system displays a confirmation dialog describing the transition
    And only executes the UPDATE after the pilot confirms

  Scenario: Non-pilot user attempts to update a flight status
    Given a user without the pilot role attempts the status control
    Then the system denies the action and displays an unauthorized access message
```

---

### EP-07 · In-Flight Service Management
> **Role:** Flight Attendant
> **Tables involved:** `FLIGHT`, `FLIGHT_BOOKING`, `BOOKING_SEAT`, `PERSON`, `EMPLOYEE`, `INCIDENT`

> **Note:** This epic requires an `INCIDENT` table with at minimum: `id_incident`, `id_flight` (FK → `FLIGHT`), `id_employee` (FK → `EMPLOYEE`), `incident_type`, `description`, and `recorded_at`.

#### US-15 — Consult Passengers and Assigned Seats

**As a** flight attendant,
**I want to** consult the passenger list and their assigned seats for my assigned flight,
**so that** I can provide personalized service and verify the correct seating distribution on board.

**Priority:** High | **Story Points:** 3

**Development Tasks:**

- **T-15.1** Join `FLIGHT_BOOKING`, `BOOKING_SEAT`, and `PERSON` filtered by `id_flight` and `status = 'confirmed'`, sorted ascending by `seat_number`.
- **T-15.2** Display the seat map in read-only mode.
- **T-15.3** Implement search by passenger name or seat number.
- **T-15.4** Generate a printable or exportable version of the passenger list.
- **T-15.5** Deny access if the flight is not linked to the authenticated employee.

##### Acceptance Criteria

```gherkin
Feature: Passenger and Seat Consultation

  Scenario: Full passenger list with seat assignments
    Given the flight attendant accesses their assigned flight
    When they open the passengers section
    Then the system displays for each confirmed passenger: full name and seat number
    And the list is sorted ascending by seat_number

  Scenario: Flight with no confirmed passengers
    Given no FLIGHT_BOOKING records with status = "confirmed" exist
    Then the system displays a message stating there are no confirmed passengers

  Scenario: Access restricted to unassigned flights
    Given the flight is not linked to the attendant's id_person
    Then the system denies access and displays an unauthorized access message

  Scenario: Flight attendant searches for a passenger by name or seat number
    Given the attendant enters a name or seat number in the search field
    Then the system filters the list to show only matching records

  Scenario: Flight attendant views the seat map in read-only mode
    Given the attendant switches to the seat map view
    Then the system displays the seat map with confirmed seats shown as occupied
    And the view is read-only with no selection interaction

  Scenario: Flight attendant prints or exports the passenger list
    Given the attendant clicks "Print" or "Export"
    Then the system generates a printable or downloadable version of the list
```

---

#### US-16 — Record In-Flight Incidents

**As a** flight attendant,
**I want to** record any incident that occurs during the flight,
**so that** it is documented in the system and the administrator can follow up.

**Priority:** Medium | **Story Points:** 3

**Development Tasks:**

- **T-16.1** Create the incident form accessible only on flights with `status = 'departed'`.
- **T-16.2** Use a predefined dropdown for `incident_type`: medical issue, disruptive passenger, cabin damage, other.
- **T-16.3** Insert a new `INCIDENT` record with `id_flight`, `id_employee`, `incident_type`, `description`, and `recorded_at = NOW()`.
- **T-16.4** Display existing incidents for the flight sorted by `recorded_at` descending.
- **T-16.5** Allow multiple independent incidents per flight.

##### Acceptance Criteria

```gherkin
Feature: In-Flight Incident Recording

  Scenario: Successful incident registration
    Given the flight attendant accesses the incident module for a flight
         with status = "departed"
    When they complete incident_type and description and confirm
    Then the system inserts a new record in INCIDENT
    And displays a confirmation message

  Scenario: Registration fails due to incomplete fields
    Given the attendant leaves required fields empty
    Then the system displays validation messages below each missing field
    And no record is inserted into INCIDENT

  Scenario: Incidents can only be recorded on active flights
    Given the flight has status = "scheduled" or "cancelled"
    Then the incident form is not available for submission

  Scenario: Flight attendant views previously recorded incidents
    Given the module loads
    Then the system displays all existing INCIDENT records for the flight
    And the list is sorted descending by recorded_at

  Scenario: Incident type is selected from a predefined list
    Given the attendant interacts with the incident_type field
    Then the system displays a predefined list of types
    And free-text entry is not permitted

  Scenario: Multiple incidents can be recorded for the same flight
    Given a previous incident has already been registered
    When the attendant submits a second report
    Then the system inserts a new independent record in INCIDENT

  Scenario: Flight attendant cannot record incidents on unassigned flights
    Given the flight is not linked to the attendant's profile
    Then the system denies access and no record is inserted in INCIDENT
```

---

### EP-08 · Trolleybus Route Management
> **Role:** Driver
> **Tables involved:** `TROLLEY_TRIP`, `TROLLEY_BOOKING`, `ROUTE`, `BUS_STATION`, `ROUTE_STOP`, `PERSON`, `TROLLEY`

#### US-17 — Consult Daily Trips and Passengers

**As a** tourist trolleybus driver,
**I want to** consult the trips assigned to me for the day along with passenger information and boarding stops,
**so that** I can organize my itinerary and properly attend each stop.

**Priority:** High | **Story Points:** 3

**Development Tasks:**

- **T-17.1** Create the "My Trips Today" section accessible only to users with driver occupation.
- **T-17.2** Query `TROLLEY_TRIP` filtered by the driver's `id_trolley` and `trip_date = TODAY`. Allow date navigation.
- **T-17.3** Display passenger list per trip: join `TROLLEY_BOOKING`, `PERSON`, and `BUS_STATION`, filtered by `status = 'confirmed'`, sorted by `stop_order` in `ROUTE_STOP`.
- **T-17.4** Display occupancy summary (confirmed passengers vs. trolleybus capacity).
- **T-17.5** Show trip details in read-only mode.

##### Acceptance Criteria

```gherkin
Feature: Daily Trip Consultation

  Scenario: Successful display of today's assigned trips
    Given the driver navigates to "My Trips Today"
    Then the system displays all trips assigned to the driver's trolleybus
         for the current date
    And shows for each trip: route name, departure_time, arrival_time,
         origin city, and trip status

  Scenario: No trips assigned for the day
    Given no trips are scheduled for today
    Then the system displays a message stating no trips are scheduled

  Scenario: Passenger list per trip
    Given the driver selects a specific trip
    When they access the trip detail view
    Then the system displays for each confirmed passenger: full name and boarding stop
    And passengers are sorted by boarding stop order

  Scenario: Trip detail displays occupancy summary
    Given the driver opens a trip detail
    Then the system displays total confirmed passengers and trolleybus capacity
    And shows the number of available spots remaining

  Scenario: Driver cannot access trips not assigned to their trolleybus
    Given the driver attempts to access a trip with a different id_trolley
    Then the system denies access and displays an unauthorized access message

  Scenario: Driver consults trips for a different date
    Given the driver selects a different date using a date picker
    Then the system queries TROLLEY_TRIP for that date
    And displays the trips or a message if none exist
```

---

#### US-18 — Update Trolleybus Trip Status

**As a** tourist trolleybus driver,
**I want to** update the status of the trip I am currently operating,
**so that** the system and the administrator are kept informed of the service's progress.

**Priority:** Medium | **Story Points:** 2

> **Valid status transitions in `TROLLEY_TRIP`:** `scheduled` → `in_progress` → `completed` | `cancelled`

**Development Tasks:**

- **T-18.1** Show "Start Trip" and "End Trip" buttons only on trips assigned to the authenticated driver.
- **T-18.2** Enforce valid transitions: `scheduled → in_progress`, `in_progress → completed`, `scheduled/in_progress → cancelled`. Block all other transitions.
- **T-18.3** Show a confirmation dialog before applying any status change.
- **T-18.4** On cancellation, cascade the update to all linked `TROLLEY_BOOKING` records.

##### Acceptance Criteria

```gherkin
Feature: Trolleybus Trip Status Update

  Scenario: Start a scheduled trip
    Given the driver has a trip with status = "scheduled"
    When they press "Start Trip"
    Then the system executes an UPDATE on TROLLEY_TRIP setting status = "in_progress"

  Scenario: Complete a trip that is in progress
    Given the driver has a trip with status = "in_progress"
    When they press "End Trip"
    Then the system executes an UPDATE on TROLLEY_TRIP setting status = "completed"

  Scenario: Cannot end a trip that has not been started
    Given the trip has status = "scheduled"
    When the driver attempts to press "End Trip"
    Then the system displays a message indicating the trip must be started first

  Scenario: Invalid status transition on a completed trip
    Given the trip already has status = "completed"
    When the driver attempts to change the status
    Then the system displays an error indicating the trip cannot be modified

  Scenario: Driver cancels a trip
    Given the driver selects "Cancel Trip" and confirms
    Then the system sets TROLLEY_TRIP status to "cancelled"
    And all linked TROLLEY_BOOKING records are updated to status = "cancelled"

  Scenario: System requires confirmation before applying a status change
    Given the driver selects a new status
    Then the system displays a confirmation dialog
    And only executes the UPDATE after the driver confirms

  Scenario: Driver attempts to update the status of an unassigned trip
    Given the trip's id_trolley does not match the driver's assigned trolleybus
    Then the system denies the action and displays an unauthorized access message
```

---

### EP-09 · System Administration
> **Role:** Administrator
> **Tables involved:** `FLIGHT`, `TROLLEY_TRIP`, `ROUTE`, `TROLLEY_ROUTE_SCHEDULE`, `SCHEDULE_DAY`, `EMPLOYEE`, `PERSON`, `OCCUPATION`, `FLIGHT_BOOKING`, `TROLLEY_BOOKING`, `PAYMENT`, `AIRPORT`, `AIRPLANE`

#### US-19 — Manage Flights (CRUD)

**As an** administrator,
**I want to** create, view, edit, and delete flights in the system,
**so that** the flight catalog available to users is always up to date.

**Priority:** High | **Story Points:** 5

**Development Tasks:**

- **T-19.1** Create the flight management module with a filterable list (status, date range, route).
- **T-19.2** Implement the create form: validate that origin ≠ destination, date is not in the past, flight number is unique, and the airplane has no scheduling conflict.
- **T-19.3** Allow editing only flights with `status = 'scheduled'`.
- **T-19.4** Block deletion if active reservations exist (`status = 'pending'` or `'confirmed'`).

##### Acceptance Criteria

```gherkin
Feature: Flight Management

  Scenario: Create a new flight
    Given the administrator completes the flight form and confirms
    Then the system inserts a new record in FLIGHT with status = "scheduled"
    And the flight becomes available for user searches

  Scenario: Flight on a past date or time is rejected
    Given the administrator enters a flight_date or departure_time in the past
    Then the system displays an error and no record is inserted

  Scenario: Edit an existing flight
    Given the administrator selects a flight with status = "scheduled" and saves changes
    Then the system executes an UPDATE on FLIGHT

  Scenario: Delete a flight with no active reservations
    Given no active FLIGHT_BOOKING records exist for the flight
    When the administrator confirms deletion
    Then the system removes the record from FLIGHT

  Scenario: Delete attempt on a flight with active reservations
    Given at least one FLIGHT_BOOKING with status "pending" or "confirmed" exists
    Then the system displays an error and no record is removed

  Scenario: Flight creation fails when origin and destination airports are the same
    Given the administrator selects the same airport for both
    Then the system displays a validation message and no record is inserted

  Scenario: Flight creation fails with a duplicate flight number
    Given the administrator enters an existing flight_number
    Then the system displays an error and no record is inserted

  Scenario: Administrator cannot edit a non-scheduled flight
    Given the administrator selects a flight with status "departed" or "cancelled"
    Then the system displays the flight in read-only mode

  Scenario: Flight creation fails when the airplane is already assigned
    Given the selected airplane has overlapping assignments on the same date
    Then the system displays a conflict message and no record is inserted
```

---

#### US-20 — Manage Trolleybus Routes and Trips (CRUD)

**As an** administrator,
**I want to** create, view, edit, and delete trolleybus routes, schedules, and trips,
**so that** the trolleybus service catalog available to users is always up to date.

**Priority:** High | **Story Points:** 5

**Development Tasks:**

- **T-20.1** Implement route creation requiring at least two stops in `ROUTE_STOP`.
- **T-20.2** Implement recurring schedule creation in `TROLLEY_ROUTE_SCHEDULE` and `SCHEDULE_DAY`.
- **T-20.3** Implement trip creation in `TROLLEY_TRIP`: validate date not in the past, no trolleybus conflict, and date matches the schedule's operating days.
- **T-20.4** Block route deletion if active trips or reservations exist.
- **T-20.5** Block route editing if active trips exist.

##### Acceptance Criteria

```gherkin
Feature: Trolleybus Route and Trip Management

  Scenario: Create a new route with stops
    Given the administrator enters a route name and at least two stops
    And confirms the registration
    Then the system inserts records into ROUTE and ROUTE_STOP

  Scenario: Create a concrete trip for a specific date
    Given the administrator defines all required trip fields and confirms
    Then the system inserts a new record in TROLLEY_TRIP with status = "scheduled"

  Scenario: Trip on a past date is rejected
    Given the administrator enters a trip_date earlier than today
    Then the system displays an error and no record is inserted

  Scenario: Delete a route with no active trips or reservations
    Given no active trips or reservations exist for the route
    When the administrator confirms deletion
    Then the system removes records from ROUTE, ROUTE_STOP,
         TROLLEY_ROUTE_SCHEDULE, and SCHEDULE_DAY

  Scenario: Delete attempt on a route with active trips or reservations
    Given at least one active trip or reservation exists
    Then the system displays an error and no records are removed

  Scenario: Route creation fails when no stops are defined
    Given the administrator does not add any stops
    Then the system displays a validation message and no record is inserted

  Scenario: Trip creation fails when the trolleybus is already assigned
    Given the selected trolleybus has overlapping assignments on the same date
    Then the system displays a conflict message and no record is inserted

  Scenario: Trip creation fails when the date does not match the schedule days
    Given the trip_date does not correspond to an operating day in SCHEDULE_DAY
    Then the system displays a warning and blocks or requests confirmation
```

---

#### US-21 — Manage Agency Staff

**As an** administrator,
**I want to** register, view, edit, and deactivate agency staff members,
**so that** the employee directory is kept current and staff can be assigned to flights and routes.

**Priority:** High | **Story Points:** 5

> **Available occupations:** Pilot, Co-pilot, Flight Attendant, Driver

**Development Tasks:**

- **T-21.1** Implement registration: insert into `PERSON`, `EMPLOYEE`, and `USER`; create the Supabase Auth account with the assigned role.
- **T-21.2** Validate uniqueness of CURP, RFC, and username; validate CURP and RFC formats.
- **T-21.3** Implement deactivation via Supabase Auth; warn if the employee has active assignments.
- **T-21.4** Implement reactivation of previously deactivated employees.
- **T-21.5** Add occupation filter to the staff directory.

##### Acceptance Criteria

```gherkin
Feature: Agency Staff Management

  Scenario: Register a new employee
    Given the administrator enters all required personal and credential data
    And confirms the registration
    Then the system inserts records into PERSON, EMPLOYEE, and USER
    And creates the account via Supabase Auth with the assigned role

  Scenario: Registration rejected due to duplicate CURP
    Given the administrator enters a CURP that already exists in PERSON
    Then the system displays an error and no records are inserted

  Scenario: Registration rejected due to duplicate username
    Given the administrator enters a username that already exists in USER
    Then the system displays an error and no record is created

  Scenario: Edit an existing employee's information
    Given the administrator modifies allowed fields and saves
    Then the system executes an UPDATE on PERSON and/or EMPLOYEE

  Scenario: Deactivate an employee
    Given the administrator confirms deactivation
    Then the system deactivates the account via Supabase Auth
    And the employee can no longer log in

  Scenario: Deactivation warning when employee has active assignments
    Given the employee is assigned to one or more active flights or trips
    Then the system displays a warning and requires explicit confirmation
    And deactivation does not proceed until confirmed

  Scenario: Administrator reactivates a deactivated employee
    Given the administrator confirms reactivation
    Then the system reactivates the account via Supabase Auth
    And the employee can log in again

  Scenario: Administrator filters the staff directory by occupation
    Given the administrator selects an occupation filter
    Then the system displays only EMPLOYEE records matching the selected role
```

---

#### US-22 — View Reservation and Payment Reports

**As an** administrator,
**I want to** view a consolidated report of all system reservations and payments with filters by date range, service type, and status,
**so that** I can make informed operational decisions and track the agency's financial performance.

**Priority:** Medium | **Story Points:** 3

**Development Tasks:**

- **T-22.1** Build the reports module: display reservation counts by status for both `FLIGHT_BOOKING` and `TROLLEY_BOOKING`.
- **T-22.2** Display total revenue from `PAYMENT` with `payment_status = 'completed'`, broken down by payment method, in MXN.
- **T-22.3** Implement filters: date range, service type (flight / trolleybus), reservation status.
- **T-22.4** Calculate and display cancellation and expiration rates.
- **T-22.5** Implement CSV or PDF export of the current report view.

##### Acceptance Criteria

```gherkin
Feature: Reservation and Payment Report Viewing

  Scenario: View the general reservation summary
    Given the administrator accesses the reports module
    Then the system displays a count of reservations by status:
         pending, confirmed, expired, and cancelled

  Scenario: View completed payment totals
    Given the reports module loads
    Then the system displays total revenue from completed PAYMENT records in MXN
    And shows revenue broken down by payment method

  Scenario: Filter report by date range
    Given the administrator selects a start and end date
    Then the system filters bookings by booking_date within that period

  Scenario: Filter report by service type
    Given the administrator selects "Flight" or "Trolleybus"
    Then the system displays only records corresponding to that service type

  Scenario: Report returns no results for the selected filters
    Given no records match the selected criteria
    Then the system displays a message indicating no data was found
    And shows zero values for all counts and totals

  Scenario: Administrator exports the current report
    Given the administrator clicks "Export"
    Then the system generates a downloadable CSV or PDF
         reflecting the currently displayed data and filters
```

---

#### US-23 — Cancel or Modify a Reservation

**As an** administrator,
**I want to** cancel or manually modify any reservation in the system,
**so that** I can handle special cases, errors, or direct requests from users.

**Priority:** High | **Story Points:** 3

**Development Tasks:**

- **T-23.1** Implement reservation search by passenger name, email, or `id_booking`.
- **T-23.2** Implement cancellation for both booking types; cascade to `BOOKING_SEAT` for flight cancellations.
- **T-23.3** Implement manual confirmation of pending reservations; warn if no completed payment exists.
- **T-23.4** Allow changing the `boarding_stop_id` of a trolleybus reservation to a valid stop within the same route.
- **T-23.5** Log every action (previous status, new status, admin's `id_person`, timestamp) in an audit log accessible from the reports module.

##### Acceptance Criteria

```gherkin
Feature: Reservation Cancellation and Modification

  Scenario: Cancel a confirmed flight reservation
    Given the administrator locates a FLIGHT_BOOKING with status = "confirmed"
    When they select "Cancel Reservation" and confirm
    Then the system updates FLIGHT_BOOKING and all linked BOOKING_SEAT
         records to status = "cancelled"
    And those seats become available again

  Scenario: Cancel a confirmed trolleybus reservation
    Given the administrator locates a TROLLEY_BOOKING with status = "confirmed"
    When they confirm cancellation
    Then the system updates TROLLEY_BOOKING to status = "cancelled"
    And the slot is restored to available inventory

  Scenario: Cancellation attempt on an already cancelled reservation
    Given the reservation already has status = "cancelled"
    When the administrator attempts to cancel it again
    Then the system displays a message indicating it was already cancelled
    And no UPDATE is executed

  Scenario: Manually confirm a pending reservation
    Given the administrator selects "Manually Confirm Reservation" and confirms
    Then the system updates the status to "confirmed"
    And cascades the update to BOOKING_SEAT records for flight bookings

  Scenario: Manual confirmation warns when no completed payment exists
    Given no PAYMENT record with payment_status = "completed" is linked
    Then the system displays a warning and requires explicit confirmation
    And records the manual override in the audit log

  Scenario: Administrator changes the boarding stop of a trolleybus reservation
    Given the administrator selects a new boarding_stop_id valid for the route
    Then the system updates TROLLEY_BOOKING with the new boarding_stop_id

  Scenario: Administrator searches for a reservation
    Given the administrator enters a passenger name, email, or id_booking
    Then the system displays all matching records with their current status,
         service type, and booking date

  Scenario: Every cancellation or modification is logged for audit purposes
    Given the administrator executes any cancellation or modification
    When the UPDATE is applied successfully
    Then the system records the action including: id_booking, previous status,
         new status, administrator's id_person, and timestamp
    And this log is accessible in the reports module
```

---

## 6. Final Acceptance Criteria

All criteria defined in Sprint 2 remain in effect. This sprint adds the following cross-cutting integration verification criteria:

**CI-01.** Every end-user flow (registration → login → booking → payment → ticket) must be completable end-to-end without console errors or failed Supabase requests.

**CI-02.** Every staff flow (login as pilot / co-pilot / attendant / driver → access role-specific section → perform allowed actions) must be completable without errors.

**CI-03.** Every admin flow (login as administrator → manage flights / routes / staff → view reports → cancel or modify reservations) must be completable without errors.

**CI-04.** Data displayed in the frontend must match exactly the records stored in the Supabase database at all times.

**CI-05.** A reservation's expiration must be reflected in the database even if the user closes the browser before the timer reaches zero — enforced via the `expires_at` field and the corresponding trigger.

**CI-06.** A ticket marked as downloaded in Supabase must not be downloadable again from any device or session.

**CI-07.** No protected page must be accessible by navigating directly to its URL without an active session and the correct role.

**CI-08.** Role-based access must be enforced both in the frontend session guard and in the database via Supabase RLS policies.

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

### 7.2 Role-Based Access Control

User roles are resolved at login by querying `EMPLOYEE` joined with `OCCUPATION` using the authenticated user's `id_person`. If no `EMPLOYEE` record exists, the user is treated as a standard passenger. The resolved role is stored in the session and used by the frontend session guard and by Supabase RLS policies.

| Role | Dashboard | Accessible Epics |
|---|---|---|
| Passenger (no EMPLOYEE record) | End-user dashboard | EP-01 through EP-05 |
| Pilot | Staff portal | EP-01, EP-06 |
| Co-pilot | Staff portal | EP-01, EP-06 (read-only on status) |
| Flight Attendant | Staff portal | EP-01, EP-07 |
| Driver | Staff portal | EP-01, EP-08 |
| Administrator | Admin panel | EP-01 through EP-09 |

### 7.3 Row Level Security (RLS) Policies

| Table | Policy | Description |
|---|---|---|
| `PERSON` | SELECT, UPDATE own | User can only read and edit their own record |
| `USER` | SELECT own | User can only read their own profile |
| `FLIGHT_BOOKING` | SELECT, INSERT own; SELECT all for admin | User sees own bookings; admin sees all |
| `TROLLEY_BOOKING` | SELECT, INSERT own; SELECT all for admin | Same, for trolleybus bookings |
| `BOOKING_SEAT` | SELECT all authenticated, INSERT own | Any authenticated user can view the seat map; only the owner inserts |
| `PAYMENT` | INSERT, SELECT own; SELECT all for admin | User accesses own payments; admin sees all |
| `TICKET` | SELECT, UPDATE own | User can only download and mark their own tickets |
| `FLIGHT` | SELECT all authenticated; UPDATE for pilot and admin; INSERT, DELETE for admin | Catalog read for all; writes restricted by role |
| `TROLLEY_TRIP` | SELECT all authenticated; UPDATE for driver and admin; INSERT, DELETE for admin | Same pattern as FLIGHT |
| `INCIDENT` | INSERT for attendant (own assigned flights); SELECT for admin | Attendants insert; admins read all |
| `EMPLOYEE`, `OCCUPATION` | SELECT all authenticated; INSERT, UPDATE, DELETE for admin | Staff directory: read for all; write for admin |
| `AIRPORT`, `ROUTE`, `BUS_STATION` | SELECT all authenticated; INSERT, UPDATE, DELETE for admin | Catalog data |

### 7.4 Reservation Expiration Trigger

A database trigger automatically updates `FLIGHT_BOOKING`, `BOOKING_SEAT`, and `TROLLEY_BOOKING` to `'expired'` when `expires_at < NOW()` and the current status is `'pending'`. This trigger fires on each seat availability query, ensuring data consistency without requiring an external scheduled job.

### 7.5 Test Data Seed

A `seed.sql` file will be included in the repository containing at least:

- 3 origin and destination airports.
- 5 flights with future dates, different routes, and prices.
- 2 airplane models with different capacities.
- 2 trolleybus routes with defined stops.
- 4 trolleybus trips with future dates.
- 1 employee per occupation (pilot, co-pilot, flight attendant, driver).
- 1 administrator account.

---

## 8. Test Plan

### 8.1 Integration Tests by Module

| ID | Module | Scenario to Verify | Owner |
|---|---|---|---|
| PT-01 | Authentication | Successful registration creates records in `PERSON`, `USER`, and Supabase Auth | Cruz Estrada Johana |
| PT-02 | Authentication | Login with a non-existent user displays the correct error | Cruz Estrada Johana |
| PT-03 | Authentication | Direct navigation to a protected URL without a session redirects to login | Cruz Estrada Johana |
| PT-04 | Authentication | Each role is redirected to the correct dashboard after login | Cruz Estrada Johana |
| PT-05 | Flights (end user) | Search returns only matching, non-fully-booked flights | Cruz Estrada Johana |
| PT-06 | Flights (end user) | The seat map reflects seats actually reserved in the database | Cruz Estrada Johana |
| PT-07 | Flights (end user) | Timer expiration updates status in the database even when the browser is closed | Cruz Estrada Johana |
| PT-08 | Trolleybus (end user) | Seat availability is correctly calculated against trolleybus model capacity | Cruz Estrada Johana |
| PT-09 | Payment | Payment is rejected if `expires_at` has already been exceeded | Cruz Estrada Johana |
| PT-10 | Payment | Reservation status changes to `'confirmed'` in the database after payment | Cruz Estrada Johana |
| PT-11 | Ticket | An already-downloaded ticket cannot be downloaded again from a different session | Cruz Estrada Johana |
| PT-12 | Ticket | The PDF contains correct data for both flight and trolleybus reservation types | Cruz Estrada Johana |
| PT-13 | Staff — Pilot | Pilot can view assigned flights and update status; co-pilot cannot update status | Cruz Estrada Johana |
| PT-14 | Staff — Pilot | Flight cancellation cascades to all linked `FLIGHT_BOOKING` records | Cruz Estrada Johana |
| PT-15 | Staff — Attendant | Flight attendant can only access passengers for their assigned flight | Cruz Estrada Johana |
| PT-16 | Staff — Attendant | Incidents can only be recorded on flights with `status = 'departed'` | Cruz Estrada Johana |
| PT-17 | Staff — Driver | Driver can only view and update trips assigned to their trolleybus | Cruz Estrada Johana |
| PT-18 | Staff — Driver | Trip cancellation cascades to all linked `TROLLEY_BOOKING` records | Cruz Estrada Johana |
| PT-19 | Admin | Administrator can create, edit, and delete flights and trolleybus routes | Cruz Estrada Johana |
| PT-20 | Admin | Flight deletion is blocked when active reservations exist | Cruz Estrada Johana |
| PT-21 | Admin | Staff registration creates records in `PERSON`, `EMPLOYEE`, `USER`, and Supabase Auth | Cruz Estrada Johana |
| PT-22 | Admin | Report totals and filters return correct data from the database | Cruz Estrada Johana |
| PT-23 | Admin | Reservation cancellation cascades correctly to `BOOKING_SEAT` | Cruz Estrada Johana |

### 8.2 Approval Criteria

A user story is considered **approved** when:

1. All its Gherkin scenarios pass against the real Supabase environment.
2. No errors appear in the browser console during the execution of the flow.
3. Data state changes are verifiable directly in the Supabase dashboard.
4. Role-based access restrictions are confirmed — unauthorized roles cannot reach protected pages or execute restricted queries.

---

## 9. Definition of Done

A user story is considered **done** in this sprint only when it meets **all** of the following:

- [ ] Code is committed to the corresponding branch and merged to `main` on GitHub.
- [ ] The commit author is the team member responsible for the task — repositories with a single author are not acceptable.
- [ ] The feature is integrated with Supabase and operates with real data (no hardcoded values).
- [ ] Gherkin acceptance criteria from the Product Backlog have been manually verified.
- [ ] The interface meets the UI/UX requirements defined in Sprint 2 (inline validation messages, loading indicators, timer visual states).
- [ ] Role-based access is enforced both in the frontend session guard and through Supabase RLS policies.
- [ ] No sensitive data (passwords, full card numbers, API keys) is present in the versioned code.
- [ ] The tester (Cruz Estrada Johana) has signed off on the story's approval.

---

## 10. Final Scope and Project Closure

### Sprint 3 Deliverables

| Deliverable | Description |
|---|---|
| Functional web application | All 23 user stories across 9 epics operational and integrated with Supabase |
| Production database | Complete schema with RLS policies, expiration trigger, `INCIDENT` table, and test data |
| Source code on GitHub | Repository with commits from all team members and an updated README |
| Technical documentation | Sprint 1, Sprint 2, and Sprint 3 documents in the repository |
| `seed.sql` file | Script to populate the database with demo data for all user roles |

### Features Completed in v1.0

**End-User Features (EP-01 through EP-05)**
- ✅ User registration, login, and logout with Supabase Auth
- ✅ Flight search with real filters (origin, destination, date, seat availability)
- ✅ Dynamic seat map with real-time states from Supabase
- ✅ Flight reservation with 10-minute timer validated at the database level
- ✅ Trolleybus route browsing with availability validation
- ✅ Trolleybus reservation with boarding stop selection
- ✅ Simulated payment (cash, card, transfer) with status update in Supabase
- ✅ PDF ticket generation with jsPDF using real reservation data
- ✅ Permanent re-download block persisted in Supabase

**Staff Features (EP-06 through EP-08)**
- ✅ Pilot / co-pilot portal: assigned flight consultation and passenger manifest
- ✅ Flight status update (pilot only) with valid transition enforcement
- ✅ Flight attendant portal: passenger and seat consultation with export
- ✅ In-flight incident recording with predefined incident types
- ✅ Driver portal: daily trip consultation with passenger list sorted by boarding stop
- ✅ Trolleybus trip status update with valid transition enforcement

**Administration Features (EP-09)**
- ✅ Flight CRUD with conflict and validation checks
- ✅ Trolleybus route and trip CRUD with conflict and validation checks
- ✅ Agency staff management (register, edit, deactivate, reactivate)
- ✅ Consolidated reservation and payment reports with filters and export
- ✅ Manual reservation cancellation and modification with audit logging

### Out of Scope (v1.0) — Unchanged

- Real payment gateway integration
- Native mobile application
- Email notification system
- Real-time seat map synchronization between simultaneous user sessions

### Closing Notes

This sprint concludes the academic development cycle of **Flygth With You** for the school term at CBTis 47. The system will not be deployed to a public production server; its demonstration will take place in a local environment or on Supabase's free tier with controlled access during the final presentation.

---

## 11. Backlog Summary

| Story ID | User Story | Epic | Role | Priority | Points |
|---|---|---|---|---|---|
| US-01 | User Registration | EP-01 | End User | High | 5 |
| US-02 | User Login | EP-01 | End User | High | 2 |
| US-03 | User Logout | EP-01 | End User | Medium | 1 |
| US-04 | Flight Search | EP-02 | End User | High | 5 |
| US-05 | Seat Selection for Flights | EP-02 | End User | High | 5 |
| US-06 | Flight Reservation Confirmation | EP-02 | End User | High | 3 |
| US-07 | Browse Trolleybus Routes | EP-03 | End User | High | 3 |
| US-08 | Trolleybus Reservation | EP-03 | End User | High | 5 |
| US-09 | Complete Payment for a Reservation | EP-04 | End User | High | 5 |
| US-10 | Add Reservations to a Ticket | EP-05 | End User | Medium | 3 |
| US-11 | Download PDF Ticket | EP-05 | End User | Medium | 5 |
| US-12 | Consult Assigned Flights | EP-06 | Pilot / Co-pilot | High | 3 |
| US-13 | View Flight Passenger Manifest | EP-06 | Pilot / Co-pilot | High | 3 |
| US-14 | Update Flight Status | EP-06 | Pilot | High | 3 |
| US-15 | Consult Passengers and Assigned Seats | EP-07 | Flight Attendant | High | 3 |
| US-16 | Record In-Flight Incidents | EP-07 | Flight Attendant | Medium | 3 |
| US-17 | Consult Daily Trips and Passengers | EP-08 | Driver | High | 3 |
| US-18 | Update Trolleybus Trip Status | EP-08 | Driver | Medium | 2 |
| US-19 | Manage Flights (CRUD) | EP-09 | Administrator | High | 5 |
| US-20 | Manage Trolleybus Routes and Trips (CRUD) | EP-09 | Administrator | High | 5 |
| US-21 | Manage Agency Staff | EP-09 | Administrator | High | 5 |
| US-22 | View Reservation and Payment Reports | EP-09 | Administrator | Medium | 3 |
| US-23 | Cancel or Modify a Reservation | EP-09 | Administrator | High | 3 |
| **Total** | | | | | **83 pts** |

---

*Flygth With You — CBTis 47 · May – June 2026*
