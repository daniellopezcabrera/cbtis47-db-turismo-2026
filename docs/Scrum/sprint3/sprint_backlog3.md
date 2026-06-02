# Sprint Backlog 3 — Flying With You
**Period:** May 11 – June 12, 2026 (5 weeks)
**Institution:** CBTis 47
**Previous Sprint:** Sprint 2 (Database + interfaces + partial test data)

---

## 1. Sprint Goal

**The system must be fully functional at a school level.**
By the end of the sprint, the team must have: (1) all 23 user stories completely implemented, (2) full frontend-Supabase connection working, (3) complete test data, (4) all roles functional (End User, Pilot, Co-pilot, Flight Attendant, Driver, Administrator), and (5) a complete end-to-end flow operational for all user types.

---

## 2. Sprint Data

| Concept | Value |
|---------|-------|
| Duration | 5 weeks |
| Working days per week | 4 days (Monday to Thursday) |
| Total working days | 20 days |
| Effective hours per day | 3 hours |
| **Total sprint capacity** | **300 hours** (20 days × 3 h × 5 members) |
| Planned Story Points | 83 points |
| Completed Story Points | — (in progress) |

---

## 3. Updated Product Backlog (23 User Stories)

At the start of Sprint 3, the Product Backlog grew from 11 to **23 user stories**.
The 12 new stories correspond to the following epics:

- EP-06 · Assigned Flight Management (Pilot / Co-pilot)
- EP-07 · In-Flight Service Management (Flight Attendant)
- EP-08 · Trolleybus Route Management (Driver)
- EP-09 · System Administration (Administrator)

---

## 4. Sprint Backlog — Stories Assigned to Sprint 3

| ID | Story | Epic | Priority | SP | Owner | Status |
|----|-------|------|-----------|----|-------|--------|
| **Pending from Sprint 2** | | | | | | |
| DB-10 | Define RLS security policies in Supabase | — | High | 3 | German | In progress |
| DATA-03 | Insert test data: flights | — | High | 2 | Michelle | In progress |
| DATA-04 | Insert test data: trolleybus routes | — | High | 2 | Johana | In progress |
| INT-01 | Connect registration form to Supabase Auth | EP-01 | High | 3 | Team | In progress |
| INT-02 | Connect login form to Supabase Auth | EP-01 | High | 2 | Team | In progress |
| INT-03 | Load flights from database into the search page | EP-02 | High | 3 | Team | In progress |
| **New Stories Sprint 3** | | | | | | |
| US-01 | User Registration | EP-01 | High | 5 | Daniel | Not started |
| US-02 | User Login | EP-01 | High | 2 | Daniel | Not started |
| US-03 | User Logout | EP-01 | Medium | 1 | Daniel | Not started |
| US-04 | Flight Search | EP-02 | High | 5 | Michelle | Not started |
| US-05 | Seat Selection for Flights | EP-02 | High | 5 | Michelle | Not started |
| US-06 | Flight Reservation Confirmation | EP-02 | High | 3 | Michelle | Not started |
| US-07 | Browse Trolleybus Routes | EP-03 | High | 3 | Johana | Not started |
| US-08 | Trolleybus Reservation | EP-03 | High | 5 | Johana | Not started |
| US-09 | Complete Payment for a Reservation | EP-04 | High | 5 | Edson | Not started |
| US-10 | Add Reservations to a Ticket | EP-05 | Medium | 3 | Edson | Not started |
| US-11 | Download PDF Ticket | EP-05 | Medium | 5 | Edson | Not started |
| US-12 | Consult Assigned Flights | EP-06 | High | 3 | German | Not started |
| US-13 | View Flight Passenger Manifest | EP-06 | High | 3 | German | Not started |
| US-14 | Update Flight Status | EP-06 | High | 3 | German | Not started |
| US-15 | Consult Passengers and Assigned Seats | EP-07 | High | 3 | Michelle | Not started |
| US-16 | Record In-Flight Incidents | EP-07 | Medium | 3 | Michelle | Not started |
| US-17 | Consult Daily Trips and Passengers | EP-08 | High | 3 | Johana | Not started |
| US-18 | Update Trolleybus Trip Status | EP-08 | Medium | 2 | Johana | Not started |
| US-19 | Manage Flights (CRUD) | EP-09 | High | 5 | Edson | Not started |
| US-20 | Manage Trolleybus Routes and Trips (CRUD) | EP-09 | High | 5 | Edson | Not started |
| US-21 | Manage Agency Staff | EP-09 | High | 5 | Daniel | Not started |
| US-22 | View Reservation and Payment Reports | EP-09 | Medium | 3 | German | Not started |
| US-23 | Cancel or Modify a Reservation | EP-09 | High | 3 | German | Not started |

---

## 5. Planned Tasks by Epic

> **Total hours distribution:** 300 hours
> **Maximum hours per individual task:** 8 hours
> **Base rate:** 1 SP ≈ 3.6 hours (300h / 83 SP)

---

