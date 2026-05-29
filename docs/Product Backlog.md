# Product Backlog — Flying With You
> **Flight & Tourism Agency** · CBTis 47  
> **Stack:** HTML5 · CSS3 · JavaScript · Supabase (PostgreSQL) · jsPDF · GitHub

---

## 🎯 Product Goal

> Enable users of a tourism agency to independently register, search, book, and pay for flights or tourist trolleybus trips through a web application, receiving a downloadable PDF ticket as proof of their confirmed reservation — reducing manual workload for the agency and improving the end-to-end experience for travelers.

---

## 📦 Epics

| ID | Epic Name | Audience | Priority |
|---|---|---|---|
| EP-01 | User Authentication | End User | High |
| EP-02 | Flight Reservation | End User | High |
| EP-03 | Tourist Trolleybus Reservation | End User | High |
| EP-04 | Payment Processing | End User | High |
| EP-05 | PDF Ticket Generation | End User | Medium |
| EP-06 | Assigned Flight Management | Pilot / Co-pilot | High |
| EP-07 | In-Flight Service Management | Flight Attendant | High |
| EP-08 | Trolleybus Route Management | Driver | High |
| EP-09 | System Administration | Administrator | High |

---

## 📊 Backlog Summary

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
| **Total** | | | | | **81** |

---

---

## EP-01 · User Authentication

---

### US-01 — User Registration

**As a** new visitor,
**I want to** create an account with my personal data and credentials,
**so that** I can access the reservation system securely.

**Priority:** High | **Story Points:** 5

#### Acceptance Criteria

```gherkin
Feature: User Registration

  Scenario: Successful registration with valid data
    Given the user is on the registration page
    When the user enters a valid name, last names, CURP, date of birth,
         email address, username, and password
    And the user submits the registration form
    Then the system creates a new account via Supabase Auth
    And the personal data (name, last names, CURP, date of birth, and email)
         are stored in the PERSON table
    And the username and password are stored in the USER table
    And the user is redirected to the login page
    And a confirmation message is displayed

  Scenario: Registration fails with an existing email
    Given the user is on the registration page
    When the user enters an email that is already registered in the PERSON table
    And the user submits the registration form
    Then the system displays an error message indicating the email is already in use
    And no new record is created in PERSON, USER, or Supabase Auth

  Scenario: Registration fails with an existing username
    Given the user is on the registration page
    When the user enters a username that already exists in the USER table
    And the user submits the registration form
    Then the system displays an error message indicating the username is already in use
    And no new record is created in PERSON, USER, or Supabase Auth

  Scenario: Registration fails with an existing CURP
    Given the user is on the registration page
    When the user enters a CURP that is already stored in the PERSON table
    And the user submits the registration form
    Then the system displays an error message indicating the CURP is already in use
    And no new account is created

  Scenario: Registration fails with incomplete fields
    Given the user is on the registration page
    When the user leaves one or more required fields empty
    And the user submits the registration form
    Then the system highlights each empty field
    And displays a validation message directly below each missing field

  Scenario: Registration fails with invalid field formats
    Given the user is on the registration page
    When the user enters a CURP that does not match the official format
    Or the user enters an email without a valid format (e.g. "userexample.com")
    Or the user enters a password shorter than the minimum required length
    And the user submits the registration form
    Then the system displays a format validation message for each invalid field
    And no new record is created

  Scenario: Registration fails with invalid field formats
   Given the user is on the registration page
   When the user enters a CURP that does not match the official format
   Or the user enters an email without a valid format (e.g. "userexample.com")
   Or the user enters a password shorter than the minimum required length
   And the user submits the registration form
   Then the system displays a format validation message for each invalid field
   And no new record is created

  Scenario: Registration fails due to an external service error
  Given the user is on the registration page
  And the Supabase Auth service is unavailable
  When the user submits a valid registration form
  Then the system displays a generic error message indicating a temporary issue
  And the user is invited to try again later
  And no partial record is created in PERSON or USER
```

---

### US-02 — User Login

**As a** registered user,
**I want to** log in with my username and password,
**so that** I can access my account and manage my reservations.

**Priority:** High | **Story Points:** 2

#### Acceptance Criteria

```gherkin
Feature: User Login

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user enters a registered username and the correct password
    And the user clicks the login button
    Then the system resolves the username to its associated email
         in the USER table and authenticates via Supabase Auth
    And the user is redirected to the home dashboard

  Scenario: Login fails with incorrect credentials
    Given the user is on the login page
    When the user enters an incorrect username or password
    And the user clicks the login button
    Then the system displays an authentication error message
    And the user remains on the login page

  Scenario: Login fails with empty fields
    Given the user is on the login page
    When the user submits the form with one or more empty fields
    Then the system displays a validation message below each empty field
    And does not attempt authentication via Supabase Auth

  Scenario: Login fails due to a disabled account
  Given the user is on the login page
  When the user enters valid credentials for a disabled or suspended account
  And the user clicks the login button
  Then the system displays a message indicating the account is not active
  And the user is not granted access to the dashboard

  Scenario: Login is temporarily blocked after multiple failed attempts
  Given the user is on the login page
  And the user has already failed to log in 5 consecutive times
  When the user attempts to log in again
  Then the system blocks further login attempts temporarily
  And displays a message indicating the account is locked and when to retry
```

