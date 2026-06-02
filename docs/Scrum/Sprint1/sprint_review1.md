# Sprint Review 1 — Flying With You
**Period:** February – March 2026 (6 weeks)
**Institution:** CBTis 47
**Review Date:** March 2026
**Product Owner:** Daniel López Cabrera

---

## 1. Sprint Summary

| Concept | Value |
|---------|-------|
| Planned Story Points | 21 points |
| Completed Story Points | 21 points |
| Completion Rate | 100% |
| Planned Tasks | 10 |
| Completed Tasks | 10 |
| Pending Tasks | 0 |
| Days used | ~11 effective days out of 27 available |
| Actual Velocity | ~2 SP/week (design sprint) |

---

## 2. Task Status

| ID | Story | Epic | SP | Owner | Status |
|----|-------|------|----|-------|--------|
| US-01 | User Registration | EP-01 | 2 | Edson | ✅ Completed |
| US-02 | User Login | EP-01 | 1 | Edson | ✅ Completed |
| US-03 | User Logout | EP-01 | 0 | — | N/A (no data impact) |
| US-04 | Flight Search | EP-02 | 3 | German | ✅ Completed |
| US-05 | Seat Selection | EP-02 | 3 | Michelle | ✅ Completed |
| US-06 | Confirm Reservation | EP-02 | 2 | Michelle | ✅ Completed |
| US-07 | Browse Trolleybus Routes | EP-03 | 2 | Johana | ✅ Completed |
| US-08 | Trolleybus Reservation | EP-03 | 2 | Johana | ✅ Completed |
| US-09 | Payment | EP-04 | 2 | German | ✅ Completed |
| US-10 | Add to Ticket | EP-05 | 2 | Daniel | ✅ Completed |
| US-11 | Download PDF | EP-05 | 2 | Daniel | ✅ Completed |

---

## 3. Sprint 1 Deliverables

| Deliverable | Status | Location |
|-------------|--------|----------|
| Complete ER diagram (all tables, PKs, FKs) | ✅ Completed | Repository `/docs/er-diagram` |
| Normalized model in 3NF | ✅ Completed | Repository `/docs` |
| Data dictionary (tables and columns) | ✅ Completed | Repository `/docs/dictionary` |
| Defined naming conventions | ✅ Completed | Repository `/docs` |
| Sprint documentation | ✅ Completed | Repository `/docs/sprints` |

---

## 4. Planned vs. Actual

| Concept | Planned | Actual | Difference |
|---------|---------|--------|------------|
| Story Points completed | 21 | 21 | 0 SP |
| Tasks completed | 10 | 10 | 0 tasks |
| Days used | 27 | ~11 effective days | Sprint completed ahead of schedule |
| Actual velocity | — | ~2 SP/week (design) | Consistent with sprint scope |

**Notes:**
- The sprint was completed ahead of schedule due to the nature of design work, which does not require the full 27 days when the team is aligned.
- No Story Points were left incomplete.

---

## 5. Impediments Encountered

| Type | Description | Impact | Resolution |
|------|-------------|--------|------------|
| **Impediment** | Uncertainty about whether to include a separate SEAT table or a seat_number field in BOOKING_SEAT | Initial delay in US-05 modeling | Resolved in team meeting: seat_number field chosen for simplicity (deferred to Sprint 2) |
| **Impediment** | Confusion with double FKs in FLIGHT (origin and destination both point to AIRPORT) | Inconsistency in ER diagram | Documented in naming conventions and validated with examples |
| **Dependency** | Professor/Product Owner approval of the 3NF model | Could not advance to Sprint 2 without validation | Submitted for review at the end of Week 2; approved without major corrections |

---

## 6. Retrospective (Sprint 1)

**What went well:**
- The data model was completed within the estimated time.
- The team resolved design uncertainties (double FKs, SEAT table) through internal meetings.
- The ER diagram was approved by the Product Owner without major corrections.

**What went wrong:**
- The uncertainty about the SEAT table caused an initial delay in US-05.
- Not all team members had the same level of knowledge in normalization at the start of the sprint.

**What to improve for Sprint 2:**
- Hold a technical leveling session at the start of the sprint.
- Define design questions before starting modeling, not during.
- Assign clear owners from day one.

---

## 7. Commitment for Sprint 2

The team commits to:
1. Implementing the approved data model in Supabase (creating all tables with their constraints).
2. Designing the first interfaces in HTML/CSS for stories US-01 to US-11.
3. Manually inserting test data into the main tables.
4. Starting the connection between the frontend and Supabase.

---

*Flying With You — CBTis 47 · Sprint Review 1 (March 2026)*
