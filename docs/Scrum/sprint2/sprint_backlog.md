# Sprint Backlog 2 — Flying With You
**Period:** March 31 – May 8, 2026 (5 weeks)
**Institution:** CBTis 47
**Previous Sprint:** Sprint 1 (Data model design)

---

## 1. Sprint Goal

**Build the real database in Supabase, create the first functional interface prototype, and connect the database to the frontend.**
By the end of the sprint, the team must have: (1) the database implemented in Supabase with all tables from the ER model, (2) a first draft of HTML/CSS interfaces, (3) test data manually inserted into the tables, and (4) a functional connection between the database and the frontend.

---

## 2. Sprint Data

| Concept | Value |
|---------|-------|
| Duration | 5 weeks |
| Working days per week | 4 days |
| Total working days | 20 days |
| Effective hours per day | 3 hours |
| **Total sprint capacity** | **300 hours** (20 days × 3 h × 5 members) |
| Planned Story Points | 34 points |

---

## 3. Updated Product Backlog (11 User Stories)

At the close of Sprint 1, the Product Backlog remained at **11 user stories**, all belonging to end-user epics:

- EP-01 · User Authentication (US-01, US-02, US-03)
- EP-02 · Flight Reservation (US-04, US-05, US-06)
- EP-03 · Tourist Trolleybus Reservation (US-07, US-08)
- EP-04 · Payment Processing (US-09)
- EP-05 · PDF Ticket Generation (US-10, US-11)

For Sprint 2, all high-priority stories related to database, interfaces, and connection were selected. Work was organized into four categories: **DB** (database), **UI** (interfaces), **DATA** (test data), and **INT** (integration).

---

## 4. Sprint Backlog — Stories Assigned to Sprint 2

| ID | Story | Category | Priority | SP | Owner |
|----|-------|----------|----------|----|-------|
| DB-01 | Create Supabase project and configure authentication | DB | High | 2 | German |
| DB-02 | Create PERSON table with all defined columns | DB | High | 2 | Edson |
| DB-03 | Create USER table (linked to Supabase Auth) | DB | High | 2 | Edson |
| DB-04 | Create AIRPORT, AIRPLANE_MODEL, AIRPLANE, FLIGHT tables | DB | High | 3 | German |
| DB-05 | Create FLIGHT_BOOKING and BOOKING_SEAT tables | DB | High | 2 | Michelle |
| DB-06 | Create trolleybus tables (ROUTE, BUS_STATION, ROUTE_STOP) | DB | High | 2 | Johana |
| DB-07 | Create TROLLEY_MODEL, TROLLEY, TROLLEY_TRIP tables | DB | Medium | 2 | Johana |
| DB-08 | Create TROLLEY_BOOKING and TICKET tables | DB | High | 2 | Michelle |
| DB-09 | Create PAYMENT table with optional FKs | DB | High | 2 | German |
| DB-10 | Define RLS security policies in Supabase | DB | Medium | 3 | Edson |
| UI-01 | Mockup user registration page (HTML/CSS) | UI | High | 2 | Daniel |
| UI-02 | Mockup login page | UI | High | 1 | Daniel |
| UI-03 | Mockup main dashboard | UI | High | 2 | Daniel |
| UI-04 | Mockup flight search page | UI | High | 2 | Michelle |
| UI-05 | Mockup seat map (visual only, no logic) | UI | High | 3 | Michelle |
| UI-06 | Mockup trolleybus route listing | UI | High | 2 | Johana |
| UI-07 | Mockup simulated payment screen | UI | High | 2 | Johana |
| UI-08 | Mockup ticket screen with PDF download button | UI | Medium | 2 | Daniel |
| DATA-01 | Insert test data: airports | DATA | High | 1 | German |
| DATA-02 | Insert test data: airplane models and airplanes | DATA | High | 1 | German |
| DATA-03 | Insert test data: flights | DATA | High | 2 | Michelle |
| DATA-04 | Insert test data: trolleybus routes | DATA | High | 2 | Johana |
| DATA-05 | Insert test data: test users | DATA | Medium | 1 | Edson |
| INT-01 | Connect registration form to Supabase Auth | INT | High | 3 | Team |
| INT-02 | Connect login form to Supabase Auth | INT | High | 2 | Team |
| INT-03 | Load flights from database into the search page | INT | High | 3 | Team |

