*ROLE:*

id_role (int, PK): Unique identifier of the role.

role_name (string): Name of the role (e.g., administrator, customer, employee).

*USER:*

id_user (int, PK):  Unique identifier of the user.
email (string): User´s email adress.

password (string): Encrypted user password.

id_role (int, FK): Role assigned to the user (References ROLE).

*FLIGHT:*

id_flight (int, PK): Unique identifier of the flight.

origin_id (int, FK): Identifier of the flight´s origin location.

dest_id (int, FK): Identifier of the flight´s destination location.

price (float): Flight ticket price.

*BOOKING:*

id_booking (int, PK): Unique identifier of the booking.

id_user (int, FK): User who made the booking.

date (datetime): Date and time when the booking was created.

status (string): Booking status (e.g., confirmed, canceled, pending).

*TICKET:*

id_ticket (int, PK): Unique identifier of the ticket.

id_booking (int, FK): Booking associated with the ticket.

qr_code (string): QR code generated to validate the ticket.

*TROLLEY_MODEL:*

id_model (int, PK): Unique identifier of the trolley model.

capacity (int): Maximum passenger capacity.

model_name (string): Model name or reference.

*TROLLEY:*

id_trolley (int, PK): Unique identifier of the trolley.

plate_number (string): Vehicle license plate number.

id_model (int, FK): Model assigned to the trolley (references TROLLEY_MODEL).

*TROLLEY_SCHEDULE:*

id_schedule (int, PK): Unique identifier of the schedule.

id_trolley (int, FK): Assigned trolley.

id_route (int, FK): Assigned route.

departure_time (datetime): 
Scheduled departure date and time.

*TROLLEY_STOP:*

id_stop (int, PK): Unique identifier of the stop.

name (string): Name of the stop.

coordinates (string): Geographic coordinates of the stop.

*ROUTE:*

id_route (int, PK): Unique identifier of the route.

route_name (string): Route name or code.

*ROUTE_STOP:*

id_route (int, FK): Route that includes the stop.

id_stop (int, FK): Stop included in the route.

stop_order (int): Order of the stop within the route.        
