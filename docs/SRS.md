## 1. Functional Requirements (Agile & UI/UX)
Functional requirements describe **what the system must do** — the specific behaviors and features it must provide to its users.
 
---
 
### 1.1 Authentication
 
**FR-01.** The system must allow new users to register by providing their full name, email address, and password.
 
**FR-02.** The system must validate that the email entered during registration is not already associated with an existing account.
 
**FR-03.** The system must display a validation message for each required field left empty when a form is submitted.
 
**FR-04.** The system must authenticate users through Supabase Auth using email and password.
 
**FR-05.** The system must redirect the user to the home dashboard after a successful login.
 
**FR-06.** The system must allow users to close their active session at any time.
 
**FR-07.** After logout, the system must prevent access to protected pages without the user re-authenticating.
 
---
 
### 1.2 Flight Reservation
 
**FR-08.** The system must allow users to search for available flights by origin, destination, and travel date.
 
**FR-09.** The system must display a list of available flights with schedule and price information when a search returns results.
 
**FR-10.** The system must inform the user when no flights match the selected search criteria.
 
**FR-11.** The system must display a visual seat map for the flight selected by the user.
 
**FR-12.** Available seats must be displayed in green; occupied or reserved seats must be displayed in red.
 
**FR-13.** The system must prevent users from selecting occupied or reserved seats.
 
**FR-14.** Upon seat confirmation, the system must create a reservation record in the database with status "pending".
 
**FR-15.** Upon reservation creation, the system must start and display a 10-minute countdown timer to the user.
 
**FR-16.** If the timer reaches zero before payment is completed, the system must automatically cancel the reservation and release the seat.
 
**FR-17.** The system must prevent the same user from having more than one active reservation for the same flight at the same time.
 
---
 
### 1.3 Trolleybus Reservation
 
**FR-18.** The system must display all available trolleybus routes with their name, description, and departure location.
 
**FR-19.** The system must inform the user if no trolleybus routes are currently available.
 
**FR-20.** The system must allow the user to select a route, a date, and a boarding stop to create a reservation.
 
**FR-21.** Upon trolleybus reservation creation, the system must assign status "pending" and start the 10-minute countdown timer.
 
**FR-22.** The system must inform the user if the selected date has no available slots for the chosen route.
 
**FR-23.** If the timer expires before payment, the system must cancel the trolleybus reservation and restore the slot's availability.
 
---
 
### 1.4 Payment
 
**FR-24.** The system must allow users to complete a simulated payment for a pending reservation.
 
**FR-25.** Upon successful payment, the system must update the reservation status from "pending" to "confirmed".
 
**FR-26.** The system must redirect the user to the ticket screen after payment is confirmed.
 
**FR-27.** The system must reject payment attempts if the reservation timer has already expired.
 
**FR-28.** If a payment processing error occurs, the reservation must remain in "pending" status and the timer must continue running.
 
---
 
### 1.5 PDF Ticket Generation
 
**FR-29.** The system must allow users to add one or more confirmed reservations to a single ticket.
 
**FR-30.** The system must prevent reservations with "pending" status from being added to a ticket.
 
**FR-31.** The system must generate a downloadable PDF file containing the details of all accumulated reservations.
 
**FR-32.** The PDF must include: flight or route name, seat number, travel date, and passenger full name.
 
**FR-33.** Each ticket may only be downloaded once; subsequent download attempts must be blocked with an explanatory message.
 
**FR-34.** If no reservations have been added to the ticket, the system must prevent the download and display a validation message.
 
---
 
## 2. Agile Requirements
 
Agile requirements define **how the development process must be organized and conducted** under the Scrum methodology.
 
**AG-01.** The project must be organized into Sprints of fixed duration, each with a defined and achievable goal.
 
**AG-02.** Each Sprint must begin with a planning session where the team selects User Stories from the Product Backlog.
 
**AG-03.** Every User Story must follow the format: *As a [user type], I want to [action], so that [benefit]*.
 
**AG-04.** Every User Story must have acceptance criteria written in Gherkin format (Given / When / Then).
 
**AG-05.** Every User Story must have an estimated Story Point value assigned before development begins.
 
**AG-06.** The team must maintain a Product Backlog ordered by priority (High / Medium / Low).
 
**AG-07.** At the end of each Sprint, the team must hold a Sprint Review demonstrating the completed functionality.
 
**AG-08.** All source code must be version-controlled with Git and hosted on GitHub.
 
**AG-09.** Each team member must commit their own work under their own GitHub account — repositories with a single author are not acceptable.
 
**AG-10.** Project documentation (Technical Summary, Backlog, Requirements) must be kept up to date in the repository.
 
---
 
## 3. UI/UX Requirements
 
UI/UX requirements define **how the interface must look and behave** to ensure a clear and usable experience for all users.
 
---
 
### 3.1 General Interface
 
**UX-01.** The application must have a consistent visual identity across all pages: colors, typography, and logo.
 
**UX-02.** All pages must be responsive and adapt correctly to desktop screen sizes.
 
**UX-03.** Navigation between the main sections (flights, trolleybus, tickets) must be accessible from a persistent top menu.
 