---

## 5. Planned Tasks by Category

### DB · Database

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| DB-01 | Supabase project setup, authentication activation, and environment variable definition. | 2 | 6 h | German |
| DB-02 | Creation of PERSON table with PK, attributes (CURP, name, email), and NOT NULL/UNIQUE constraints. | 2 | 6 h | Edson |
| DB-03 | Creation of USER table linked to Supabase Auth with FK to PERSON and role field. | 2 | 6 h | Edson |
| DB-04 | Creation of AIRPORT, AIRPLANE_MODEL, AIRPLANE, and FLIGHT tables with PKs, FKs, and ENUM types. | 3 | 7 h | German |
| DB-05 | Creation of FLIGHT_BOOKING and BOOKING_SEAT tables with FK, expires_at, and status. | 2 | 6 h | Michelle |
| DB-06 | Creation of ROUTE, BUS_STATION, and ROUTE_STOP tables with stop order definition. | 2 | 6 h | Johana |
| DB-07 | Creation of TROLLEY_MODEL, TROLLEY, and TROLLEY_TRIP tables with their relationships. | 2 | 6 h | Johana |
| DB-08 | Creation of TROLLEY_BOOKING and TICKET tables with their FKs and constraints. | 2 | 6 h | Michelle |
| DB-09 | Creation of PAYMENT table with last_four_digits and optional FKs for flight and trolleybus. | 2 | 6 h | German |
| DB-10 | Definition of RLS (Row Level Security) policies by role in Supabase. | 3 | 7 h | Edson |
| **DB Subtotal** | | **22 SP** | **62 h** | |

---

### UI · Interfaces

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| UI-01 | Registration page mockup with HTML5/CSS3, responsive layout (Flex/Grid). | 2 | 6 h | Daniel |
| UI-02 | Login page mockup with basic visual validation. | 1 | 4 h | Daniel |
| UI-03 | Main dashboard mockup with navigation and sections. | 2 | 6 h | Daniel |
| UI-04 | Flight search mockup with date, origin, and destination filters. | 2 | 6 h | Michelle |
| UI-05 | Seat map mockup with color-coded visual representation (no JS logic). | 3 | 7 h | Michelle |
| UI-06 | Trolleybus route listing mockup with stops. | 2 | 6 h | Johana |
| UI-07 | Simulated payment screen mockup with card fields. | 2 | 6 h | Johana |
| UI-08 | Ticket screen mockup with PDF download button. | 2 | 6 h | Daniel |
| **UI Subtotal** | | **16 SP** | **47 h** | |

---

### DATA · Test Data

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| DATA-01 | Manual insertion of airports using INSERT statements. | 1 | 3 h | German |
| DATA-02 | Manual insertion of airplane models and airplanes. | 1 | 3 h | German |
| DATA-03 | Insertion of flights with all FKs correctly referenced. | 2 | 5 h | Michelle |
| DATA-04 | Insertion of trolleybus routes and stops into ROUTE and ROUTE_STOP. | 2 | 5 h | Johana |
| DATA-05 | Insertion of test users into Supabase Auth and USER table. | 1 | 3 h | Edson |
| **DATA Subtotal** | | **7 SP** | **19 h** | |

---

### INT · Integration

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| INT-01 | Connection of registration form to Supabase Auth + insertion into PERSON and USER. | 3 | 7 h | Team |
| INT-02 | Connection of login form to Supabase Auth. | 2 | 6 h | Team |
| INT-03 | Dynamic loading of flights from FLIGHT table into the HTML search page. | 3 | 7 h | Team |
| **INT Subtotal** | | **8 SP** | **20 h** | |

---

## 6. Hours Summary by Team Member

> **Individual capacity:** 3 hours/day × 20 working days = **60 hours per member**
> **Total team capacity:** 60 h × 5 members = **300 hours**

