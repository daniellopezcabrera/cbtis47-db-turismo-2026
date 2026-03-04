```sql
-- ============================================================
--  Database Schema Definition
-- ============================================================

-- ------------------------------------------------------------
-- Table: ROLE
-- ------------------------------------------------------------
CREATE TABLE Role (
    id_role     INT             NOT NULL,
    role_name   VARCHAR(50)     NOT NULL,
    CONSTRAINT pk_role PRIMARY KEY (id_role)
);

-- ------------------------------------------------------------
-- Table: USER
-- ------------------------------------------------------------
CREATE TABLE User (
    id_user     INT             NOT NULL,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    id_role     INT             NOT NULL,
    CONSTRAINT pk_user      PRIMARY KEY (id_user),
    CONSTRAINT fk_user_role FOREIGN KEY (id_role) REFERENCES Role(id_role)
);

-- ------------------------------------------------------------
-- Table: FLIGHT
-- ------------------------------------------------------------
CREATE TABLE Flight (
    id_flight   INT             NOT NULL,
    origin_id   INT             NOT NULL,
    dest_id     INT             NOT NULL,
    price       FLOAT           NOT NULL,
    CONSTRAINT pk_flight PRIMARY KEY (id_flight)
);

-- ------------------------------------------------------------
-- Table: BOOKING
-- ------------------------------------------------------------
CREATE TABLE Booking (
    id_booking  INT             NOT NULL,
    id_user     INT             NOT NULL,
    date        DATETIME        NOT NULL,
    status      VARCHAR(20)     NOT NULL,
    CONSTRAINT pk_booking       PRIMARY KEY (id_booking),
    CONSTRAINT fk_booking_user  FOREIGN KEY (id_user) REFERENCES User(id_user)
);

-- ------------------------------------------------------------
-- Table: TICKET
-- ------------------------------------------------------------
CREATE TABLE Ticket (
    id_ticket   INT             NOT NULL,
    id_booking  INT             NOT NULL,
    qr_code     VARCHAR(255)    NOT NULL,
    CONSTRAINT pk_ticket         PRIMARY KEY (id_ticket),
    CONSTRAINT fk_ticket_booking FOREIGN KEY (id_booking) REFERENCES Booking(id_booking)
);

-- ------------------------------------------------------------
-- Table: TROLLEY_MODEL
-- ------------------------------------------------------------
CREATE TABLE Trolley_model (
    id_model    INT             NOT NULL,
    capacity    INT             NOT NULL,
    model_name  VARCHAR(100)    NOT NULL,
    CONSTRAINT pk_trolley_model PRIMARY KEY (id_model)
);

-- ------------------------------------------------------------
-- Table: TROLLEY
-- ------------------------------------------------------------
CREATE TABLE Trolley (
    id_trolley   INT          NOT NULL,
    plate_number VARCHAR(20)  NOT NULL UNIQUE,
    id_model     INT          NOT NULL,
    CONSTRAINT pk_trolley       PRIMARY KEY (id_trolley),
    CONSTRAINT fk_trolley_model FOREIGN KEY (id_model) REFERENCES Trolley_model(id_model)
);

-- ------------------------------------------------------------
-- Table: TROLLEY_STOP
-- ------------------------------------------------------------
CREATE TABLE Trolley_stop (
    id_stop     INT             NOT NULL,
    name        VARCHAR(100)    NOT NULL,
    coordinates VARCHAR(100)    NOT NULL,
    CONSTRAINT pk_trolley_stop PRIMARY KEY (id_stop)
);

-- ------------------------------------------------------------
-- Table: ROUTE
-- ------------------------------------------------------------
CREATE TABLE Route (
    id_route    INT             NOT NULL,
    route_name  VARCHAR(100)    NOT NULL,
    CONSTRAINT pk_route PRIMARY KEY (id_route)
);

-- ------------------------------------------------------------
-- Table: ROUTE_STOP
-- ------------------------------------------------------------
CREATE TABLE Route_stop (
    id_route    INT     NOT NULL,
    id_stop     INT     NOT NULL,
    stop_order  INT     NOT NULL,
    CONSTRAINT pk_route_stop       PRIMARY KEY (id_route, id_stop),
    CONSTRAINT fk_route_stop_route FOREIGN KEY (id_route) REFERENCES Route(id_route),
    CONSTRAINT fk_route_stop_stop  FOREIGN KEY (id_stop)  REFERENCES Trolley_stop(id_stop)
);

-- ------------------------------------------------------------
-- Table: TROLLEY_SCHEDULE
-- ------------------------------------------------------------
CREATE TABLE Trolley_schedule (
    id_schedule    INT      NOT NULL,
    id_trolley     INT      NOT NULL,
    id_route       INT      NOT NULL,
    departure_time DATETIME NOT NULL,
    CONSTRAINT pk_trolley_schedule  PRIMARY KEY (id_schedule),
    CONSTRAINT fk_schedule_trolley  FOREIGN KEY (id_trolley) REFERENCES Trolley(id_trolley),
    CONSTRAINT fk_schedule_route    FOREIGN KEY (id_route)   REFERENCES Route(id_route)
);
```