---

### US-03 — User Logout

**As a** logged-in user,
**I want to** log out of my active session,
**so that** my account remains secure when I finish using the system.

**Priority:** Medium | **Story Points:** 1

#### Acceptance Criteria

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
  When the user tries to navigate to a protected page
       (e.g. via browser back button or direct URL)
  Then the system redirects the user to the login page
  And no protected content is displayed

  Scenario: Session expires due to inactivity
  Given the user is logged in but has been inactive for the defined timeout period
  When the user attempts to interact with the application
  Then the system automatically terminates the session
  And redirects the user to the login page
  And displays a message indicating the session expired
```

---

## EP-02 · Flight Reservation

---

### US-04 — Flight Search

**As a** logged-in user,
**I want to** search for available flights by origin, destination, and travel date,
**so that** I can find the flight that best fits my travel plans.

**Priority:** High | **Story Points:** 5

#### Acceptance Criteria

```gherkin
Feature: Flight Search

  Scenario: Successful search with matching results
    Given the user is on the flight search page
    When the user selects an origin city, a destination city, and a valid travel date
    And the user clicks the search button
    Then the system queries the FLIGHT table filtering by origin_city,
         destination_city, flight_date, and status = "scheduled"
    And displays a list of matching flights with departure time, arrival time,
         and base_price

  Scenario: Search returns no results
    Given the user is on the flight search page
    When the user selects a combination with no matching records in the FLIGHT table
    And the user clicks the search button
    Then the system displays a message indicating no flights were found
    And suggests the user try a different date or route

  Scenario: Search submitted with incomplete filters
    Given the user is on the flight search page
    When the user submits the search form without filling in all required filters
    Then the system highlights the missing fields
    And does not execute any query against the database

  Scenario: Search fails when origin and destination are the same
  Given the user is on the flight search page
  When the user selects the same city for both origin and destination
  And the user clicks the search button
  Then the system displays a validation message indicating
       origin and destination cannot be the same
  And does not execute any query against the database

  Scenario: Search fails with a past travel date
  Given the user is on the flight search page
  When the user selects a travel date earlier than today's date
  And the user clicks the search button
  Then the system displays a validation message indicating
       the travel date must be today or a future date
  And does not execute any query against the database

  Scenario: Search results only show flights with available seats
  Given the user performs a valid search with matching flights
  When some of those flights have no remaining available seats
  Then the system excludes fully booked flights from the results
  Or displays them as unavailable so the user is not misled
```

---

### US-05 — Seat Selection for Flights

**As a** logged-in user,
**I want to** view the seat map of a selected flight and choose an available seat,
**so that** I can secure the specific seat I prefer before proceeding to payment.

**Priority:** High | **Story Points:** 5

#### Acceptance Criteria

```gherkin
Feature: Flight Seat Selection

  Scenario: Viewing the seat map
    Given the user has selected a flight from the search results
    When the seat selection screen loads
    Then the system displays a visual seat map generated from the
         AIRPLANE_MODEL capacity for that flight's id_airplane
    And available seats are shown in green
    And seats with a BOOKING_SEAT record with status = "pending"
         or status = "confirmed" are shown in red
    And a color legend is visible near the seat map

  Scenario: Selecting an available seat
    Given the user is viewing the seat map
    When the user clicks on a green (available) seat
    Then the seat is marked as selected with a distinct visual state (e.g., blue)
    And the seat label (e.g., "12A") is displayed in the reservation summary

  Scenario: Attempting to select an occupied seat
    Given the user is viewing the seat map
    When the user clicks on a red (occupied or reserved) seat
    Then the system does not allow the selection
    And displays a message indicating the seat is unavailable

  Scenario: User changes seat selection before proceeding
  Given the user has already selected a seat (shown in blue)
  When the user clicks on a different available seat
  Then the previously selected seat returns to green (available)
  And the new seat is marked as selected (blue)
  And the reservation summary updates to reflect the new seat label

  Scenario: User attempts to proceed without selecting a seat
  Given the user is viewing the seat map
  When the user clicks the "Continue" or "Proceed to payment" button
       without having selected any seat
  Then the system displays a message indicating a seat must be selected
       before proceeding
  And the user remains on the seat selection screen

  Scenario: A seat becomes occupied while the user is viewing the map
  Given the user is viewing the seat map with a seat shown as available
  When another user reserves that seat during the same session
  And the current user attempts to select that seat
  Then the system detects the conflict at the moment of selection or confirmation
  And notifies the user that the seat is no longer available
  And refreshes the seat map to reflect the current state
