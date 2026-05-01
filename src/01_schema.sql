CREATE TABLE person (
          id_person SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          last_names VARCHAR(100) NOT NULL,
          curp VARCHAR(18) UNIQUE NOT NULL,
          birth_date DATE NOT NULL,
          email VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
          id_person INTEGER PRIMARY KEY,
          user_name VARCHAR(16) NOT NULL,
          password VARCHAR(15) NOT NULL,
          FOREIGN KEY (id_person) REFERENCES person(id_person)
);

CREATE TABLE employee (
          id_person INTEGER PRIMARY KEY,
          rfc VARCHAR(13) UNIQUE NOT NULL,
          id_occupation INTEGER NOT NULL,
          FOREIGN KEY (id_person) REFERENCES person(id_person),
          FOREIGN KEY (id_occupation) REFERENCES occupation(id_occupation)
);

CREATE TABLE occupation (
          id_occupation SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL
);

CREATE TABLE airport (
          id_airport SERIAL PRIMARY KEY,
          city_name VARCHAR(50) NOT NULL,
          airport_name VARCHAR(100) NOT NULL,
          airport_code VARCHAR(4) UNIQUE NOT NULL
);

CREATE TABLE airplane_model (
          id_airplane_model SERIAL PRIMARY KEY,
          capacity SMALLINT NOT NULL,
          model_name VARCHAR(50) NOT NULL
);

CREATE TABLE airplane(
          id_airplane SERIAL PRIMARY KEY,
          registration_number VARCHAR(20) UNIQUE NOT NULL,
          id_airplane_model INTEGER NOT NULL,
          status VARCHAR(12) NOT NULL CHECK (status IN ('active','maintenance','retired')),
          FOREIGN KEY (id_airplane_model) REFERENCES airplane_model(id_airplane_model)
);

CREATE TABLE flight (
          id_flight SERIAL PRIMARY KEY,
          flight_number VARCHAR(5) NOT NULL,
          flight_name VARCHAR(50) NOT NULL,
          origin_airport_id INTEGER NOT NULL,
          dest_airport_id INTEGER NOT NULL,
          origin_city VARCHAR(50) NOT NULL,
          destination_city VARCHAR(50) NOT NULL,
          id_airplane INTEGER NOT NULL,
          flight_date DATE NOT NULL,
          departure_time TIME NOT NULL,
          arrival_time TIME NOT NULL,
          base_price DECIMAL(10,2) NOT NULL CHECK (base_price > 0),
          status VARCHAR(15) NOT NULL CHECK (status IN ('scheduled','boarding','completed','canceled')),
          FOREIGN KEY (origin_airport_id) REFERENCES airport(id_airport),
          FOREIGN KEY (dest_airport_id) REFERENCES airport(id_airport),
          FOREIGN KEY (id_airplane) REFERENCES airplane(id_airplane),
          CHECK (origin_airport_id <> dest_airport_id)
);

CREATE TABLE flight_booking (
    id_booking SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    id_flight INTEGER NOT NULL,
    number_of_seats INTEGER NOT NULL CHECK (number_of_seats > 0),
    booking_date TIMESTAMP NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('pending','confirmed','cancelled')),
    FOREIGN KEY (id_user) REFERENCES users(id_person),
    FOREIGN KEY (id_flight) REFERENCES flight(id_flight)
);

CREATE TABLE booking_seat (
    id_booking_seat SERIAL PRIMARY KEY,
    id_booking INTEGER NOT NULL,
    id_flight INTEGER NOT NULL,
    seat_number VARCHAR(5) NOT NULL,
    selected_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    status VARCHAR(12) NOT NULL CHECK (status IN ('selected','confirmed')),
    FOREIGN KEY (id_booking) REFERENCES flight_booking(id_booking),
    FOREIGN KEY (id_flight) REFERENCES flight(id_flight)
);

CREATE TABLE ticket (
    id_ticket SERIAL PRIMARY KEY,
    id_booking INTEGER NOT NULL,
    booking_date TIMESTAMP NOT NULL,
    passenger_full_name VARCHAR(200) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL CHECK (ticket_price > 0),
    FOREIGN KEY (id_booking) REFERENCES flight_booking(id_booking)
);

CREATE TABLE trolley_model (
    id_model SERIAL PRIMARY KEY,
    capacity SMALLINT NOT NULL CHECK (capacity > 0),
    model_name VARCHAR(50) NOT NULL
);