| Member | Direct Work | Research & Learning | Reviews & Corrections | Team Meetings | **Total** |
|--------|-------------|---------------------|-----------------------|---------------|-----------|
| Daniel | 22 h | 18 h | 12 h | 8 h | **60 h** |
| Michelle | 24 h | 16 h | 12 h | 8 h | **60 h** |
| Johana | 22 h | 18 h | 12 h | 8 h | **60 h** |
| Edson | 22 h | 18 h | 12 h | 8 h | **60 h** |
| German | 22 h | 18 h | 12 h | 8 h | **60 h** |
| **Total** | **112 h** | **88 h** | **60 h** | **40 h** | **300 h** |

> **Note:** Direct work hours include table implementation, interface mockups, and data insertion. Research and learning hours reflect the time spent understanding Supabase, RLS, and the JS client — knowledge that was new to the team in this sprint.

---

## 7. Weekly Workload Estimate

| Week | Main Focus | Planned SP | Team Members |
|------|------------|------------|--------------|
| Week 1 (Mar 31 – Apr 3) | DB-01 to DB-05: Supabase setup and main tables | ~13 | German, Edson, Michelle |
| Week 2 (Apr 7 – Apr 10) | DB-06 to DB-10: trolleybus tables, PAYMENT, and RLS | ~9 | Johana, German, Edson |
| Week 3 (Apr 14 – Apr 17) | UI-01 to UI-05: main interface mockups | ~10 | Daniel, Michelle |
| Week 4 (Apr 22 – Apr 24) | UI-06 to UI-08 + DATA-01 to DATA-05: remaining interfaces and data | ~9 | Johana, Daniel, German |
| Week 5 (Apr 28 – May 8) | INT-01 to INT-03: DB-Frontend integration | ~8 | Full team |

---

## 8. Impediments and Dependencies

| Type | Description | Expected Impact | Mitigation Plan |
|------|-------------|-----------------|-----------------|
| **Risk** | The team has no prior experience with the Supabase JS Client | Possible delay in INT-01, INT-02, INT-03 | Start JS client research in parallel from Week 1 |
| **Risk** | RLS policies require advanced Supabase knowledge | DB-10 may not be completed within the sprint | Assign dedicated research time in Week 2 |
| **Risk** | FK complexity in FLIGHT may hinder data insertion | DATA-03 may be left incomplete | Review the ER model before starting insertion in Week 4 |
| **Dependency** | UI-04 and UI-05 depend on having flight data available (DATA-03) | Visual testing may be delayed | Use static mock data in HTML if DATA-03 is not ready in time |
| **Dependency** | INT-02 and INT-03 depend on INT-01 being completed | Chain blocking if INT-01 fails or is delayed | Prioritize INT-01 at the start of Week 5 without exceptions |

---

## 9. Definition of Done (DoD) for Sprint 2

A story is considered **DONE** when:

1. ✅ The task is implemented and committed to the `sprint-2` branch.
2. ✅ It has been reviewed by at least one other team member (peer review).
3. ✅ For database tasks: the table exists in Supabase and `SELECT * FROM table` runs without errors.
4. ✅ For interface tasks: the screen renders correctly in Chrome/Edge without console errors.
5. ✅ For data tasks: records exist in the corresponding table and are queryable.
6. ✅ The story has been demonstrated to the Product Owner (Daniel López Cabrera).

> **Note:** The DB-Frontend connection is not a requirement for an UI task to be considered done in this sprint — that responsibility belongs to Sprint 3.

---

## 10. Expected Sprint 2 Deliverables

| Deliverable | Expected Location |
|-------------|-------------------|
| Database in Supabase (all tables created) | Supabase Project |
| Complete test data (airports, airplanes, flights, routes, users) | Corresponding tables in Supabase |
| First draft of HTML/CSS interfaces (8 screens) | Repository `/frontend` |
| Functional DB-Frontend connection (registration, login, flight loading) | Repository `/frontend/js` |
| Sprint documentation | Repository `/docs/sprints` |

---

*Flying With You — CBTis 47 · Sprint Backlog 2 (March 31 – May 8, 2026)*