```

---

### US-06 — Flight Reservation Confirmation

**As a** logged-in user,
**I want to** confirm my seat selection and create a reservation with pending status,
**so that** my seat is held while I complete the payment process.

**Priority:** High | **Story Points:** 3

#### Acceptance Criteria

```gherkin
Feature: Flight Reservation Creation

  Scenario: Reservation created with pending status
    Given the user has selected a seat on a flight
    When the user confirms the selection
    Then the system inserts a record in FLIGHT_BOOKING with status = "pending"
    And inserts a record in BOOKING_SEAT with the selected seat_number,
         selected_at set to the current timestamp,
         and expires_at set to selected_at + 10 minutes
    And a 10-minute payment countdown timer starts and is permanently
         displayed to the user during the payment flow

  Scenario: Reservation expires before payment
    Given the user has a pending reservation and the 10-minute timer is active
    When the countdown reaches zero without payment being completed
    Then the system updates FLIGHT_BOOKING status to "expired"
    And updates the related BOOKING_SEAT status to "expired"
    And the seat becomes available again for other users
    And the user receives an immediate notification that the reservation has expired

  Scenario: Duplicate reservation attempt
    Given the user already has a record in FLIGHT_BOOKING with
         status = "pending" for the same id_flight
    When the user attempts to make another reservation on the same flight
    Then the system displays a message indicating an active reservation
         already exists for that flight
    And does not insert a new record in FLIGHT_BOOKING or BOOKING_SEAT
```

---

## EP-03 · Tourist Trolleybus Reservation

---

### US-07 — Browse Trolleybus Routes

**As a** logged-in user,
**I want to** browse available tourist trolleybus routes,
**so that** I can choose the route that interests me before making a reservation.

**Priority:** High | **Story Points:** 3

#### Acceptance Criteria

```gherkin
Feature: Trolleybus Route Browsing

  Scenario: Displaying available routes
    Given the user is on the trolleybus section of the application
    When the page loads
    Then the system queries the ROUTE table and retrieves all available routes
    And each route displays its route_name and departure location
         (station_name from BUS_STATION via the first ROUTE_STOP record)

  Scenario: No routes available
    Given the user is on the trolleybus section
    When the ROUTE table returns no records
    Then the system displays a message informing the user that no routes
         are currently available
```

---

### US-08 — Trolleybus Reservation

**As a** logged-in user,
**I want to** select a trolleybus route, a date, and a boarding stop to create a reservation,
**so that** I can secure my spot on the tour before proceeding to payment.

**Priority:** High | **Story Points:** 5

#### Acceptance Criteria

```gherkin
Feature: Trolleybus Reservation

  Scenario: Successful reservation creation
    Given the user has selected a trolleybus route
    When the user selects a valid trip date and a boarding stop (boarding_stop_id
         from BUS_STATION) and confirms the reservation
    Then the system inserts a record in TROLLEY_BOOKING with status = "pending",
         the selected id_trip, boarding_stop_id, and booking_date
    And a 10-minute payment countdown timer starts and is displayed to the user

  Scenario: Reservation attempt with no availability on the selected date
    Given the user has selected a route
    When the user selects a date for which no TROLLEY_TRIP record exists
         with status = "scheduled" and available capacity
    Then the system displays a message indicating no availability for that date
    And the user is prompted to choose a different date

  Scenario: Reservation expires before payment
    Given the user has a pending trolleybus reservation with the timer active
    When the countdown reaches zero without payment being completed
    Then the system updates TROLLEY_BOOKING status to "expired"
    And the reserved slot is restored to available inventory in TROLLEY_TRIP
    And the user is notified immediately that the reservation has expired
```

---

## EP-04 · Payment Processing

---

### US-09 — Complete Payment for a Reservation

**As a** logged-in user,
**I want to** pay for my pending reservation within the allotted time,
**so that** my reservation is confirmed and I can receive my ticket.

**Priority:** High | **Story Points:** 5

#### Acceptance Criteria

```gherkin
Feature: Reservation Payment

  Scenario: Successful payment within the time limit
    Given the user has a pending reservation and the 10-minute timer is still active
    When the user completes the simulated payment process
    Then the system inserts a record in PAYMENT with payment_status = "completed",
         the selected payment_method, amount, payment_date, and card_last_four
         (if applicable — stored for receipt display only, never full card data)
    And updates the reservation status from "pending" to "confirmed"
         in FLIGHT_BOOKING or TROLLEY_BOOKING accordingly
    And the user is redirected to the ticket screen

  Scenario: Payment attempted after timer expiry
    Given the user has a pending reservation
    When the expires_at timestamp in BOOKING_SEAT has already passed
    And the user attempts to submit payment
    Then the system rejects the transaction
    And displays a message informing the user that the reservation has expired
    And prompts the user to start a new reservation

  Scenario: Payment fails due to a processing error
    Given the user has a pending reservation and submits payment
    When the payment simulation returns an error
    Then the system inserts a record in PAYMENT with payment_status = "failed"
    And the reservation remains in "pending" status in FLIGHT_BOOKING
         or TROLLEY_BOOKING
    And the countdown timer continues running
    And the system displays a clear error message to the user
