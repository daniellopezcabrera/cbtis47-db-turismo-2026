# Sprint Backlog 1 — Flying With You
**Period:** February – March 2026 (6 weeks)
**Institution:** CBTis 47
**Previous Sprint:** N/A (first sprint of the project)

---

## 1. Sprint Goal

**Deliver the complete and validated data model for the Flying With You system.**
By the end of the sprint, the team must have: (1) an Entity-Relationship (ER) diagram in 3NF, (2) a data dictionary with all tables and columns, and (3) defined naming conventions.
No code or real database is built in this sprint.

---

## 2. Sprint Data

| Concept | Value |
|---------|-------|
| Duration | 6 weeks |
| Working days per week | 4–5 days |
| Total working days | 27 days |
| Effective hours per day | 3 hours |
| **Total sprint capacity** | **405 hours** (27 days × 3 h × 5 members) |
| Planned Story Points | 21 points |

---

## 3. Initial Product Backlog (11 User Stories)

At the start of Sprint 1, the Product Backlog contained **11 user stories**, all belonging to end-user epics:

- EP-01 · User Authentication (US-01, US-02, US-03)
- EP-02 · Flight Reservation (US-04, US-05, US-06)
- EP-03 · Tourist Trolleybus Reservation (US-07, US-08)
- EP-04 · Payment Processing (US-09)
- EP-05 · PDF Ticket Generation (US-10, US-11)

In this sprint **only the data layer** of each story will be worked on: required tables, relationships, and constraints. No code will be written and no connection to Supabase will be made.

---

## 4. Sprint Backlog — Stories Assigned to Sprint 1

| ID | Story | Epic | Priority | SP | Owner |
|----|-------|------|----------|----|-------|
| US-01 | User Registration | EP-01 | High | 2 | Edson |
| US-02 | User Login | EP-01 | High | 1 | Edson |
| US-03 | User Logout | EP-01 | Medium | 0 | — |
| US-04 | Flight Search | EP-02 | High | 3 | German |
| US-05 | Seat Selection | EP-02 | High | 3 | Michelle |
| US-06 | Confirm Reservation | EP-02 | High | 2 | Michelle |
| US-07 | Browse Trolleybus Routes | EP-03 | High | 2 | Johana |
| US-08 | Trolleybus Reservation | EP-03 | High | 2 | Johana |
| US-09 | Payment | EP-04 | High | 2 | German |
| US-10 | Add to Ticket | EP-05 | Medium | 2 | Daniel |
| US-11 | Download PDF | EP-05 | Medium | 2 | Daniel |

---

## 5. Design Tasks by Epic

> **Total hours distribution:** 405 hours
> **Hour base:** 1 SP ≈ 5 hours (405h / 81h of direct modeling)
> Each task represents modeling work: identifying entities, attributes, relationships, and constraints.

---

### EP-01 · User Authentication

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| US-01 | Identify PERSON and USER entities. Define attributes (CURP, name, email). Establish 1:1 relationship. | 2 | 6 h | Edson |
| US-02 | Verify the model supports authentication. Decide whether to store passwords in tables. | 1 | 4 h | Edson |
| US-03 | No impact on data model (session only). | 0 | — | — |
| **EP-01 Subtotal** | | **3 SP** | **10 h** | |

---

### EP-02 · Flight Reservation

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| US-04 | Create FLIGHT, AIRPORT, AIRPLANE, AIRPLANE_MODEL entities. Define FKs (origin and destination both point to AIRPORT). | 3 | 7 h | German |
| US-05 | Model BOOKING_SEAT with expires_at. Decide between a separate SEAT table or a seat_number field. | 3 | 7 h | Michelle |
| US-06 | Define FLIGHT_BOOKING and its relationship with BOOKING_SEAT. Establish status (pending/confirmed/cancelled). | 2 | 6 h | Michelle |
| **EP-02 Subtotal** | | **8 SP** | **20 h** | |

---

### EP-03 · Tourist Trolleybus Reservation

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| US-07 | Create ROUTE, ROUTE_STOP, BUS_STATION entities. Define stop order. | 2 | 6 h | Johana |
| US-08 | Model TROLLEY_BOOKING with date, status, and timer. | 2 | 6 h | Johana |
| **EP-03 Subtotal** | | **4 SP** | **12 h** | |

---

### EP-04 · Payment Processing

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| US-09 | Create PAYMENT entity with last_four_digits (no full card number). Decide nullable FK for flight or trolleybus. | 2 | 6 h | German |
| **EP-04 Subtotal** | | **2 SP** | **6 h** | |

