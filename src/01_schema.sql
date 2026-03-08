CREATE TABLE user (
          id_user INT PRIMARY KEY AUTO_INCREMENT,
          password VARCHAR(255) NOT NULL
);

CREATE TABLE location (
          id_location INT PRIMARY KEY AUTO_INCREMENT,
          location_name VARCHAR(100) NOT NULL
);

CREATE TABLE flight (
          id_flight INT PRIMARY KEY AUTO_INCREMENT,
          origin_id INT NOT NULL,
          dest_id INT NOT NULL,
          price DECIMAL(10,2) NOT NULL CHECK (price > 0),
          FOREIGN KEY (origin_id) REFERENCES location(id_location),
          FOREIGN KEY (dest_id) REFERENCES location(id_location)
);

CREATE TABLE booking (
          id_booking INT PRIMARY KEY AUTO_INCREMENT,
          id_user INT NOT NULL,
          id_flight INT NOT NULL,
          date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(20) NOT NULL CHECK (status IN ('confirmed', 'canceled', 'pending')),
          FOREIGN KEY (id_user) REFERENCES location (id_location),
          FOREIGN KEY (id_flight) REFERENCES flight (id_flight)
);

CREATE TABLE ticket (
          id_ticket INT PRIMARY KEY AUTO_INCREMENT,
          id_booking INT NOT NULL,
          qr_code VARCHAR(255) UNIQUE NOT NULL,
          FOREIGN KEY (id_booking) REFERENCES booking (id_booking)
);

CREATE TABLE trolley_model (
          id_model INT PRIMARY KEY AUTO_INCREMENT,
          capacity INT NOT NULL CHECK (capacity > 0),
          model_name VARCHAR(100) NOT NULL
);

CREATE TABLE trolley (
          id_trolley INT PRIMARY KEY AUTO_INCREMENT,
          plate_number VARCHAR(20) UNIQUE NOT NULL,
          id_model INT NOT NULL,
          FOREIGN KEY (id_model) REFERENCES trolley_model (id_model)
);

CREATE TABLE route (
          id_route INT PRIMARY KEY AUTO_INCREMENT,
          route_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE trolley_stop (
          id_stop INT PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          coordinates VARCHAR(100) NOT NULL
);

CREATE TABLE route_stop (
          id_route INT,
          id_stop INT,
          stop_order INT NOT NULL CHECK (stop_order > 0),
          PRIMARY KEY (id_route, id_stop),
          FOREIGN KEY (id_route) REFERENCES route (id_route),
          FOREIGN KEY (id_stop) REFERENCES trolley_stop (id_stop)
);

CREATE TABLE trolley_schedule (
          id_shedule INT PRIMARY KEY AUTO_INCREMENT,
          id_trolley INT NOT NULL,
          id_route INT NOT NULL,
          departure_time DATETIME NOT NULL,
          FOREIGN KEY (id_trolley) REFERENCES trolley (id_trolley),
          FOREIGN KEY (id_route) REFERENCES route (id_route)
);
