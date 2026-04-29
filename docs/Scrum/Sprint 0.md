# Sprint 0 — Flygth With You
**Period:** February 2026
**Institution:** CBTis 47
**Methodology:** Scrum

---

## 1. Sprint 0 Goal

Define the overall project scope, form the work team, establish the first collaboration agreements, and identify the functional areas that will be developed throughout the project.

This sprint is exclusively dedicated to **planning**. No code is written and no testing is performed. The deliverable is an aligned team with a clear vision of what is going to be built.

---

## 2. Team

| Name | Role |
|---|---|
| López Cabrera Daniel | Product Owner / Analyst & Designer |
| García Sánchez German | Scrum Master / SQL Developer |
| Cueto Madrigal Michelle | Developer — Query Master |
| Cruz Estrada Johana Elena | Developer — SQL Tester |
| Roldan Barrera Edson Yalan | Developer — DBA |

---

## 3. Project Overview

### Name
**Flygth With You**

### What is it?
A web-based tourism reservation system developed for a travel agency. It will allow users to register, search and book flights or tourist trolleybus routes, complete a simulated payment, and obtain a downloadable PDF ticket.

### Who is it for?
Users of a travel agency who currently handle their reservations manually. The system aims to automate that process and improve the end-user experience.

### Product Goal
To develop a functional web application that automates the tourism service reservation process — from user registration to the issuance of a payment receipt — ensuring a simple and accessible experience.

---

## 4. Selected Technologies

| Component | Technology | Reason |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript | No frameworks — compatible with the school's environment |
| Database & Authentication | Supabase (PostgreSQL + Auth) | Data and session management without a custom backend |
| PDF Generation | jsPDF (via CDN) | Ticket download directly from the browser |
| Version Control | Git + GitHub | Collaboration and individual contribution tracking |

> No frontend framework or package manager will be used. All external dependencies will be loaded via CDN directly inside the HTML files.

---

## 5. Identified Epics

The following functional areas were identified during the initial planning session. Each epic groups a set of related features that will be developed in upcoming sprints.

| ID | Epic | General Description | Priority |
|---|---|---|---|
| EP-01 | Authentication | User registration, login, and logout | High |
| EP-02 | Flight Reservation | Flight search, seat selection, and confirmation | High |
| EP-03 | Trolleybus Reservation | Route browsing and reservation creation | High |
| EP-04 | Payment Processing | Simulated payment flow with status update | High |
| EP-05 | PDF Ticket | Reservation accumulation and receipt download | Medium |

> The specific user stories for each epic will be defined and estimated in Sprint 1.

---

## 6. Project Scope

### In Scope (v1.0)
- User registration, login, and logout
- Flight search and reservation with visual seat selection
- Tourist trolleybus route reservation
- Simulated payment with reservation status update
- PDF ticket download (one time per ticket)

### Out of Scope (v1.0)
- Real payment gateway integration
- Native mobile application
- Agency admin panel
- Email notification system
- Real-time seat map synchronization between simultaneous sessions

---

## 7. Initial Team Agreements

These agreements were established at the beginning of Sprint 0 and apply for the entire duration of the project:

- All code lives in GitHub. No direct commits to the `main` branch.
- Each team member commits under their own GitHub account. A repository with a single author is not acceptable.
- Working branches follow the format: `feature/feature-name`.
- The Product Backlog is the Product Owner's responsibility and must be updated before each Sprint Planning.
- If anyone detects a technical or organizational impediment, they communicate it to the team the same day.

---

## 8. Open Questions at the Close of Sprint 0

During planning, several points came up that the team had not yet fully resolved. These will be addressed in Sprint 1:

- How exactly are the flight and seat tables structured in the database?
- Is the 10-minute reservation timer controlled only in the browser, or also in the database?
- How is the case handled where two users try to book the same seat at the same time?
- How many test scenarios does each user story need?

---

## 9. Next Step

**Sprint 1** will build on what was defined in this sprint and move forward on two fronts: normalizing the database schema and drafting the user stories with their initial acceptance criteria.

---
