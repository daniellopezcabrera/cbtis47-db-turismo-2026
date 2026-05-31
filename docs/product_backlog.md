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

  Scenario: Reservation creation fails due to a database error
  Given the user has selected a seat and confirms the reservation
  When an error occurs during the insert into FLIGHT_BOOKING or BOOKING_SEAT
  Then the system rolls back any partial inserts
  And displays a generic error message inviting the user to try again
  And no incomplete record remains in either table

  Scenario: User is warned before reservation expires
  Given the user has a pending reservation with the 10-minute timer active
  When 2 minutes or less remain on the countdown
  Then the system displays a prominent warning indicating
       the reservation is about to expire
  And encourages the user to complete the payment immediately
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

  Scenario: User views the details of a specific route
  Given the user is viewing the list of available routes
  When the user clicks on a route
  Then the system displays the full route details including
       all stops in order (from ROUTE_STOP joined with BUS_STATION),
       estimated duration, and price
  And a "Reserve" button is visible to proceed with the reservation

  Scenario: Route with missing stop data is handled gracefully
  Given the ROUTE table has a record with no associated ROUTE_STOP entries
  When the system attempts to display that route's departure location
  Then the route is either excluded from the list
       or displayed with a placeholder indicating information is unavailable
  And no unhandled error is shown to the user

  Scenario: User filters routes by departure station
  Given the user is on the trolleybus section with multiple routes displayed
  When the user selects a departure station from a filter
  Then the system displays only routes whose first ROUTE_STOP
       matches the selected station
  And routes that do not match are hidden from the list
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

  Scenario: Reservation fails when boarding stop is not selected
  Given the user has selected a route and a trip date
  When the user attempts to confirm the reservation without selecting a boarding stop
  Then the system displays a validation message indicating
       a boarding stop must be selected
  And does not insert any record in TROLLEY_BOOKING

  Scenario: Duplicate reservation attempt on the same trip
  Given the user already has a TROLLEY_BOOKING with status = "pending"
       or status = "confirmed" for the same id_trip
  When the user attempts to create another reservation for that trip
  Then the system displays a message indicating an active reservation
       already exists for that trip
  And does not insert a new record in TROLLEY_BOOKING

  Scenario: Reservation fails when boarding stop is not part of the selected route
  Given the user has selected a route and a trip date
  When the user attempts to confirm a reservation with a boarding_stop_id
       that is not associated with the selected route in ROUTE_STOP
  Then the system displays a validation error indicating
       the selected stop is not valid for this route
  And does not insert any record in TROLLEY_BOOKING

  Scenario: User is warned before reservation expires
  Given the user has a pending reservation with the 10-minute timer active
  When 2 minutes or less remain on the countdown
  Then the system displays a prominent warning indicating
       the reservation is about to expire
  And encourages the user to complete the payment immediately
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

  Scenario: Payment fails when no payment method is selected
  Given the user is on the payment screen with an active reservation
  When the user attempts to submit payment without selecting a payment method
  Then the system displays a validation message indicating
       a payment method must be selected
  And does not insert any record in PAYMENT
  And the countdown timer continues running

  Scenario: Successful cash payment with change calculation
  Given the user selects "cash" as the payment method
  When the user enters an amount_received greater than or equal to the total
  Then the system calculates and displays the change_given
       (amount_received - total amount)
  And inserts a record in PAYMENT with payment_method = "cash",
       amount_received, and change_given stored
  And updates the reservation status to "confirmed"

  Scenario: Cash payment fails when amount received is less than total
  Given the user selects "cash" as the payment method
  When the user enters an amount_received less than the total reservation amount
  Then the system displays a message indicating the amount is insufficient
  And does not insert any record in PAYMENT
  And the countdown timer continues running

  Scenario: User retries payment after a failed attempt
  Given the user has a pending reservation and a previous PAYMENT record
       with payment_status = "failed"
  When the user submits payment again before the timer expires
  And the payment simulation returns success
  Then the system inserts a new PAYMENT record with payment_status = "completed"
  And updates the reservation status to "confirmed"
  And redirects the user to the ticket screen
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

  Scenario: Adding the same reservation twice is prevented
  Given the user has already added a confirmed reservation to the ticket
  When the user attempts to add the same reservation again
  Then the system displays a message indicating
       that reservation is already included in the ticket
  And does not add a duplicate entry to the ticket summary

  Scenario: User attempts to download a ticket with no reservations added
  Given the user is on the ticket screen with no reservations accumulated
  When the user clicks the "Download" button
  Then the system displays a message indicating
       at least one reservation must be added before downloading
  And does not trigger PDF generation

  Scenario: User removes a reservation from the ticket before downloading
  Given the user has added one or more reservations to the ticket
  When the user clicks the "Remove" button on a specific reservation
  Then that reservation is removed from the ticket summary
  And the remaining reservations stay in the list
  And if no reservations remain, the download button is disabled
       or hidden accordingly

  Scenario: User attempts to add more reservations than the allowed limit
  Given the user has already accumulated the maximum number of
       reservations allowed per ticket
  When the user attempts to add another reservation
  Then the system displays a message indicating the ticket limit has been reached
  And does not add the new reservation to the ticket summary
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

  Scenario: PDF generation fails due to a client-side error
  Given the user has reservations added and clicks "Download"
  When jsPDF encounters an error during file generation
  Then the system displays a message indicating the download failed
       and invites the user to try again
  And does not insert a record in TICKET or marks it as not downloaded
  And the "Download" button remains enabled for a retry

  Scenario: PDF content includes all required fields per reservation type
  Given the ticket contains both a flight reservation and a trolleybus reservation
  When the PDF is generated
  Then for the flight reservation the PDF includes:
       flight name, seat number, travel date, departure and arrival time,
       and passenger full name
  And for the trolleybus reservation the PDF includes:
       route name, boarding stop, trip date, and passenger full name

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

  Scenario: Pilot views full details of a specific assigned flight
  Given the pilot is viewing their flight list
  When they click on a specific flight
  Then the system displays the full flight details including:
       airplane registration and model (from AIRPLANE joined with AIRPLANE_MODEL),
       origin and destination airport names (from AIRPORT),
       co-pilot or pilot name (from PERSON),
       and total confirmed passengers for that flight

  Scenario: Regular user attempts to access the assigned flights section
  Given a logged-in user with role = "passenger"
  When they attempt to navigate to the "My Flights" section
  Then the system denies access
  And displays an unauthorized access message
  And redirects the user to their dashboard

  Scenario: Pilot filters flights by status
  Given the pilot is viewing their assigned flight list
  When they apply a filter for a specific status (e.g. "scheduled" or "departed")
  Then the system displays only the FLIGHT records matching that status
  And records with other statuses are hidden from the list
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

  Scenario: Manifest displays occupancy summary
  Given the pilot or co-pilot opens a flight detail view
  When the passenger manifest loads
  Then the system displays a summary showing:
       total confirmed passengers, total available seats
       (from AIRPLANE_MODEL capacity), and percentage of occupancy
  And this summary is visible above the passenger list

  Scenario: Pilot searches for a specific passenger in the manifest
  Given the pilot is viewing a manifest with multiple confirmed passengers
  When they enter a passenger name in the search field
  Then the system filters the displayed list to show only records
       where the full name from PERSON matches the search input
  And clears the filter when the search field is emptied

  Scenario: Pilot attempts to access the manifest of a flight not assigned to them
  Given a pilot is authenticated
  When they attempt to access the manifest of a flight
       that is not linked to their profile in the FLIGHT table
  Then the system denies access
  And displays a message indicating they are not assigned to that flight
  And redirects them to their assigned flight list
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

  Scenario: Pilot cancels a scheduled or departed flight
  Given the pilot accesses a flight with status = "scheduled" or "departed"
  When they select the option "Cancel flight" and confirm
  Then the system executes an UPDATE on FLIGHT setting status = "cancelled"
  And all FLIGHT_BOOKING records linked to that id_flight
       are updated to status = "cancelled"
  And the affected passengers are notified of the cancellation

  Scenario: Pilot attempts to change the status of a cancelled flight
  Given the pilot accesses a flight with status = "cancelled"
  When they attempt to update the status to any other value
  Then the system displays a message indicating that a cancelled flight
       cannot be modified
  And no UPDATE is executed on the FLIGHT table

  Scenario: System requires confirmation before applying a status change
  Given the pilot selects a new status for an assigned flight
  When they click the update button
  Then the system displays a confirmation dialog describing
       the transition that is about to be applied (e.g. "scheduled → departed")
  And only executes the UPDATE on FLIGHT after the pilot confirms
  And cancels the operation without changes if the pilot dismisses the dialog

  Scenario: Non-pilot user attempts to update a flight status
  Given a logged-in user with role = "passenger"
  When they attempt to access the flight status update control
  Then the system denies the action
  And displays an unauthorized access message
  And no UPDATE is executed on the FLIGHT table
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

  Scenario: Flight attendant searches for a passenger by name or seat number
  Given the flight attendant is viewing the passenger list
  When they enter a name or seat number in the search field
  Then the system filters the list to show only matching records
  And clears the filter when the search field is emptied

  Scenario: Flight attendant views the seat map with confirmed occupancy
  Given the flight attendant is viewing their assigned flight
  When they switch to the seat map view
  Then the system displays the airplane seat map
       generated from AIRPLANE_MODEL capacity
  And seats with a confirmed BOOKING_SEAT record are shown as occupied
  And empty seats are shown as available
  And the view is read-only with no selection interaction

  Scenario: Flight attendant prints or exports the passenger list
  Given the flight attendant is viewing the full confirmed passenger list
  When they click the "Print" or "Export" button
  Then the system generates a printable or downloadable version
       of the list including full name and seat number for each passenger
  And the exported list reflects only confirmed reservations
       at the moment of export

  Scenario: Flight details are displayed alongside the passenger list
  Given the flight attendant opens the passengers section
  When the list loads
  Then the system also displays the flight summary including:
       flight_number, origin_city, destination_city,
       flight_date, departure_time, and current status
  And this information is shown in read-only mode
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

  Scenario: Flight attendant views previously recorded incidents for the flight
  Given the flight attendant is in the incident module for their active flight
  When the module loads
  Then the system displays a list of all existing INCIDENT records
       linked to that id_flight, showing incident_type, description,
       and recorded_at for each
  And the list is sorted in descending order by recorded_at

  Scenario: Incident type is selected from a predefined list
  Given the flight attendant is filling out the incident form
  When they interact with the incident_type field
  Then the system displays a predefined list of incident types
       (e.g. "medical issue", "disruptive passenger", "cabin damage", "other")
  And free-text entry is not permitted for the incident_type field

  Scenario: Multiple incidents can be recorded for the same flight
  Given the flight attendant has already registered one incident for the flight
  When a new incident occurs and they submit a second report
  Then the system inserts a new independent record in INCIDENT
       with the same id_flight but a new id_incident and recorded_at
  And both records are visible in the incident list for that flight

  Scenario: Flight attendant cannot record incidents on unassigned flights
  Given the flight attendant attempts to access the incident module
       for a flight not linked to their id_person in EMPLOYEE
  When they navigate to that flight's incident form
  Then the system denies access
  And displays an unauthorized access message
  And no record is inserted in INCIDENT
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

  Scenario: Passenger list is sorted by boarding stop order
  Given the driver opens the passenger list for a specific trip
  When the list loads
  Then the system displays passengers grouped or sorted
       by the stop_order of their boarding_stop_id in ROUTE_STOP
  And passengers boarding at earlier stops appear first in the list

  Scenario: Trip detail displays occupancy summary
  Given the driver opens a specific trip detail
  When the detail view loads
  Then the system displays the total number of confirmed passengers
       and the total capacity of the assigned trolleybus (from TROLLEY)
  And shows the number of available spots remaining

  Scenario: Driver cannot access trips not assigned to their trolleybus
  Given the driver is authenticated
  When they attempt to access the detail of a trip whose id_trolley
       does not match the trolleybus assigned to that driver
  Then the system denies access
  And displays an unauthorized access message
  And redirects the driver to their daily trip list

  Scenario: Driver consults trips assigned for a different date
  Given the driver is on the "My Trips Today" section
  When they select a different date using a date picker
  Then the system queries TROLLEY_TRIP filtered by the driver's id_trolley
       and the selected trip_date
  And displays the trips for that date or a message if none exist
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

  Scenario: Driver cancels a scheduled or in-progress trip
  Given the driver has a trip with status = "scheduled" or "in_progress"
  When they press the "Cancel Trip" button and confirm
  Then the system executes an UPDATE on TROLLEY_TRIP
       setting status = "cancelled" for that id_trip
  And all TROLLEY_BOOKING records linked to that id_trip
       are updated to status = "cancelled"
  And the affected passengers are notified of the cancellation

  Scenario: Driver attempts to modify the status of a cancelled trip
  Given the trip has status = "cancelled" in TROLLEY_TRIP
  When the driver attempts to change the status to any other value
  Then the system displays a message indicating a cancelled trip
       cannot be modified
  And no UPDATE is executed on TROLLEY_TRIP

  Scenario: System requires confirmation before applying a status change
  Given the driver selects a new status for their current trip
  When they press the corresponding action button
  Then the system displays a confirmation dialog describing
       the transition about to be applied (e.g. "scheduled → in_progress")
  And only executes the UPDATE on TROLLEY_TRIP after the driver confirms
  And cancels the operation without changes if the driver dismisses the dialog

  Scenario: Driver attempts to update the status of an unassigned trip
  Given the driver is authenticated
  When they attempt to change the status of a trip whose id_trolley
       does not match their assigned trolleybus
  Then the system denies the action
  And displays an unauthorized access message
  And no UPDATE is executed on TROLLEY_TRIP
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

  Scenario: Flight creation fails when origin and destination airports are the same
  Given the administrator is filling out the new flight form
  When they select the same airport for both origin_airport_id
       and dest_airport_id
  And attempt to confirm the registration
  Then the system displays a validation message indicating
       origin and destination cannot be the same
  And no record is inserted into the FLIGHT table

  Scenario: Flight creation fails with a duplicate flight number
  Given the administrator completes the new flight form
  When they enter a flight_number that already exists in the FLIGHT table
  And confirm the registration
  Then the system displays an error indicating the flight number is already in use
  And no new record is inserted into the FLIGHT table

  Scenario: Administrator cannot edit a flight with status other than "scheduled"
  Given the administrator selects a flight with status = "departed"
       or status = "cancelled"
  When they attempt to modify any field
  Then the system displays the flight information in read-only mode
  And displays a message indicating only scheduled flights can be edited
  And no UPDATE is executed on the FLIGHT table

  Scenario: Administrator views and filters the flight list
  Given the administrator is on the flight management module
  When the page loads
  Then the system displays all records from the FLIGHT table
       with flight_number, route, flight_date, status, and assigned airplane
  And the administrator can filter by status, date range, or route
  And can select any flight to view, edit, or delete it

  Scenario: Flight creation fails when the selected airplane is already assigned
  Given the administrator is creating a new flight
  When they select an id_airplane that is already assigned to another flight
       on the same flight_date and with overlapping departure and arrival times
  Then the system displays a message indicating the airplane
       is not available for the selected date and time
  And no record is inserted into the FLIGHT table
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

  Scenario: Route creation fails with a duplicate route name
  Given the administrator is filling out the new route form
  When they enter a route_name that already exists in the ROUTE table
  And confirm the registration
  Then the system displays an error indicating the route name is already in use
  And no record is inserted into ROUTE or ROUTE_STOP

  Scenario: Route creation fails when no stops are defined
  Given the administrator is filling out the new route form
  When they enter a route_name but do not add any stops in ROUTE_STOP
  And attempt to confirm the registration
  Then the system displays a validation message indicating
       at least two stops must be defined for a route
  And no record is inserted into ROUTE or ROUTE_STOP

  Scenario: Administrator cannot edit a route that has active trips
  Given the route has at least one TROLLEY_TRIP with status = "scheduled"
       or status = "in_progress"
  When the administrator attempts to modify the route name or its stops
  Then the system displays a message indicating the route cannot be edited
       while active trips exist
  And no UPDATE is executed on ROUTE or ROUTE_STOP

  Scenario: Trip creation fails when the trolleybus is already assigned on that date
  Given the administrator is creating a new trip
  When they select an id_trolley that is already assigned to another trip
       on the same trip_date with overlapping departure and arrival times
  Then the system displays a message indicating the trolleybus
       is not available for the selected date and time
  And no record is inserted into TROLLEY_TRIP

  Scenario: Trip creation fails when the selected date does not match the schedule days
  Given the administrator selects a route schedule with defined operating days
       in SCHEDULE_DAY
  When they set a trip_date whose day of the week is not included
       in the schedule's SCHEDULE_DAY records
  Then the system displays a warning indicating the selected date
       does not correspond to an operating day for that schedule
  And requests confirmation or blocks the creation depending on business rules

  Scenario: Administrator deletes a specific trip with no active reservations
  Given the administrator selects a TROLLEY_TRIP with status = "scheduled"
       and no TROLLEY_BOOKING records with status = "pending" or "confirmed"
  When they confirm the deletion of that trip
  Then the system removes only that record from TROLLEY_TRIP
  And the parent ROUTE and TROLLEY_ROUTE_SCHEDULE remain unaffected
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

  Scenario: Registration rejected due to duplicate RFC
  Given the administrator attempts to register a new employee
  When they enter an rfc that already exists in the EMPLOYEE table
  Then the system displays an error message indicating a record with
       that RFC already exists
  And no records are inserted into PERSON, EMPLOYEE, or USER

  Scenario: Registration rejected due to invalid field formats
  Given the administrator is filling out the new employee form
  When they enter a curp that does not match the official 18-character format
  Or they enter an rfc that does not match the official format
  And attempt to confirm the registration
  Then the system displays a format validation message for each invalid field
  And no records are inserted into PERSON, EMPLOYEE, or USER

  Scenario: Deactivation warning when employee has active assignments
  Given the administrator attempts to deactivate an employee
  When that employee is assigned to one or more FLIGHT records
       with status = "scheduled" or TROLLEY_TRIP records
       with status = "scheduled" or "in_progress"
  Then the system displays a warning indicating the employee
       has active assignments that must be reassigned before deactivation
  And requires explicit confirmation before proceeding
  And the deactivation does not execute until confirmed

  Scenario: Administrator reactivates a previously deactivated employee
  Given the administrator views the staff directory filtered to show
       inactive employees
  When they select a deactivated employee and confirm reactivation
  Then the system reactivates the account via Supabase Auth
  And the employee can log into the system again
  And their name reappears in assignment options for flights and routes

  Scenario: Administrator filters the staff directory by occupation
  Given the administrator is on the staff management module
  When they select a role filter (e.g. "Pilot", "Driver", "Flight Attendant")
  Then the system displays only EMPLOYEE records whose id_occupation
       matches the selected role
  And the count of results updates accordingly
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

  Scenario: Filter report by reservation status
  Given the administrator is in the reports module
  When they select a specific status filter (e.g. "confirmed", "cancelled")
  Then the system filters FLIGHT_BOOKING and TROLLEY_BOOKING
       by the selected status
  And updates the displayed counts and payment totals accordingly

  Scenario: Report returns no results for the selected filters
  Given the administrator applies a date range or status filter
  When no records in FLIGHT_BOOKING, TROLLEY_BOOKING, or PAYMENT
       match the selected criteria
  Then the system displays a message indicating no data was found
       for the selected filters
  And shows zero values for all counts and totals
  And does not display an error or blank screen

  Scenario: Report displays revenue breakdown by payment method
  Given the administrator is viewing the payment totals section
  When the report loads or a filter is applied
  Then the system queries PAYMENT grouped by payment_method
  And displays the total amount collected separately for:
       cash, card, and bank transfer
  And shows the overall total as the sum of all methods

  Scenario: Administrator exports the current report
  Given the administrator is viewing a report with or without filters applied
  When they click the "Export" button
  Then the system generates a downloadable file (CSV or PDF)
       reflecting the currently displayed data and active filters
  And the file includes all visible columns: reservation counts,
       payment totals, and applied filter parameters

  Scenario: Report highlights cancellation and expiration rates
  Given the administrator is viewing the general reservation summary
  When the counts by status are displayed
  Then the system also calculates and displays the percentage of
       expired and cancelled reservations over total reservations
  And this metric is shown separately for flights and trolleybus services
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

  Scenario: Cancel a pending reservation
  Given the administrator locates a record in FLIGHT_BOOKING
       or TROLLEY_BOOKING with status = "pending"
  When they select the "Cancel Reservation" option and confirm
  Then the system executes an UPDATE setting status = "cancelled"
  And for flight bookings, updates the related BOOKING_SEAT
       records to status = "cancelled"
  And the seat or slot is restored to available inventory

  Scenario: Manual confirmation warns when no completed payment exists
  Given the administrator attempts to manually confirm a pending reservation
  When no PAYMENT record with payment_status = "completed" exists
       linked to that id_booking
  Then the system displays a warning indicating there is no completed
       payment associated with this reservation
  And requires explicit confirmation before proceeding with the status update
  And records the manual override in the system

  Scenario: Administrator changes the boarding stop of a trolleybus reservation
  Given the administrator selects a TROLLEY_BOOKING record
       with status = "confirmed" or "pending"
  When they select a new boarding_stop_id that belongs to the
       route associated with that id_trip in ROUTE_STOP
  And confirm the change
  Then the system executes an UPDATE on TROLLEY_BOOKING
       setting the new boarding_stop_id
  And displays a confirmation message reflecting the updated stop

  Scenario: Administrator searches for a reservation by passenger or booking ID
  Given the administrator is in the reservation management module
  When they enter a passenger name, email, or id_booking in the search field
  Then the system queries FLIGHT_BOOKING and TROLLEY_BOOKING joined with PERSON
       and displays all matching records with their current status,
       service type, and booking date
  And the administrator can select any result to cancel or modify it

  Scenario: Every cancellation or modification is logged for audit purposes
  Given the administrator executes any cancellation or manual modification
  When the UPDATE is applied successfully
  Then the system records the action including: the id_booking affected,
       the previous status, the new status, the administrator's id_person,
       and the timestamp of the action
  And this log is accessible in the reports module
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