### EP-01 · User Authentication

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| INT-01 | Connect registration form → Supabase Auth + insert into PERSON and USER | 3 | 7 h | Team |
| INT-02 | Connect login form → resolve username to email → authenticate | 2 | 6 h | Team |
| US-01 | CURP validation, duplicate email, format checks, error handling | 5 | 8 h | Daniel |
| US-02 | Block after failed attempts, handle disabled account | 2 | 6 h | Daniel |
| US-03 | Session logout + inactivity expiration | 1 | 4 h | Daniel |
| **EP-01 Subtotal** | | **13 SP** | **31 h** | |

---

### EP-02 · Flight Reservation

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| INT-03 | Load flights from FLIGHT table into the HTML search page | 3 | 7 h | Team |
| US-04 | Filters, validations (past date, same origin/destination) | 5 | 8 h | Michelle |
| US-05 | Seat map from AIRPLANE_MODEL, colors based on BOOKING_SEAT status | 5 | 8 h | Michelle |
| US-06 | Create FLIGHT_BOOKING + BOOKING_SEAT, 10-min timer, expiration logic | 3 | 7 h | Michelle |
| **EP-02 Subtotal** | | **16 SP** | **30 h** | |

---

### EP-03 · Tourist Trolleybus Reservation

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| DATA-04 | Insert remaining routes into ROUTE and ROUTE_STOP | 2 | 5 h | Johana |
| US-07 | Route listing with departure stop from ROUTE_STOP | 3 | 7 h | Johana |
| US-08 | Reservation with boarding_stop, TROLLEY_BOOKING, 10-min timer | 5 | 8 h | Johana |
| **EP-03 Subtotal** | | **10 SP** | **20 h** | |

---

### EP-04 · Payment Processing

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| US-09 | Simulated payment, insert into PAYMENT, change status to confirmed | 5 | 8 h | Edson |
| Validate | Reject payment if expires_at has passed, handle failed payment | — | 4 h | Edson |
| Cash payment | Change calculation, insufficient amount validation | — | 3 h | Edson |
| **EP-04 Subtotal** | | **5 SP** | **15 h** | |

---

### EP-05 · PDF Ticket Generation

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| US-10 | Accumulate confirmed reservations in ticket, avoid duplicates, enforce limit | 3 | 7 h | Edson |
| US-11 | PDF generation with jsPDF, block second download (TICKET table) | 5 | 8 h | Edson |
| **EP-05 Subtotal** | | **8 SP** | **15 h** | |

---

### EP-06 · Assigned Flight Management

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| US-12 | Display flights assigned to the logged-in pilot/co-pilot | 3 | 7 h | German |
| US-13 | Display passenger manifest (FLIGHT_BOOKING + BOOKING_SEAT + PERSON) | 3 | 7 h | German |
| US-14 | Update status: scheduled → departed → cancelled (pilot only) | 3 | 6 h | German |
| **EP-06 Subtotal** | | **9 SP** | **20 h** | |

---

### EP-07 · In-Flight Service Management

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| US-15 | Display passengers + seats for assigned flight (flight attendant only) | 3 | 7 h | Michelle |
| US-16 | Create INCIDENT table, record incidents only on departed flights | 3 | 6 h | Michelle |
| **EP-07 Subtotal** | | **6 SP** | **13 h** | |

---

### EP-08 · Trolleybus Route Management

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| US-17 | Display today's trips for the logged-in driver + passengers per trip | 3 | 7 h | Johana |
| US-18 | Update status: scheduled → in_progress → completed | 2 | 5 h | Johana |
| **EP-08 Subtotal** | | **5 SP** | **12 h** | |

---

### EP-09 · System Administration

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| US-19 | CRUD for FLIGHT (create, edit, delete with validations) | 5 | 8 h | Edson |
| US-20 | CRUD for ROUTE, TROLLEY_ROUTE_SCHEDULE, TROLLEY_TRIP | 5 | 7 h | Edson |
| US-21 | CRUD for EMPLOYEE + PERSON + USER + Supabase Auth | 5 | 7 h | Daniel |
| US-22 | Reservation and payment reports with filters | 3 | 6 h | German |
| US-23 | Cancel or modify reservations (change status) | 3 | 6 h | German |
| **EP-09 Subtotal** | | **21 SP** | **34 h** | |

---

## 6. Hours Summary by Team Member

> **Individual capacity:** 3 hours/day × 20 working days = **60 hours per member**
> **Total team capacity:** 60 h × 5 members = **300 hours**

| Member | Assigned EPs | Direct Work | Research & Learning | Reviews & Corrections | Team Meetings | **Total** |
|--------|-------------|-------------|---------------------|-----------------------|---------------|-----------|
| Daniel | EP-01 + EP-09 (US-21) | 34 h | 12 h | 8 h | 6 h | **60 h** |
| Michelle | EP-02 + EP-07 | 36 h | 11 h | 7 h | 6 h | **60 h** |
| Johana | EP-03 + EP-08 | 32 h | 14 h | 8 h | 6 h | **60 h** |
| Edson | EP-04 + EP-05 + EP-09 (US-19, US-20) | 35 h | 12 h | 7 h | 6 h | **60 h** |
| German | EP-06 + EP-09 (US-22, US-23) | 33 h | 13 h | 8 h | 6 h | **60 h** |
| **Total** | | **170 h** | **62 h** | **38 h** | **30 h** | **300 h** |

