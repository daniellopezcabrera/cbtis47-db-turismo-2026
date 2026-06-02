# Database Schema Documentation (Final Version - Improved Descriptions)

This document describes the relational database structure with integrity constraints applied.

---

## PERSON

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Person | id_person | INT (PK, AUTO_INCREMENT) | Unique identifier assigned to each individual registered in the system. |
| Person | name | VARCHAR(100) NOT NULL | Given name(s) of the person as they appear in official identification. |
| Person | last_names | VARCHAR(100) NOT NULL | Family names (paternal and maternal surnames). |
| Person | curp | VARCHAR(18) UNIQUE NOT NULL | Mexican CURP, used as a unique national identity code. |
| Person | birth_date | DATE NOT NULL | Date of birth used for age validation and identification. |
| Person | email | VARCHAR(100) UNIQUE NOT NULL | Personal email address used for communication and account recovery. |

---

## USER

| Table | Column | Type | Description |
|-------|--------|------|------------|
| User | id_person | INT (PK, FK) | Links the user account to a specific person (1:1 relationship). |
| User | user_name | VARCHAR(16) NOT NULL | Unique username used to log into the system. |
| User | password | VARCHAR(15) NOT NULL | Securely hashed password (e.g., bcrypt or argon2). |

---

## EMPLOYEE

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Employee | id_person | INT (PK, FK) | Identifies the person who is also an employee in the organization. |
| Employee | rfc | VARCHAR(13) UNIQUE NOT NULL | Mexican tax identification number required for payroll and legal purposes. |
| Employee | id_occupation | INT (FK) NOT NULL | References the employee's role or job position within the company. |

---

## OCCUPATION

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Occupation | id_occupation | INT (PK, AUTO_INCREMENT) | Unique identifier for each type of job or role. |
| Occupation | name | VARCHAR(100) NOT NULL | Name of the occupation (e.g., Pilot, Driver, Administrator). |

---

## AIRPORT

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Airport | id_airport | INT (PK, AUTO_INCREMENT) | Unique identifier assigned to each airport. |
| Airport | city_name | VARCHAR(50) NOT NULL | City where the airport is located. |
| Airport | airport_name | VARCHAR(100) NOT NULL | Official name of the airport, including terminal if needed. |
| Airport | airport_code | VARCHAR(4) UNIQUE NOT NULL | Standard airport code (IATA or ICAO) used globally. |

---

## AIRPLANE_MODEL

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Airplane_model | id_airplane_model | INT (PK, AUTO_INCREMENT) | Unique identifier for each airplane model. |
| Airplane_model | capacity | INT NOT NULL | Maximum number of passengers the aircraft can carry. |
| Airplane_model | model_name | VARCHAR(50) NOT NULL | Manufacturer and model name (e.g., Boeing 737-800). |

---

## AIRPLANE

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Airplane | id_airplane | INT (PK, AUTO_INCREMENT) | Unique identifier assigned to each aircraft. |
| Airplane | registration_number | VARCHAR(20) UNIQUE NOT NULL | Official aircraft registration number. |
| Airplane | id_airplane_model | INT (FK) NOT NULL | Indicates the model specifications of the aircraft. |
| Airplane | status | ENUM | Operational status (active, maintenance, or retired). |

---

## FLIGHT

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Flight | id_flight | INT (PK, AUTO_INCREMENT) | Unique identifier assigned to each flight instance. |
| Flight | flight_number | VARCHAR(5) NOT NULL | Standard airline flight code (e.g., AM123). |
| Flight | flight_name | VARCHAR(100) NOT NULL | Descriptive name of the flight route or service. |
| Flight | origin_airport_id | INT (FK) NOT NULL | Airport where the flight departs from. |
| Flight | dest_airport_id | INT (FK) NOT NULL | Airport where the flight arrives. |
| Flight | origin_city | VARCHAR(50) NOT NULL | City of departure stored for quick querying. |
| Flight | destination_city | VARCHAR(50) NOT NULL | City of arrival stored for quick querying. |
| Flight | id_airplane | INT (FK) NOT NULL | Aircraft assigned to operate the flight. |
| Flight | flight_date | DATE NOT NULL | Date on which the flight is scheduled. |
| Flight | departure_time | TIME NOT NULL | Scheduled departure time. |
| Flight | arrival_time | TIME NOT NULL | Scheduled arrival time. |
| Flight | base_price | DECIMAL(10,2) NOT NULL | Base ticket price per passenger. |
| Flight | status | ENUM | Current state of the flight (scheduled, boarding, etc.). |

---

