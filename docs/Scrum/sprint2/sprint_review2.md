# Sprint Review 2 — Flying With You
**Period:** March 31 – May 8, 2026 (5 weeks)
**Institution:** CBTis 47
**Review Date:** May 8, 2026

---

## 1. Sprint Summary

| Concept | Value |
|---------|-------|
| Planned Story Points | 34 points |
| Completed Story Points | 28 points |
| Completion Rate | ≈82% |
| Planned Tasks | 26 |
| Completed Tasks | 19 |
| Partial Tasks | 2 |
| Pending Tasks | 5 |
| Hours Used | 280 h out of 300 h available |
| Actual Velocity | 5.6 SP/week |

---

## 2. Task Status

| ID | Story | Category | SP | Owner | Status |
|----|-------|----------|----|-------|--------|
| DB-01 | Create Supabase project and configure authentication | DB | 2 | German | ✅ Completed |
| DB-02 | Create PERSON table with all defined columns | DB | 2 | Edson | ✅ Completed |
| DB-03 | Create USER table (linked to Supabase Auth) | DB | 2 | Edson | ✅ Completed |
| DB-04 | Create AIRPORT, AIRPLANE_MODEL, AIRPLANE, FLIGHT tables | DB | 3 | German | ✅ Completed |
| DB-05 | Create FLIGHT_BOOKING and BOOKING_SEAT tables | DB | 2 | Michelle | ✅ Completed |
| DB-06 | Create trolleybus tables (ROUTE, BUS_STATION, ROUTE_STOP) | DB | 2 | Johana | ✅ Completed |
| DB-07 | Create TROLLEY_MODEL, TROLLEY, TROLLEY_TRIP tables | DB | 2 | Johana | ✅ Completed |
| DB-08 | Create TROLLEY_BOOKING and TICKET tables | DB | 2 | Michelle | ✅ Completed |
| DB-09 | Create PAYMENT table with optional FKs | DB | 2 | German | ✅ Completed |
| DB-10 | Define RLS security policies in Supabase | DB | 3 | Edson | ❌ Pending (S3) |
| UI-01 | Mockup user registration page (HTML/CSS) | UI | 2 | Daniel | ✅ Completed |
| UI-02 | Mockup login page | UI | 1 | Daniel | ✅ Completed |
| UI-03 | Mockup main dashboard | UI | 2 | Daniel | ✅ Completed |
| UI-04 | Mockup flight search page | UI | 2 | Michelle | ✅ Completed |
| UI-05 | Mockup seat map (visual only, no logic) | UI | 3 | Michelle | ✅ Completed |
| UI-06 | Mockup trolleybus route listing | UI | 2 | Johana | ✅ Completed |
| UI-07 | Mockup simulated payment screen | UI | 2 | Johana | ✅ Completed |
| UI-08 | Mockup ticket screen with PDF download button | UI | 2 | Daniel | ✅ Completed |
| DATA-01 | Insert test data: airports | DATA | 1 | German | ✅ Completed |
| DATA-02 | Insert test data: airplane models and airplanes | DATA | 1 | German | ✅ Completed |
| DATA-03 | Insert test data: flights | DATA | 2 | Michelle | ⚠️ Partial |
| DATA-04 | Insert test data: trolleybus routes | DATA | 2 | Johana | ⚠️ Partial |
| DATA-05 | Insert test data: test users | DATA | 1 | Edson | ✅ Completed |
| INT-01 | Connect registration form to Supabase Auth | INT | 3 | Team | ❌ Pending (S3) |
| INT-02 | Connect login form to Supabase Auth | INT | 2 | Team | ❌ Pending (S3) |
| INT-03 | Load flights from database into the search page | INT | 3 | Team | ❌ Pending (S3) |

---

## 3. Sprint 2 Deliverables

| Deliverable | Status | Location |
|-------------|--------|----------|
| Database in Supabase (all tables created) | ✅ Completed | Supabase Project |
| Partial test data (airports, airplanes, users) | ⚠️ Partial | Corresponding tables in Supabase |
| First draft of HTML/CSS interfaces (8 screens) | ✅ Completed | Repository `/frontend` |
| DB-Frontend connection | ❌ Not completed | Pending Sprint 3 |
| Sprint documentation | ✅ Completed | Repository `/docs/sprints` |

---

## 4. Planned vs. Actual

| Concept | Planned | Actual | Difference |
|---------|---------|--------|------------|
| Story Points completed | 34 | 28 | −6 SP |
| Tasks completed | 26 | 19 | −7 tasks |
| Hours used | 300 h | 280 h | −20 h |
| Actual velocity | — | 5.6 SP/week | Below expectations |

**Main causes of deviation:**
- Unforeseen complexity in the DB-Frontend connection.
- Supabase RLS configuration proved more complex than estimated.
- The team was unfamiliar with the Supabase JS client at the start of the sprint, resulting in unplanned research time.

---

## 5. Pending Tasks (Carried over to Sprint 3)

| ID | Task | Priority | Justification |
|----|------|----------|---------------|
| DB-10 | RLS policies in Supabase | High | Requires additional research on role-based security |
| DATA-03 | Insert remaining flights | High | Not completed due to FK complexity and insufficient time |
| DATA-04 | Insert remaining trolleybus routes | High | Not completed due to insufficient time |
| INT-01 | Connect registration to Supabase Auth | High | Team was not familiar with the Supabase JS client |
| INT-02 | Connect login to Supabase Auth | High | Depends on INT-01 |
| INT-03 | Dynamically load flights from database | High | Depends on INT-01 and INT-02 |

---

## 6. Retrospective (Sprint 2)

**What went well:**
- All database tables were created according to the Sprint 1 ER model.
- The visual interfaces are ready to receive real data in Sprint 3.
- The team learned the basics of Supabase and its administration panel.

**What went wrong:**
- The complexity of RLS and the DB-Frontend connection was underestimated.
- Test data was not completed due to time constraints and FK complexity.
- The team lacked key Supabase knowledge that affected productivity.

**What to improve for Sprint 3:**
- Hold a Supabase JS Client training session before starting integration tasks.
- Distribute the data insertion workload from Week 1 instead of leaving it for the end.
- Reserve one buffer day per week for unexpected technical issues.

---

## 7. Commitment for Sprint 3

The team commits to:
1. Completing the frontend-Supabase connection (INT-01, INT-02, INT-03).
2. Inserting the missing test data (flights and trolleybus routes).
3. Implementing basic RLS policies by role.
4. Implementing all 23 user stories with full logic.
5. Having a complete end-to-end flow: registration → login → flight search → seat selection → payment → PDF.

---

*Flying With You — CBTis 47 · Sprint Review 2 (May 8, 2026)*