---

## 7. Hours Distribution Summary by Epic

| Epic | SP | Adjusted Hours | % of Sprint |
|------|----|----------------|-------------|
| EP-01 | 13 | 31 h | 10% |
| EP-02 | 16 | 30 h | 10% |
| EP-03 | 10 | 20 h | 7% |
| EP-04 | 5 | 15 h | 5% |
| EP-05 | 8 | 15 h | 5% |
| EP-06 | 9 | 20 h | 7% |
| EP-07 | 6 | 13 h | 4% |
| EP-08 | 5 | 12 h | 4% |
| EP-09 | 21 | 34 h | 11% |
| **Total** | **93** | **190 h** | **63%** |

> **Note:** The remaining 110 hours (37%) cover research, peer reviews, integration testing, and team meetings — consistent with the complexity of a full-implementation sprint.

---

## 8. Test Role Data Requirements

| Role | Tables Involved | Minimum Data Required |
|------|-----------------|-----------------------|
| End User | PERSON, USER, Supabase Auth | 3 user accounts |
| Pilot | EMPLOYEE (id_occupation = pilot), FLIGHT | 2 pilots, 4 assigned flights |
| Co-pilot | EMPLOYEE (id_occupation = co-pilot), FLIGHT | 2 co-pilots, 4 assigned flights |
| Flight Attendant | EMPLOYEE (id_occupation = attendant), FLIGHT | 2 attendants, 4 assigned flights |
| Driver | EMPLOYEE (id_occupation = driver), TROLLEY_TRIP | 2 drivers, 6 assigned trips |
| Administrator | EMPLOYEE (id_occupation = admin) + USER | 1 administrator |

---

## 9. Weekly Workload Estimate

| Week | Main Focus | Planned SP | Team Members |
|------|------------|------------|--------------|
| Week 1 (May 11–14) | Complete S2 pending tasks (DB-10, DATA-03, DATA-04, INT-01, INT-02, INT-03) | ~15 | Full team |
| Week 2 (May 18–21) | EP-01, EP-02, EP-03 (end user flow) | ~20 | Daniel, Michelle, Johana |
| Week 3 (May 25–28) | EP-04, EP-05 (payment and ticket) + start EP-06 | ~18 | Edson, German |
| Week 4 (Jun 1–4) | EP-06, EP-07, EP-08 (operational roles) | ~15 | German, Michelle, Johana |
| Week 5 (Jun 8–12) | EP-09 (administrator) + integration + final testing | ~15 | Edson, Daniel, German |

---

## 10. Impediments and Dependencies

| Type | Description | Expected Impact | Mitigation Plan |
|------|-------------|-----------------|-----------------|
| **Risk** | RLS requires deep Supabase investigation | May delay role-based access | Training in Week 1, implementation in Week 2 |
| **Risk** | jsPDF requires specific format for tables | Possible delay in US-11 | Build PDF prototype in Week 2 |
| **Risk** | 83 SP in 5 weeks may be aggressive | Possible non-completion | Prioritize High stories; Medium can move to S4 if needed |
| **Dependency** | US-12 to US-18 depend on having EMPLOYEE records with assigned roles | Cannot be tested without data | DATA-05 must include test employees |
| **Dependency** | US-19 to US-23 require INT-01 and INT-02 to be complete | Admin must be able to log in | Prioritize INT-01 and INT-02 in Week 1 |

---

## 11. Definition of Done (DoD) for Sprint 3

A story is considered **DONE** when:

1. ✅ Code is implemented in the `sprint-3` branch and merged to `main`.
2. ✅ It has been reviewed by at least one other team member (peer review).
3. ✅ The database has the necessary tables, FKs, and RLS for the story.
4. ✅ Test data exists to demonstrate the functionality.
5. ✅ Gherkin acceptance criteria are met (manually tested).
6. ✅ The flow works in Chrome/Edge without console errors.
7. ✅ The story has been demonstrated to the Product Owner (Daniel López Cabrera).
8. ✅ No critical bugs block the main user flow.

**General sprint criterion:**
A person with any role (End User, Pilot, Driver, Administrator) can complete their main flow without errors.

---

## 12. Expected Sprint 3 Deliverables

| Deliverable | Expected Location |
|-------------|-------------------|
| 23 user stories implemented | Repository `main` branch |
| Full frontend ↔ Supabase connection | Repository `/frontend/js` |
| Complete test data (flights, routes, employees, users) | Supabase Project |
| RLS configured for all roles | Supabase Project |
| End User flow: registration → login → flight search → seat selection → payment → PDF | Repository `/frontend` |
| Pilot flow: view assigned flights → view manifest → update status | Repository `/frontend` |
| Driver flow: view daily trips → view passengers → update status | Repository `/frontend` |
| Administrator flow: CRUD flights, routes, staff, reports, cancellations | Repository `/frontend` |
| Updated documentation | Repository `/docs/sprints` |

---

*Flying With You — CBTis 47 · Sprint Backlog 3 (May 11 – June 12, 2026)*