```

---

## EP-05 · PDF Ticket Generation

---

### US-10 — Add Reservations to a Ticket

**As a** logged-in user with at least one confirmed reservation,
**I want to** add one or more confirmed reservations to a single ticket,
**so that** I can consolidate multiple bookings into one downloadable document.

**Priority:** Medium | **Story Points:** 3

#### Acceptance Criteria

```gherkin
Feature: Ticket Accumulation

  Scenario: Adding a confirmed reservation to the ticket
    Given the user has at least one record in FLIGHT_BOOKING or TROLLEY_BOOKING
         with status = "confirmed"
    When the user clicks the "Add" button on the ticket screen
    Then the reservation details are appended to the current ticket summary
    And the ticket screen shows all accumulated reservations before download

  Scenario: Attempting to add an unconfirmed reservation to a ticket
    Given the user has a reservation with status = "pending"
    When the user attempts to add it to the ticket
    Then the system prevents the action
    And displays a message indicating that only confirmed reservations
         can be added to a ticket
```

---

### US-11 — Download PDF Ticket

**As a** logged-in user with at least one confirmed reservation added to the ticket,
**I want to** download my ticket as a PDF file,
**so that** I have a printable proof of my confirmed bookings.

**Priority:** Medium | **Story Points:** 5

#### Acceptance Criteria

```gherkin
Feature: PDF Ticket Download

  Scenario: Successful first-time download
    Given the user has added at least one confirmed reservation to the ticket
    When the user clicks the "Download" button
    Then the system generates a PDF using jsPDF containing all reservation
         details: route or flight name, seat number, travel date,
         and passenger full name (from the PERSON table)
    And the file is downloaded to the user's device
    And the system inserts a record in the TICKET table
         and marks it as downloaded

  Scenario: Attempting to download a ticket that has already been downloaded
    Given the user's current ticket already has a record in the TICKET table
         marked as downloaded
    When the user attempts to download it again
    Then the system displays a message indicating the ticket has already been issued
    And the "Download" button label changes to "Ticket already issued"
         and remains permanently disabled
    And the block persists even if the user switches devices or starts a new session

  Scenario: Download attempted with no reservations added
    Given the user is on the ticket screen with no reservations added
    When the user clicks the "Download" button
    Then the system displays a validation message
    And does not generate or download any file
    And the "Download" button remains disabled (grayed out)
```

---

---

## EP-06 · Assigned Flight Management
> **Roles:** Pilot / Co-pilot  
> **Tables involved:** `FLIGHT`, `FLIGHT_BOOKING`, `BOOKING_SEAT`, `PERSON`, `AIRPORT`, `AIRPLANE`

---

### US-12 — Consult Assigned Flights

**As a** pilot or co-pilot,
**I want to** consult the flights assigned to me with their route, aircraft, date, and schedule details,
**so that** I can plan and prepare correctly before each operation.

**Priority:** High | **Story Points:** 3

#### Acceptance Criteria

```gherkin
Feature: Assigned Flight Consultation

  Scenario: Successful display of assigned flights
    Given the pilot or co-pilot is logged into the system
    When they navigate to the "My Flights" section
    Then the system queries the FLIGHT table and displays all flights
         assigned to that employee
    And each record shows: flight_number, origin_city, destination_city,
         flight_date, departure_time, arrival_time, and status

  Scenario: No assigned flights available
    Given the pilot or co-pilot is logged into the system
    When they access "My Flights" and no FLIGHT records are linked to their profile
    Then the system displays a message stating there are no flights assigned
         at this time

  Scenario: Filter flights by date
    Given the pilot or co-pilot is viewing their flight list
    When they apply a filter for a specific date
    Then the system displays only the FLIGHT records whose flight_date
         matches the selected date

  Scenario: Cancelled flights are excluded from the list
    Given flights with status = "cancelled" are linked to the employee's profile
    When the pilot or co-pilot accesses "My Flights"
    Then the system excludes those records and only displays flights with
         status = "scheduled" or status = "departed"
```

---

### US-13 — View Flight Passenger Manifest

**As a** pilot or co-pilot,
**I want to** view the passenger manifest of an assigned flight,
**so that** I can review confirmed occupancy and verify that all information is complete before operating.

**Priority:** High | **Story Points:** 3

#### Acceptance Criteria

```gherkin
Feature: Flight Passenger Manifest

  Scenario: Manifest with confirmed passengers
    Given the pilot or co-pilot selects a flight from their assigned list
    When they open the flight detail view
    Then the system queries FLIGHT_BOOKING and BOOKING_SEAT filtered by
         id_flight and status = "confirmed"
    And displays for each passenger: full name (from PERSON), seat number
         (seat_number from BOOKING_SEAT), and reservation status
         (status from FLIGHT_BOOKING)

  Scenario: Flight with no confirmed reservations
    Given the pilot or co-pilot opens a flight detail view
    When no FLIGHT_BOOKING records with status = "confirmed" exist
         for that id_flight
    Then the system displays a message stating no passengers have been
         confirmed for this flight yet

  Scenario: Manifest is displayed in read-only mode
    Given the pilot or co-pilot is viewing the passenger manifest
    When they review the displayed information
    Then the system shows no options to edit or delete records
         in FLIGHT_BOOKING or BOOKING_SEAT
