# Technical Summary — Flygth With You

**Version:** 1.0
**Date:** April 2026
**Status:** Draft

---

## 1. General Description

**Flygth With You** is a web-based reservation management system for a tourism agency. It allows users to register, log in, search and book flights or tourist trolleybus trips, process payments, and download their ticket as a PDF for printing.

---

## 2. System Objective

To develop a functional web application that automates the process of booking tourism services, from user registration to the issuance of a payment receipt, ensuring a simple and accessible experience.

---

## 3. Technologies Used

| Component | Technology |
|---|---|
| Database and authentication | Supabase (PostgreSQL) |
| Frontend | HTML5, CSS3, JavaScript |
| PDF generation | JS library (e.g. jsPDF) |
| Version control | To be defined (e.g. GitHub) |

---

## 4. System Modules

### 4.1 Authentication
The system will include new user registration and login functionality. Authentication will be managed through Supabase Auth.

### 4.2 Flight Reservation
Users will be able to search for available flights by origin, destination, and date, select a flight, and choose a seat. Available seats will be displayed in green and occupied seats in red. The system will record the reservation with a pending status until payment is confirmed. During this time, a 10-minute countdown timer will run; if it expires before payment, the reservation is automatically cancelled and the seats are released.

### 4.3 Tourist Trolleybus Reservation
Users will be able to browse available trolleybus routes, select a date and location, and generate a reservation under the same conditions as flight bookings.

### 4.4 Payment
Once a reservation is created, the user will proceed to payment within the system. Upon confirmation, the reservation status will change to confirmed.

### 4.5 PDF Ticket Generation
After payment is confirmed, the system will allow the user to download a PDF ticket containing the reservation details. The ticket accumulates reservations — additional bookings can be added using the "Add" button, and the ticket is finalized and downloaded by pressing the "Download" button. Each ticket is available for download only once.

---

## 5. Development Team

| Name | Role |
|---|---|
| López Cabrera Daniel | [Role] |
| García Sánchez German | [Role] |
| Cueto Madrigal Michelle | [Role] |
| Cruz Estrada Johana Elena | [Role] |
| Roldan Barrera Edson Yalan | [Role] |

---

## 6. General Timeline

The detailed schedule can be found in the Sprint Backlog of this project.

---

## 7. Scope and Limitations

### In scope
- User registration and login
- Flight and trolleybus reservation and payment
- PDF ticket download (once per ticket)

### Out of scope (for now)
- Real payment gateway (will be simulated)
- Native mobile app
- Advanced admin panel# Technical Summary — Flygth With You

**Version:** 1.0
**Date:** April 2026
**Status:** Draft

---

## 1. General Description

**Flygth With You** is a web-based reservation management system for a tourism agency. It allows users to register, log in, search and book flights or tourist trolleybus trips, process payments, and download their ticket as a PDF for printing.

---

## 2. System Objective

To develop a functional web application that automates the process of booking tourism services, from user registration to the issuance of a payment receipt, ensuring a simple and accessible experience.

---

## 3. Technologies Used

| Component | Technology |
|---|---|
| Database and authentication | Supabase (PostgreSQL) |
| Frontend | HTML5, CSS3, JavaScript |
| PDF generation | JS library (e.g. jsPDF) |
| Version control | To be defined (e.g. GitHub) |

---

## 4. System Modules

### 4.1 Authentication
The system will include new user registration and login functionality. Authentication will be managed through Supabase Auth.

### 4.2 Flight Reservation
Users will be able to search for available flights by origin, destination, and date, select a flight, and choose a seat. Available seats will be displayed in green and occupied seats in red. The system will record the reservation with a pending status until payment is confirmed. During this time, a 10-minute countdown timer will run; if it expires before payment, the reservation is automatically cancelled and the seats are released.

### 4.3 Tourist Trolleybus Reservation
Users will be able to browse available trolleybus routes, select a date and location, and generate a reservation under the same conditions as flight bookings.

### 4.4 Payment
Once a reservation is created, the user will proceed to payment within the system. Upon confirmation, the reservation status will change to confirmed.

### 4.5 PDF Ticket Generation
After payment is confirmed, the system will allow the user to download a PDF ticket containing the reservation details. The ticket accumulates reservations — additional bookings can be added using the "Add" button, and the ticket is finalized and downloaded by pressing the "Download" button. Each ticket is available for download only once.

---

## 5. Development Team

| Name | Role |
|---|---|
| López Cabrera Daniel | [Role] |
| García Sánchez German | [Role] |
| Cueto Madrigal Michelle | [Role] |
| Cruz Estrada Johana Elena | [Role] |
| Roldan Barrera Edson Yalan | [Role] |

---

## 6. General Timeline

The detailed schedule can be found in the Sprint Backlog of this project.

---

## 7. Scope and Limitations

### In scope
- User registration and login
- Flight and trolleybus reservation and payment
- PDF ticket download (once per ticket)

### Out of scope (for now)
- Real payment gateway (will be simulated)
- Native mobile app
- Advanced admin panel