---

### EP-05 · PDF Ticket Generation

| Task | Description | SP | Estimated Hours | Owner |
|------|-------------|----|-----------------|-------|
| US-10 | Model TICKET as a header-detail table. Define relationship with confirmed reservations. | 2 | 6 h | Daniel |
| US-11 | Add downloaded_at or download_count field in TICKET to block second download. | 2 | 6 h | Daniel |
| **EP-05 Subtotal** | | **4 SP** | **12 h** | |

---

## 6. Hours Summary by Team Member

> **Individual capacity:** 3 hours/day × 27 working days = **81 hours per member**
> **Total team capacity:** 81 h × 5 members = **405 hours**

| Member | Direct Modeling | Research & Normalization | Reviews & Corrections | Team Meetings | **Total** |
|--------|-----------------|--------------------------|-----------------------|---------------|-----------|
| Daniel | 12 h | 30 h | 25 h | 14 h | **81 h** |
| Michelle | 13 h | 28 h | 26 h | 14 h | **81 h** |
| Johana | 12 h | 29 h | 26 h | 14 h | **81 h** |
| Edson | 10 h | 31 h | 26 h | 14 h | **81 h** |
| German | 13 h | 29 h | 25 h | 14 h | **81 h** |
| **Total** | **60 h** | **147 h** | **128 h** | **70 h** | **405 h** |

> **Note:** The 60 hours of direct modeling represent the work documented task by task. The remaining 345 hours reflect time allocated for normalization research (3NF, conventions), peer reviews, ER diagram corrections, and team meetings — activities typical of a design sprint that are not broken down per task but are part of the total capacity.

---

## 7. Weekly Workload Estimate

| Week | Main Focus | Planned SP | Team Members |
|------|------------|------------|--------------|
| Week 1 (Feb) | EP-01: modeling PERSON and USER | ~3 | Edson |
| Week 2 (Feb) | EP-02: modeling FLIGHT, AIRPORT, AIRPLANE, AIRPLANE_MODEL | ~5 | German, Michelle |
| Week 3 (Mar) | EP-02 close + EP-03: trolleybus | ~5 | Michelle, Johana |
| Week 4 (Mar) | EP-04: payment + EP-05: ticket and PDF | ~4 | German, Daniel |
| Week 5 (Mar) | 3NF review, normalization and data dictionary | ~2 | Full team |
| Week 6 (Mar) | Delivery to Product Owner + final corrections | ~2 | Full team |

---

## 8. Impediments and Dependencies

| Type | Description | Expected Impact | Mitigation Plan |
|------|-------------|-----------------|-----------------|
| **Risk** | Uncertainty about whether to include a separate SEAT table or a seat_number field in BOOKING_SEAT | May delay US-05 modeling | Resolve in a team meeting before starting US-05 |
| **Risk** | Potential confusion with double FKs in FLIGHT (origin and destination both pointing to AIRPORT) | Inconsistency in ER diagram | Document clearly in naming conventions and validate with examples |
| **Dependency** | Professor/Product Owner approval of the 3NF model | Cannot advance to Sprint 2 without validation | Submit for review by the end of Week 2 |

---

## 9. Definition of Done (DoD) for Sprint 1

A story is considered **DONE** when:

1. ✅ The ER diagram is drawn (digital or paper) showing all tables, columns, PKs, and FKs.
2. ✅ Normalization has been verified up to 3NF (no transitive or partial dependencies).
3. ✅ The data dictionary is complete with: table name, column, data type, and constraints (NOT NULL, UNIQUE, etc.).
4. ✅ The task has been reviewed by at least one other team member (peer review).
5. ✅ Documentation is updated and reflects the final state of the model.
6. ✅ The model has been presented to and approved by the Product Owner (Daniel López Cabrera).

**General sprint criterion:**
The data model is complete, consistent, and ready to move directly into the implementation phase (SQL and Supabase) in Sprint 2.

---

## 10. Expected Sprint 1 Deliverables

| Deliverable | Expected Location |
|-------------|-------------------|
| Complete ER diagram (all tables, PKs, FKs) | Repository `/docs/er-diagram` |
| Normalized model in 3NF | Repository `/docs` |
| Data dictionary (tables and columns) | Repository `/docs/dictionary` |
| Defined naming conventions | Repository `/docs` |
| Sprint documentation | Repository `/docs/sprints` |

---

*Flying With You — CBTis 47 · Sprint Backlog 1 (February – March 2026)*