```

---

### US-14 — Update Flight Status

**As a** pilot,
**I want to** update the operational status of an assigned flight,
**so that** the system accurately reflects the real progress of the operation.

**Priority:** High | **Story Points:** 3

> **Valid status transitions in `FLIGHT`:** `scheduled` → `departed` → `cancelled`

#### Acceptance Criteria

```gherkin
Feature: Flight Status Update

  Scenario: Change status from "scheduled" to "departed"
    Given the pilot accesses the detail of a flight with status = "scheduled"
         in the FLIGHT table
    When they select the option "Mark as departed" and confirm
    Then the system executes an UPDATE on FLIGHT setting status = "departed"
         for that id_flight
    And the new status is immediately reflected in the pilot's view

  Scenario: Invalid status reversal attempt
    Given the flight has status = "departed" in the FLIGHT table
    When the pilot attempts to change the status back to "scheduled"
    Then the system displays an error message indicating the status
         transition is not valid
    And the status field in FLIGHT is not modified

  Scenario: Co-pilot cannot modify the flight status
    Given a co-pilot accesses the detail of an assigned flight
    When they open the flight detail view
    Then the system displays the FLIGHT information in read-only mode
    And the control to change the status is not visible or accessible
         to the co-pilot role
```

---

## EP-07 · In-Flight Service Management
> **Role:** Flight Attendant (male or female)  
> **Tables involved:** `FLIGHT`, `FLIGHT_BOOKING`, `BOOKING_SEAT`, `PERSON`, `EMPLOYEE`

---

### US-15 — Consult Passengers and Assigned Seats

**As a** flight attendant,
**I want to** consult the passenger list and their assigned seats for my assigned flight,
**so that** I can provide personalized service and verify the correct seating distribution on board.

**Priority:** High | **Story Points:** 3

#### Acceptance Criteria

```gherkin
Feature: Passenger and Seat Consultation

  Scenario: Full passenger list with seat assignments
    Given the flight attendant is logged in and accesses their assigned flight
    When they open the passengers section of the flight
    Then the system performs a JOIN between FLIGHT_BOOKING, BOOKING_SEAT,
         and PERSON filtered by id_flight and status = "confirmed"
         in FLIGHT_BOOKING
    And displays for each passenger: full name (name + last_names from PERSON)
         and seat number (seat_number from BOOKING_SEAT)
    And the list is sorted in ascending order by seat_number

  Scenario: Flight with no confirmed passengers
    Given the flight attendant accesses the passengers section of their flight
    When no records with status = "confirmed" exist in FLIGHT_BOOKING
         for that id_flight
    Then the system displays a message stating there are no confirmed
         passengers for this flight

  Scenario: Access restricted to unassigned flights
    Given the flight attendant attempts to access the detail of a flight
         not linked to their id_person in the EMPLOYEE table
    When they navigate to that flight
    Then the system denies access and displays an "unauthorized access" message
```

---

### US-16 — Record In-Flight Incidents

**As a** flight attendant,
**I want to** record any incident that occurs during the flight (medical issue, disruptive passenger, cabin damage, etc.),
**so that** it is documented in the system and the administrator can follow up.

**Priority:** Medium | **Story Points:** 3

> **Technical note:** This feature requires an `INCIDENT` table in Supabase storing at minimum: `id_incident`, `id_flight` (FK → `FLIGHT`), `id_employee` (FK → `EMPLOYEE`), `incident_type`, `description`, and `recorded_at`.

#### Acceptance Criteria

```gherkin
Feature: In-Flight Incident Recording

  Scenario: Successful incident registration
    Given the flight attendant accesses the incident module for their active flight
         (status = "departed" in the FLIGHT table)
    When they complete the required fields: incident_type and description,
         and confirm the submission
    Then the system inserts a new record in the INCIDENT table with the
         corresponding id_flight, the attendant's id_person as id_employee,
         and the current timestamp in recorded_at
    And displays a confirmation message stating the incident was
         successfully registered

  Scenario: Registration fails due to incomplete fields
    Given the flight attendant attempts to record an incident
    When they leave one or more required fields empty and submit the form
    Then the system highlights the missing fields with a validation message
         displayed directly below each field
    And no record is inserted into the INCIDENT table

  Scenario: Incidents can only be recorded on active flights
    Given the flight attendant attempts to record an incident on a flight
         with status = "scheduled" or status = "cancelled" in FLIGHT
    When they access the incident form
    Then the system displays a message indicating that incidents can only
         be recorded on flights with status = "departed"
    And the form is not available for submission
