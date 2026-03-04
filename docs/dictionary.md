| Table | Column | Type | Description |
|-------|--------|------|------------|
| Role | id_role | INT (PK) | Unique identifier of the role. |
| Role | role_name | VARCHAR(50) UNIQUE NOT NULL | Name of the role (administrator, customer, employee). |
| User | id_user | INT (PK) | Unique identifier of the user. |
| User | email | VARCHAR(100) UNIQUE NOT NULL | User email address (must be unique). |
| User | password | VARCHAR(255) NOT NULL | Encrypted (hashed) user password. |
| User | id_role | INT (FK) NOT NULL | Role assigned to the user (references Role.id_role). |
| Location | id_location | INT (PK) | Unique identifier of the location. |
| Location | location_name | VARCHAR(100) NOT NULL | Name of the city or airport. |
| Flight | id_flight | INT (PK) | Unique identifier of the flight. |
| Flight | origin_id | INT (FK) NOT NULL | Origin location (references Location.id_location). |
| Flight | dest_id | INT (FK) NOT NULL | Destination location (references Location.id_location). |
| Flight | price | DECIMAL(10,2) NOT NULL CHECK (price > 0) | Ticket price (must be positive). |
| Booking | id_booking | INT (PK) | Unique identifier of the booking. |
| Booking | id_user | INT (FK) NOT NULL | User who made the booking (references User.id_user). |
| Booking | id_flight | INT (FK) NOT NULL | Flight being booked (references Flight.id_flight). |
| Booking | date | DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP | Date and time of booking creation. |
| Booking | status | VARCHAR(20) NOT NULL CHECK (status IN ('confirmed','canceled','pending')) | Booking status. |
| Ticket | id_ticket | INT (PK) | Unique identifier of the ticket. |
| Ticket | id_booking | INT (FK) NOT NULL | Associated booking (references Booking.id_booking). |
| Ticket | qr_code | VARCHAR(255) UNIQUE NOT NULL | Unique QR code used for ticket validation. |
| Trolley_model | id_model | INT (PK) | Unique identifier of the trolley model. |
| Trolley_model | capacity | INT NOT NULL CHECK (capacity > 0) | Maximum passenger capacity. |
| Trolley_model | model_name | VARCHAR(100) NOT NULL | Model name or reference. |
| Trolley | id_trolley | INT (PK) | Unique identifier of the trolley. |
| Trolley | plate_number | VARCHAR(20) UNIQUE NOT NULL | Vehicle license plate number (must be unique). |
| Trolley | id_model | INT (FK) NOT NULL | Assigned model (references Trolley_model.id_model). |
| Route | id_route | INT (PK) | Unique identifier of the route. |
| Route | route_name | VARCHAR(100) UNIQUE NOT NULL | Route name or code. |
| Trolley_stop | id_stop | INT (PK) | Unique identifier of the stop. |
| Trolley_stop | name | VARCHAR(100) NOT NULL | Stop name. |
| Trolley_stop | coordinates | VARCHAR(100) NOT NULL | Geographic coordinates (latitude, longitude). |
| Route_stop | id_route | INT (PK, FK) | Route identifier (references Route.id_route). |
| Route_stop | id_stop | INT (PK, FK) | Stop identifier (references Trolley_stop.id_stop). |
| Route_stop | stop_order | INT NOT NULL CHECK (stop_order > 0) | Order of the stop within the route. |
| Trolley_schedule | id_schedule | INT (PK) | Unique identifier of the schedule. |
| Trolley_schedule | id_trolley | INT (FK) NOT NULL | Assigned trolley (references Trolley.id_trolley). |
| Trolley_schedule | id_route | INT (FK) NOT NULL | Assigned route (references Route.id_route). |
| Trolley_schedule | departure_time | DATETIME NOT NULL | Scheduled departure date and time. |