CREATE TABLE trolley (
    id_trolley SERIAL PRIMARY KEY,
    plate_number VARCHAR(12) UNIQUE NOT NULL,
    id_model INTEGER NOT NULL,
    FOREIGN KEY (id_model) REFERENCES trolley_model(id_model)
);

CREATE TABLE bus_station (
    id_station SERIAL PRIMARY KEY,
    city_name VARCHAR(50) NOT NULL,
    station_name VARCHAR(100) NOT NULL,
    station_code VARCHAR(6) UNIQUE NOT NULL,
    address VARCHAR(200),
    coordinates VARCHAR(100)
);

CREATE TABLE route (
    id_route SERIAL PRIMARY KEY,
    route_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE route_stop (
    id_route_stop SERIAL PRIMARY KEY,
    id_route INTEGER NOT NULL,
    id_station INTEGER NOT NULL,
    stop_order SMALLINT NOT NULL CHECK (stop_order > 0),
    FOREIGN KEY (id_route) REFERENCES route(id_route),
    FOREIGN KEY (id_station) REFERENCES bus_station(id_station)
);

CREATE TABLE trolley_route_schedule (
    id_route_schedule SERIAL PRIMARY KEY,
    id_route INTEGER NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    FOREIGN KEY (id_route) REFERENCES route(id_route),
    CHECK (arrival_time > departure_time)
);

CREATE TABLE schedule_day (
    id_schedule_day SERIAL PRIMARY KEY,
    id_route_schedule INTEGER NOT NULL,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
    FOREIGN KEY (id_route_schedule) REFERENCES trolley_route_schedule(id_route_schedule)
);

CREATE TABLE trolley_trip (
    id_trip SERIAL PRIMARY KEY,
    id_route_schedule INTEGER NOT NULL,
    id_trolley INTEGER NOT NULL,
    origin_station_id INTEGER NOT NULL,
    dest_station_id INTEGER NOT NULL,
    trip_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price > 0),
    status VARCHAR(15) NOT NULL CHECK (status IN ('scheduled','in_progress','completed','cancelled')),
    FOREIGN KEY (id_route_schedule) REFERENCES trolley_route_schedule(id_route_schedule),
    FOREIGN KEY (id_trolley) REFERENCES trolley(id_trolley),
    FOREIGN KEY (origin_station_id) REFERENCES bus_station(id_station),
    FOREIGN KEY (dest_station_id) REFERENCES bus_station(id_station),
    CHECK (origin_station_id <> dest_station_id),
    CHECK (arrival_time > departure_time)
);

CREATE TABLE trolley_booking (
    id_booking SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    id_trip INTEGER NOT NULL,
    boarding_stop_id INTEGER NOT NULL,
    alighting_stop_id INTEGER NOT NULL,
    number_of_seats INTEGER NOT NULL CHECK (number_of_seats > 0),
    booking_date TIMESTAMP NOT NULL,
    status VARCHAR(12) NOT NULL CHECK (status IN ('pending','confirmed','cancelled')),
    FOREIGN KEY (id_user) REFERENCES users(id_person),
    FOREIGN KEY (id_trip) REFERENCES trolley_trip(id_trip),
    FOREIGN KEY (boarding_stop_id) REFERENCES route_stop(id_route_stop),
    FOREIGN KEY (alighting_stop_id) REFERENCES route_stop(id_route_stop),
    CHECK (boarding_stop_id <> alighting_stop_id)
);

CREATE TABLE payment (
    id_payment SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    id_flight_booking INTEGER,
    id_trolley_booking INTEGER,
    payment_method VARCHAR(10) NOT NULL CHECK (payment_method IN ('cash','card','transfer')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    amount_received DECIMAL(10,2),
    change_given DECIMAL(10,2),
    payment_status VARCHAR(12) NOT NULL CHECK (payment_status IN ('pending','completed','failed','refunded')),
    payment_date TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    reference_number VARCHAR(100),
    card_last_four VARCHAR(4),
    notes TEXT,
    FOREIGN KEY (id_user) REFERENCES users(id_person),
    FOREIGN KEY (id_flight_booking) REFERENCES flight_booking(id_booking),
    FOREIGN KEY (id_trolley_booking) REFERENCES trolley_booking(id_booking)
);
