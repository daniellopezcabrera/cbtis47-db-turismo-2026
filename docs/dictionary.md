# Data Dictionary

| Category           | Field             | Data Type        | Definition |
|--------------------|------------------|------------------|------------|
| Role               | id_role          | int (PK)         | Unique identifier of the role. |
| Role               | role_name        | string           | Name of the role (e.g., administrator, customer, employee). |
| User               | id_user          | int (PK)         | Unique identifier of the user. |
| User               | email            | string           | User's email address. |
| User               | password         | string           | Encrypted user password. |
| User               | id_role          | int (FK)         | Role assigned to the user (references Role). |
| Flight             | id_flight        | int (PK)         | Unique identifier of the flight. |
| Flight             | origin_id        | int (FK)         | Identifier of the flight's origin location. |
| Flight             | dest_id          | int (FK)         | Identifier of the flight's destination location. |
| Flight             | price            | float            | Flight ticket price. |
| Booking            | id_booking       | int (PK)         | Unique identifier of the booking. |
| Booking            | id_user          | int (FK)         | User who made the booking. |
| Booking            | date             | datetime         | Date and time when the booking was created. |
| Booking            | status           | string           | Booking status (e.g., confirmed, canceled, pending). |
| Ticket             | id_ticket        | int (PK)         | Unique identifier of the ticket. |
| Ticket             | id_booking       | int (FK)         | Booking associated with the ticket. |
| Ticket             | qr_code          | string           | QR code generated to validate the ticket. |
| Trolley_model      | id_model         | int (PK)         | Unique identifier of the trolley model. |
| Trolley_model      | capacity         | int              | Maximum passenger capacity. |
| Trolley_model      | model_name       | string           | Model name or reference. |
| Trolley            | id_trolley       | int (PK)         | Unique identifier of the trolley. |
| Trolley            | plate_number     | string           | Vehicle license plate number. |
| Trolley            | id_model         | int (FK)         | Model assigned to the trolley (references Trolley_model). |
| Trolley_schedule   | id_schedule      | int (PK)         | Unique identifier of the schedule. |
| Trolley_schedule   | id_trolley       | int (FK)         | Assigned trolley. |
| Trolley_schedule   | id_route         | int (FK)         | Assigned route. |
| Trolley_schedule   | departure_time   | datetime         | Scheduled departure date and time. |
| Trolley_stop       | id_stop          | int (PK)         | Unique identifier of the stop. |
| Trolley_stop       | name             | string           | Name of the stop. |
| Trolley_stop       | coordinates      | string           | Geographic coordinates of the stop. |
| Route              | id_route         | int (PK)         | Unique identifier of the route. |
| Route              | route_name       | string           | Route name or code. |
| Route_stop         | id_route         | int (FK)         | Route that includes the stop. |
| Route_stop         | id_stop          | int (FK)         | Stop included in the route. |
| Route_stop         | stop_order       | int              | Order of the stop within the route. |