## FLIGHT_INCIDENT

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Flight_incident | id_incident | INT (PK) | Unique identifier assigned to each incident report related to a flight. |
| Flight_incident | id_flight | INT (FK) NOT NULL | Flight where the incident occurred or was detected. |
| Flight_incident | id_employee | INT (FK) NOT NULL | Employee responsible for reporting or registering the incident. |
| Flight_incident | incident_type | ENUM | Category of the incident (technical, operational, medical, weather, etc.). |
| Flight_incident | severity | ENUM | Severity level of the incident (low, medium, high, critical). |
| Flight_incident | description | TEXT | Detailed explanation of the incident and the events that occurred. |
| Flight_incident | status | ENUM | Current status of the incident (open, investigating, resolved, closed). |
| Flight_incident | resolution_notes | TEXT | Notes describing how the incident was resolved or handled. |
| Flight_incident | recorded_at | DATETIME | Date and time when the incident was officially recorded. |
| Flight_incident | resolved_at | DATETIME | Date and time when the incident was resolved or closed. |

---

## FLIGHT_BOOKING

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Flight_booking | id_booking | INT (PK, AUTO_INCREMENT) | Unique identifier for each flight reservation. |
| Flight_booking | id_user | INT (FK) NOT NULL | User who made the reservation. |
| Flight_booking | id_flight | INT (FK) NOT NULL | Flight being reserved. |
| Flight_booking | number_of_seats | INT NOT NULL | Number of seats requested in the booking. |
| Flight_booking | booking_date | DATETIME NOT NULL | Timestamp when the booking was created. |
| Flight_booking | status | ENUM | Reservation status (pending, confirmed, cancelled). |

---

## BOOKING_SEAT

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Booking_seat | id_booking_seat | INT (PK, AUTO_INCREMENT) | Unique identifier for each seat selection record. |
| Booking_seat | id_booking | INT (FK) NOT NULL | Associated booking that owns the seat selection. |
| Booking_seat | id_flight | INT (FK) NOT NULL | Flight where the seat belongs. |
| Booking_seat | seat_number | VARCHAR(5) NOT NULL | Seat identifier (e.g., 12A). |
| Booking_seat | selected_at | DATETIME NOT NULL | Timestamp when the seat was selected. |
| Booking_seat | expires_at | DATETIME NOT NULL | Time limit before the seat reservation expires. |
| Booking_seat | status | ENUM | Current state of the seat (selected, confirmed, etc.). |

---

## TICKET

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Ticket | id_ticket | INT (PK, AUTO_INCREMENT) | Unique identifier for each issued ticket. |
| Ticket | id_booking | INT (FK) NOT NULL | References the booking that generated the ticket. |
| Ticket | booking_date | DATETIME NOT NULL | Snapshot of the booking date at ticket creation. |
| Ticket | passenger_full_name | VARCHAR(200) NOT NULL | Full name of the passenger assigned to the ticket. |
| Ticket | ticket_price | DECIMAL(10,2) NOT NULL | Final price paid for the individual ticket. |

---

## TROLLEY_MODEL

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Trolley_model | id_model | INT (PK) | Unique identifier for each trolley model. |
| Trolley_model | capacity | SMALLINT NOT NULL | Maximum number of passengers allowed. |
| Trolley_model | model_name | VARCHAR(50) NOT NULL | Model name or type of the trolley unit. |

---

## TROLLEY

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Trolley | id_trolley | INT (PK) | Unique identifier for each trolley vehicle. |
| Trolley | plate_number | VARCHAR(12) UNIQUE NOT NULL | Official license plate number of the vehicle. |
| Trolley | id_model | INT (FK) NOT NULL | Model assigned to the trolley. |

---

## BUS_STATION

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Bus_station | id_station | INT (PK, AUTO_INCREMENT) | Unique identifier for each station. |
| Bus_station | city_name | VARCHAR(50) NOT NULL | City where the station is located. |
| Bus_station | station_name | VARCHAR(100) NOT NULL | Official name of the station or terminal. |
| Bus_station | station_code | VARCHAR(6) UNIQUE NOT NULL | Short code used to identify the station. |
| Bus_station | address | VARCHAR(200) | Physical address of the station. |
| Bus_station | coordinates | VARCHAR(100) | Geographic coordinates for mapping purposes. |

---

## ROUTE

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Route | id_route | INT (PK) | Unique identifier for each route. |
| Route | route_name | VARCHAR(30) UNIQUE NOT NULL | Descriptive name of the route (origin to destination). |

---