**UX-04.** All buttons that trigger a system action must have a visible label describing that action (e.g. "Confirm reservation").
 
**UX-05.** The system must display a loading indicator during any operation that requires waiting for a server response.
 
---
 
### 3.2 Forms and Validation
 
**UX-06.** Required fields in all forms must be clearly marked.
 
**UX-07.** Validation messages must appear directly below the field that failed, not as a generic pop-up.
 
**UX-08.** Passwords must be hidden by default, with an option to reveal them during input.
 
**UX-09.** The user must receive a visible confirmation message after successfully completing registration or login.
 
---
 
### 3.3 Seat Map
 
**UX-10.** The seat map must display each seat's label (e.g. "12A") when the user hovers over or taps a seat.
 
**UX-11.** Selected seats must have a distinct visual state (e.g. blue), separate from available (green) and occupied (red).
 
**UX-12.** A legend must be visible near the seat map explaining the meaning of each color.
 
---
 
### 3.4 Timer and Status Feedback
 
**UX-13.** The 10-minute countdown timer must be permanently visible during the payment flow and must not be collapsible or hidden.
 
**UX-14.** When fewer than 2 minutes remain on the timer, a visual warning must alert the user (e.g. the timer turns red).
 
**UX-15.** When a reservation expires, the user must be notified immediately with a clear message and a prompt explaining how to start a new reservation.
 
**UX-16.** The reservation status (pending / confirmed / expired) must be visible to the user at all times within the reservation summary.
 
---
 
### 3.5 Ticket and PDF
 
**UX-17.** The ticket screen must show a preview of all accumulated reservations before the user clicks "Download".
 
**UX-18.** The "Download" button must be disabled (grayed out) if no reservations have been added to the ticket.
 
**UX-19.** After a successful download, the button must change its label to "Ticket already issued" and remain permanently disabled.
---
## 2. Non-Functional Requirements
 
Non-functional requirements define **how well the system must perform** — quality attributes that are not visible features but directly affect reliability, security, and the overall user experience.
 
---
 
### 2.1 Performance
 
**NFR-01.** Flight and trolleybus search results must load in under 3 seconds under normal network conditions.
 
**NFR-02.** The seat map must render completely within 2 seconds of the user selecting a flight.
 
**NFR-03.** PDF generation and download must complete within 5 seconds of the user clicking "Download".
 
---
 
### 2.2 Security
 
**NFR-04.** User passwords must never be stored in plain text; Supabase Auth must handle all credential management.
 
**NFR-05.** Protected pages (dashboard, reservations, payment) must not be accessible without an active authenticated session.
 
**NFR-06.** Full card numbers must never be stored in the database; only the last four digits may be saved for receipt display purposes.
 
**NFR-07.** All communication between the frontend and Supabase must use HTTPS.
 
---
 
### 2.3 Reliability
 
**NFR-08.** The 10-minute seat hold timer must be enforced server-side through database timestamps (the `selected_at` and `expires_at` fields in the `BOOKING_SEAT` table), not only in the user's browser.
 
**NFR-09.** When a seat reservation expires, the database must update its status automatically, without requiring any action from the user.
 
**NFR-10.** A ticket marked as downloaded must remain permanently blocked from re-download, even if the user switches devices or starts a new session.
 
---
 
### 2.4 Usability
 
**NFR-11.** A user with no prior experience with the system must be able to complete a reservation from search to payment in under 5 minutes.
 
**NFR-12.** All error messages must be written in plain language, explaining what happened and what the user can do next.
 
**NFR-13.** The system must not require any installation or plugin; it must run entirely in a modern web browser.
 
---
 
### 2.5 Maintainability
 
**NFR-14.** The frontend code must be organized into separate files by module: authentication, reservations, payments, and tickets.
 
**NFR-15.** SQL queries must be written in a way that all team members can read and understand them without requiring extensive additional documentation.
 
**NFR-16.** The GitHub repository must include a README file explaining how to set up and run the project locally.
 
---
 
### 2.6 Constraints
 
**NFR-17.** The system must be built exclusively with HTML5, CSS3, JavaScript, and Supabase — no additional backend frameworks are permitted.
 
**NFR-18.** Payment processing is simulated; no real financial transactions will occur in version 1.0.
 
**NFR-19.** The system is scoped for desktop web browsers; native mobile application support is out of scope for this version.
 
**NFR-20.** The system does not guarantee real-time seat map synchronization between simultaneous user sessions. If two users open the same flight's seat map at the same time, a seat may appear available to both until one of them confirms the reservation first.
 
**NFR-21.** All prices displayed in the system are denominated in Mexican Pesos (MXN).
 
**NFR-22.** The system is developed and intended exclusively for academic use within CBTis 47. It will not be deployed to a public production server in version 1.0.
 
**NFR-23.** The system is designed and tested for use on modern Chromium-based browsers (Google Chrome, Microsoft Edge). Compatibility with other browsers such as Firefox or Safari is not guaranteed in this version.

**NFR-24.** The system will not allow flights or trolleybuses to be registered on past dates or times; it will send an error message.