```

---

## EP-08 · Trolleybus Route Management
> **Role:** Driver  
> **Tables involved:** `TROLLEY_TRIP`, `TROLLEY_BOOKING`, `ROUTE`, `BUS_STATION`, `ROUTE_STOP`, `PERSON`, `TROLLEY`

---

### US-17 — Consult Daily Trips and Passengers

**As a** tourist trolleybus driver,
**I want to** consult the trips assigned to me for the day along with passenger information and boarding stops,
**so that** I can organize my itinerary and properly attend each stop.

**Priority:** High | **Story Points:** 3

#### Acceptance Criteria

```gherkin
Feature: Daily Trip Consultation

  Scenario: Successful display of today's assigned trips
    Given the driver is logged into the system
    When they navigate to the "My Trips Today" section
    Then the system queries TROLLEY_TRIP filtered by the id_trolley assigned
         to the driver and trip_date equal to the current date
    And displays for each trip: route name (from ROUTE), departure_time,
         arrival_time, origin city (from BUS_STATION via origin_station_id),
         and trip status

  Scenario: No trips assigned for the day
    Given the driver accesses the system on a day with no assigned trips
    When they view "My Trips Today"
    Then the system displays a message stating no trips are scheduled
         for today

  Scenario: Passenger list per trip
    Given the driver selects a specific trip from the daily list
    When they access the trip detail view
    Then the system queries TROLLEY_BOOKING filtered by id_trip and
         status = "confirmed", joining with PERSON and BUS_STATION
    And displays for each passenger: full name (name + last_names from PERSON)
         and boarding stop (station_name from BUS_STATION via boarding_stop_id)

  Scenario: Trip detail is displayed in read-only mode
    Given the driver is viewing a trip detail or its passenger list
    When they review the displayed information
    Then the system shows no controls to edit records in TROLLEY_TRIP
         or TROLLEY_BOOKING
```

---

### US-18 — Update Trolleybus Trip Status

**As a** tourist trolleybus driver,
**I want to** update the status of the trip I am currently operating,
**so that** the system and the administrator are kept informed of the service's progress.

**Priority:** Medium | **Story Points:** 2

> **Valid status transitions in `TROLLEY_TRIP`:** `scheduled` → `in_progress` → `completed` | `cancelled`

#### Acceptance Criteria

```gherkin
Feature: Trolleybus Trip Status Update

  Scenario: Start a scheduled trip
    Given the driver has a trip with status = "scheduled" in TROLLEY_TRIP
    When they press the "Start Trip" button in the trip detail view
    Then the system executes an UPDATE on TROLLEY_TRIP setting
         status = "in_progress" for that id_trip
    And the driver's view immediately reflects the new status

  Scenario: Complete a trip that is in progress
    Given the driver has a trip with status = "in_progress" in TROLLEY_TRIP
    When they press the "End Trip" button
    Then the system executes an UPDATE on TROLLEY_TRIP setting
         status = "completed" for that id_trip
    And the completion event is recorded in the system

  Scenario: Cannot end a trip that has not been started
    Given the trip has status = "scheduled" in TROLLEY_TRIP
    When the driver attempts to press "End Trip"
    Then the system displays a message indicating the trip must be
         started before it can be ended
    And the status field in TROLLEY_TRIP is not modified

  Scenario: Invalid status transition on a completed trip
    Given the trip already has status = "completed" in TROLLEY_TRIP
    When the driver attempts to change the status to any other value
    Then the system displays an error message indicating the trip has
         already been completed and cannot be modified
```

---

## EP-09 · System Administration
> **Role:** Administrator  
> **Tables involved:** `FLIGHT`, `TROLLEY_TRIP`, `ROUTE`, `TROLLEY_ROUTE_SCHEDULE`, `SCHEDULE_DAY`, `EMPLOYEE`, `PERSON`, `OCCUPATION`, `FLIGHT_BOOKING`, `TROLLEY_BOOKING`, `PAYMENT`, `AIRPORT`, `AIRPLANE`

---

### US-19 — Manage Flights (CRUD)

**As an** administrator,
**I want to** create, view, edit, and delete flights in the system,
**so that** the flight catalog available to users is always up to date.

**Priority:** High | **Story Points:** 5

#### Acceptance Criteria

```gherkin
Feature: Flight Management

  Scenario: Create a new flight
    Given the administrator accesses the flight management module
    When they complete the form with: flight_number, flight_name,
         origin_airport_id (from AIRPORT), dest_airport_id (from AIRPORT),
         origin_city, destination_city, id_airplane (from AIRPLANE),
         flight_date, departure_time, arrival_time, and base_price
    And confirm the registration
    Then the system inserts a new record in the FLIGHT table
         with status = "scheduled"
    And the flight becomes available for user searches

  Scenario: Flight on a past date or time is rejected
    Given the administrator attempts to create a flight
    When they enter a flight_date or departure_time earlier than
         the current server date and time
    Then the system displays an error message indicating that flights
         cannot be registered on past dates or times
    And no record is inserted into the FLIGHT table

  Scenario: Edit an existing flight
    Given the administrator selects a flight with status = "scheduled"
         from the FLIGHT table
    When they modify one or more allowed fields and save the changes
    Then the system executes an UPDATE on FLIGHT for that id_flight
    And the changes are immediately reflected in user search results

  Scenario: Delete a flight with no active reservations
    Given the administrator selects a flight in FLIGHT
    When no records exist in FLIGHT_BOOKING with status = "pending"
         or status = "confirmed" for that id_flight
    And they confirm the deletion
    Then the system removes the record from the FLIGHT table
    And the flight no longer appears in search results

  Scenario: Delete attempt on a flight with active reservations
    Given the flight has at least one record in FLIGHT_BOOKING with
         status = "pending" or status = "confirmed"
    When the administrator attempts to delete the flight
    Then the system displays an error message indicating the flight
         cannot be deleted while active reservations exist
    And no record is removed from the FLIGHT table