## ROUTE_STOP

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Route_stop | id_route_stop | INT (PK) | Unique identifier for each stop in a route. |
| Route_stop | id_route | INT (FK) NOT NULL | Route to which the stop belongs. |
| Route_stop | id_station | INT (FK) NOT NULL | Station associated with the stop. |
| Route_stop | stop_order | SMALLINT NOT NULL | Sequential position of the stop within the route. |

---

## TROLLEY_ROUTE_SCHEDULE

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Trolley_route_schedule | id_route_schedule | INT (PK) | Unique identifier for route schedule template. |
| Trolley_route_schedule | id_route | INT (FK) NOT NULL | Route associated with the schedule. |
| Trolley_route_schedule | departure_time | TIME NOT NULL | Scheduled departure time. |
| Trolley_route_schedule | arrival_time | TIME NOT NULL | Scheduled arrival time. |

---

## SCHEDULE_DAY

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Schedule_day | id_schedule_day | INT (PK) | Unique identifier. |
| Schedule_day | id_route_schedule | INT (FK) NOT NULL | Schedule to which the day applies. |
| Schedule_day | day_of_week | ENUM | Day on which the route operates. |

---

## TROLLEY_TRIP

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Trolley_trip | id_trip | INT (PK) | Unique identifier for each trip instance. |
| Trolley_trip | id_route_schedule | INT (FK) NOT NULL | Base schedule used to generate the trip. |
| Trolley_trip | id_trolley | INT (FK) NOT NULL | Assigned trolley unit. |
| Trolley_trip | origin_station_id | INT (FK) NOT NULL | Starting station of the trip. |
| Trolley_trip | dest_station_id | INT (FK) NOT NULL | Final station of the trip. |
| Trolley_trip | trip_date | DATE NOT NULL | Specific date when the trip occurs. |
| Trolley_trip | departure_time | TIME NOT NULL | Actual departure time. |
| Trolley_trip | arrival_time | TIME NOT NULL | Actual arrival time. |
| Trolley_trip | base_price | DECIMAL(10,2) NOT NULL | Price for the full trip route. |
| Trolley_trip | status | ENUM | Current trip status. |

---

## TROLLEY_BOOKING

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Trolley_booking | id_booking | INT (PK) | Unique identifier for each booking. |
| Trolley_booking | id_user | INT (FK) NOT NULL | User who made the booking. |
| Trolley_booking | id_trip | INT (FK) NOT NULL | Trip being reserved. |
| Trolley_booking | boarding_stop_id | INT (FK) NOT NULL | Stop where the passenger boards. |
| Trolley_booking | alighting_stop_id | INT (FK) NOT NULL | Stop where the passenger gets off. |
| Trolley_booking | number_of_seats | INT NOT NULL | Number of seats reserved. |
| Trolley_booking | booking_date | DATETIME NOT NULL | Timestamp of booking creation. |
| Trolley_booking | status | ENUM | Booking state. |

---

## PAYMENT

| Table | Column | Type | Description |
|-------|--------|------|------------|
| Payment | id_payment | INT (PK) | Unique identifier for each payment transaction. |
| Payment | id_user | INT (FK) NOT NULL | User who performed the payment. |
| Payment | booking_type | ENUM | Indicates the type of reservation associated with the payment (flight or trolley booking). |
| Payment | id_flight_booking | INT (FK) | Associated flight booking if applicable. |
| Payment | id_trolley_booking | INT (FK) | Associated trolley booking if applicable. |
| Payment | payment_method | ENUM | Method used (cash, card, transfer). |
| Payment | amount | DECIMAL(10,2) NOT NULL | Total amount to be paid. |
| Payment | amount_received | DECIMAL(10,2) | Amount received (mainly for cash payments). |
| Payment | change_given | DECIMAL(10,2) | Change returned to the customer. |
| Payment | payment_status | ENUM | Current status of the transaction. |
| Payment | payment_date | DATETIME NOT NULL | Date and time when payment was initiated. |
| Payment | completed_at | DATETIME | Timestamp when the payment was completed. |
| Payment | reference_number | VARCHAR(100) | External reference or transaction ID. |
| Payment | card_last_four | VARCHAR(4) | Last 4 digits of the card used. |
| Payment | notes | TEXT | Additional details or remarks about the transaction. |

---

# Integrity Rules Applied

- Primary and foreign key constraints ensure relational consistency  
- ENUM fields enforce controlled domain values  
- CHECK constraints validate logical conditions  
- Separation of booking types improves normalization  
- Payment system supports multiple transaction scenarios  
- Flight seat selection handled at row level for precision  
