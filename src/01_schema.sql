CREATE TABLE users (
          id_user SERIAL PRIMARY KEY,
          password VARCHAR(15) NOT NULL
);

CREATE TABLE location (
          id_location SERIAL PRIMARY KEY,
          location_name VARCHAR(50) NOT NULL
);

CREATE TABLE flight (
          id_flight SERIAL PRIMARY KEY,
          origin_id INTEGER NOT NULL,
          dest_id INTEGER NOT NULL,
          price DECIMAL(10,2) NOT NULL CHECK (price > 0),
          FOREIGN KEY (origin_id) REFERENCES location(id_location),
          FOREIGN KEY (dest_id) REFERENCES location(id_location)
);

CREATE TABLE booking (
          id_booking SERIAL PRIMARY KEY,
          id_user INTEGER NOT NULL,
          id_flight INTEGER NOT NULL,
          date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(10) NOT NULL CHECK (status IN ('confirmed', 'canceled', 'pending')),
          FOREIGN KEY (id_user) REFERENCES users (id_user),
          FOREIGN KEY (id_flight) REFERENCES flight (id_flight)
);

CREATE TABLE ticket (
          id_ticket SERIAL PRIMARY KEY,
          id_booking INTEGER NOT NULL,
          qr_code VARCHAR(100) UNIQUE NOT NULL,
          FOREIGN KEY (id_booking) REFERENCES booking (id_booking)
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
          FOREIGN KEY (id_model) REFERENCES trolley_model (id_model)
);

CREATE TABLE route (
    id_route SERIAL PRIMARY KEY,
    route_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE trolley_stop (
    id_stop SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    coordinates VARCHAR(100) NOT NULL
);

CREATE TABLE route_stop (
    id_route INTEGER,
    id_stop INTEGER,
    stop_order INT NOT NULL CHECK (stop_order > 0),
    PRIMARY KEY (id_route, id_stop),
    FOREIGN KEY (id_route) REFERENCES route (id_route),
    FOREIGN KEY (id_stop) REFERENCES trolley_stop (id_stop)
);

CREATE TABLE trolley_schedule (
    id_schedule SERIAL PRIMARY KEY,
    id_trolley INTEGER NOT NULL,
    id_route INTEGER NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    FOREIGN KEY (id_trolley) REFERENCES trolley (id_trolley),
    FOREIGN KEY (id_route) REFERENCES route (id_route)
);