```

---

### US-20 — Manage Trolleybus Routes and Trips (CRUD)

**As an** administrator,
**I want to** create, view, edit, and delete trolleybus routes, schedules, and trips,
**so that** the trolleybus service catalog available to users is always up to date.

**Priority:** High | **Story Points:** 5

#### Acceptance Criteria

```gherkin
Feature: Trolleybus Route and Trip Management

  Scenario: Create a new route with stops
    Given the administrator accesses the trolleybus route management module
    When they enter the route name (route_name in ROUTE) and add the
         corresponding stops defining their stop_order in ROUTE_STOP
         linked to records in BUS_STATION
    And confirm the registration
    Then the system inserts the records into ROUTE and ROUTE_STOP
    And the route becomes available for schedule and trip assignment

  Scenario: Create a recurring schedule for a route
    Given the administrator selects an existing route in ROUTE
    When they define departure_time and arrival_time in
         TROLLEY_ROUTE_SCHEDULE and the operating days in SCHEDULE_DAY
    And confirm the registration
    Then the system inserts records into TROLLEY_ROUTE_SCHEDULE
         and SCHEDULE_DAY
    And the schedule is available for generating concrete trips in TROLLEY_TRIP

  Scenario: Create a concrete trip for a specific date
    Given the administrator selects an existing route schedule
    When they assign a trolleybus (id_trolley from TROLLEY), define trip_date,
         origin_station_id, dest_station_id, and base_price
    And confirm the registration
    Then the system inserts a new record in TROLLEY_TRIP
         with status = "scheduled"
    And the trip becomes visible to users in the trolleybus section

  Scenario: Trip on a past date is rejected
    Given the administrator attempts to create a trip in TROLLEY_TRIP
    When they enter a trip_date earlier than the current server date
    Then the system displays an error message indicating that trips
         cannot be registered on past dates
    And no record is inserted into the TROLLEY_TRIP table

  Scenario: Delete a route with no active trips or reservations
    Given the route has no TROLLEY_TRIP records with status = "scheduled"
         or status = "in_progress"
    When the administrator confirms the deletion of the route
    Then the system removes the associated records from ROUTE, ROUTE_STOP,
         TROLLEY_ROUTE_SCHEDULE, and SCHEDULE_DAY
    And the route no longer appears in the user catalog

  Scenario: Delete attempt on a route with active trips or reservations
    Given the route has at least one TROLLEY_TRIP with status = "scheduled"
         or status = "in_progress" with TROLLEY_BOOKING records with
         status = "pending" or status = "confirmed"
    When the administrator attempts to delete the route
    Then the system displays an error message indicating the route
         cannot be deleted while active trips or reservations exist
    And no records are removed from any related table
```

---

### US-21 — Manage Agency Staff

**As an** administrator,
**I want to** register, view, edit, and deactivate agency staff members,
**so that** the employee directory is kept current and staff can be assigned to flights and routes.

**Priority:** High | **Story Points:** 5

> **Available roles (OCCUPATION table):** Pilot, Co-pilot, Flight Attendant, Driver

#### Acceptance Criteria

```gherkin
Feature: Agency Staff Management

  Scenario: Register a new employee
    Given the administrator accesses the staff management module
    When they enter the employee's personal data: name, last_names, curp,
         birth_date, and email into the PERSON table; rfc and id_occupation
         (FK → OCCUPATION) into the EMPLOYEE table; and login credentials
         (user_name and password) into the USER table
    And confirm the registration
    Then the system inserts records into PERSON, EMPLOYEE, and USER,
         and creates the account via Supabase Auth with the assigned role
    And the employee can log into the system using their credentials

  Scenario: Registration rejected due to duplicate CURP
    Given the administrator attempts to register a new employee
    When they enter a curp that already exists in the PERSON table
    Then the system displays an error message indicating a record with
         that CURP already exists
    And no records are inserted into PERSON, EMPLOYEE, or USER

  Scenario: Registration rejected due to duplicate username
    Given the administrator attempts to register a new employee
    When they enter a user_name that already exists in the USER table
    Then the system displays an error message indicating the username
         is already in use
    And no record is created in USER or via Supabase Auth

  Scenario: Edit an existing employee's information
    Given the administrator selects an employee from the directory
    When they modify one or more allowed fields and save the changes
    Then the system executes an UPDATE on the PERSON and/or EMPLOYEE tables
         for the affected fields
    And the changes are immediately reflected in the staff directory

  Scenario: Deactivate an employee
    Given the administrator selects an active employee
    When they confirm the deactivation
    Then the system deactivates the employee's account via Supabase Auth
    And the employee can no longer log into the system
    And their name no longer appears in flight or trolleybus route
         assignment options
