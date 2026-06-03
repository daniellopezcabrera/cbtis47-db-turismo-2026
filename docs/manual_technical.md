# Technical Manual — Flying With You

**Project:**  Hybrid Transportation System

**Institution:** CBTis 47

**Course:** Relational Database

**Version:** 1.0.0

**Date:** February-June 2026

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Entity-Relationship Diagram](#2-entity-relationship-diagram)
3. [Key JOINs and Aggregates](#3-key-joins-and-aggregates)
4. [Security Policy and Permissions](#4-security-policy-and-permissions)
5. [Backup and Restore](#5-backup-and-restore)
6. [How to Run the Queries](#6-how-to-run-the-queries)

## 1. Project Overview

**Flying With You** is a web-based reservation management system developed for 
a travel agency as part of the academic curriculum of CBTis 47. The system 
automates the complete tourist service reservation cycle — from user 
registration to the issuance of a downloadable PDF payment receipt — reducing 
manual workload and improving the traveler's experience.

Although the project is titled *Flying With You*, the system scope extends 
beyond air travel. The database manages two distinct transportation modes: 
**commercial flights** between airports, and **tourist trolleybus trips** along 
predefined routes with scheduled stops.

### System Scope

The database supports the following functional domains:

- **User management:** registration, authentication, and role separation 
  between end users and internal employees.
- **Flight operations:** airports, airplane models, aircraft assignments, 
  scheduled flights, and incident reporting.
- **Trolleybus operations:** routes, bus stations, stop ordering, abstract 
  route schedules, and concrete trip instances.
- **Reservation lifecycle:** seat selection with a 10-minute expiration window, 
  status transitions (`pending → confirmed → expired / cancelled`), and 
  duplicate prevention.
- **Payment processing:** support for cash, card, and bank transfer, with 
  fields for refund tracking and card security.
- **Ticket generation:** accumulation of confirmed reservations into a single 
  downloadable PDF, restricted to one download per ticket.

### Technical Stack

| Layer | Technology |
|---|---|
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| PDF generation | jsPDF (via CDN) |
| Version control | Git / GitHub |

> All monetary values in the system are denominated in **Mexican Pesos (MXN)**.  
> This project was developed exclusively for academic use and is not intended 
> for production deployment.

### Design Principles

The database schema was designed following **Third Normal Form (3NF)** with a 
strict separation-of-concerns approach. Key architectural decisions include:

- Splitting flight and trolleybus bookings into independent tables 
  (`FLIGHT_BOOKING`, `TROLLEY_BOOKING`) to avoid polymorphic ambiguity.
- Separating abstract scheduling (`TROLLEY_ROUTE_SCHEDULE`) from concrete trip 
  instances (`TROLLEY_TRIP`) to support recurring routes without data 
  duplication.
- Using surrogate primary keys (`AUTO_INCREMENT`) across all entities for 
  referential integrity.
- Enforcing reservation expiration logic server-side through `expires_at` 
  timestamps, with the frontend limited to visual countdown display only.