```

---

### US-22 — View Reservation and Payment Reports

**As an** administrator,
**I want to** view a consolidated report of all system reservations and payments, with filters by date range, service type, and status,
**so that** I can make informed operational decisions and track the agency's financial performance.

**Priority:** Medium | **Story Points:** 3

#### Acceptance Criteria

```gherkin
Feature: Reservation and Payment Report Viewing

  Scenario: View the general reservation summary
    Given the administrator accesses the reports module
    When the page loads
    Then the system queries FLIGHT_BOOKING and TROLLEY_BOOKING and displays
         a count of reservations by status: pending, confirmed, expired,
         and cancelled

  Scenario: View completed payment totals
    Given the administrator accesses the reports module
    When the page loads
    Then the system queries PAYMENT filtered by payment_status = "completed"
    And displays the total revenue collected (sum of the amount field)
         denominated in Mexican Pesos (MXN)

  Scenario: Filter report by date range
    Given the administrator is in the reports module
    When they select a start date and an end date and apply the filter
    Then the system filters FLIGHT_BOOKING and TROLLEY_BOOKING by booking_date
         within the specified range
    And displays only the reservations and payment totals for that period

  Scenario: Filter report by service type
    Given the administrator applies a service type filter
    When they select "Flight"
    Then the system displays only FLIGHT_BOOKING records and the PAYMENT
         records where id_flight_booking is not null
    When they select "Trolleybus"
    Then the system displays only TROLLEY_BOOKING records and the PAYMENT
         records where id_trolley_booking is not null
```

---

### US-23 — Cancel or Modify a Reservation

**As an** administrator,
**I want to** cancel or manually modify any reservation in the system,
**so that** I can handle special cases, errors, or direct requests from users.

**Priority:** High | **Story Points:** 3

#### Acceptance Criteria

```gherkin
Feature: Reservation Cancellation and Modification

  Scenario: Cancel a confirmed flight reservation
    Given the administrator locates a record in FLIGHT_BOOKING
         with status = "confirmed"
    When they select the "Cancel Reservation" option and confirm the action
    Then the system executes an UPDATE on FLIGHT_BOOKING setting
         status = "cancelled" for that id_booking
    And executes an UPDATE on BOOKING_SEAT setting status = "cancelled"
         for all seats linked to that id_booking
    And those seats become available again for other users

  Scenario: Cancel a confirmed trolleybus reservation
    Given the administrator locates a record in TROLLEY_BOOKING
         with status = "confirmed"
    When they select the "Cancel Reservation" option and confirm the action
    Then the system executes an UPDATE on TROLLEY_BOOKING setting
         status = "cancelled" for that id_booking
    And the reserved slot is restored to available inventory in TROLLEY_TRIP

  Scenario: Cancellation attempt on an already cancelled reservation
    Given a record in FLIGHT_BOOKING or TROLLEY_BOOKING already has
         status = "cancelled"
    When the administrator attempts to cancel it again
    Then the system displays a message indicating the reservation was
         already cancelled previously
    And no additional UPDATE is executed on the database

  Scenario: Manually confirm a pending reservation
    Given the administrator locates a reservation with status = "pending"
         in FLIGHT_BOOKING or TROLLEY_BOOKING
    When they select the "Manually Confirm Reservation" option and confirm
    Then the system executes an UPDATE setting status = "confirmed"
         for that record
    And cascades the status update to the related BOOKING_SEAT records
         setting them to "confirmed" if the reservation is a flight booking
```

---

## Story Points Summary

| Epic | Stories | Total Points |
|---|---|---|
| EP-01 · User Authentication | US-01, US-02, US-03 | 8 |
| EP-02 · Flight Reservation | US-04, US-05, US-06 | 13 |
| EP-03 · Tourist Trolleybus Reservation | US-07, US-08 | 8 |
| EP-04 · Payment Processing | US-09 | 5 |
| EP-05 · PDF Ticket Generation | US-10, US-11 | 8 |
| EP-06 · Assigned Flight Management | US-12, US-13, US-14 | 9 |
| EP-07 · In-Flight Service Management | US-15, US-16 | 6 |
| EP-08 · Trolleybus Route Management | US-17, US-18 | 5 |
| EP-09 · System Administration | US-19, US-20, US-21, US-22, US-23 | 21 |
| **Grand Total** | **23 stories** | **83 pts** |

---
