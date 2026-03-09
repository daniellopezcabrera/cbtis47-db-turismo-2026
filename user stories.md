| User Story - Traveler (Flights) |
| --------------------------------|
| Story:
As a traveler, I want to search, select, and purchase flight tickets for different destinations so that I can organize my transportation efficiently. |
| Description: 
The system must allow the user to search for flights filtering by origin, destination, dates, and number of passengers. It must display a list of options with updated schedules and prices. Once a flight is selected, the system must facilitate a secure payment process and issue a digital receipt or boarding pass that is automatically sent to the user's email. 
| * Priority: 100 * |
| * Dependency: None * |

| User Story - Tourist (Trolley) |
|--------------------------------|
| Story:
As a tourist, I want to reserve a seat on a specific trolley and at a specific time so that I can ensure my participation in the local sightseeing tour. |
| Description:
The system must display the availability of the different trolleys and their routes. The user must be able to view a seat map of the selected unit and choose their seat. After booking, the system must generate a ticket with a QR code for boarding and allow the visualization of the itinerary with scheduled stops.
| * Priority: 90 |
| * Dependency: User Registration |

| User Story - Customer (Packages) |
| --------------------------------|
| Story:
As a customer, I want to purchase packages that combine flights and trolley passes so that I can obtain financial benefits and an integrated travel experience. |
| Description:
The system must offer a "Combos" or "Packages" section where, upon purchasing a flight to a specific destination, the reservation of the local tourist trolley is suggested with a discount applied. The system must validate that the trolley dates coincide with the flight stay and allow the management of both services in a single shopping cart.
| * Priority: 80 |
| * Dependency: 1, 2 |

| User Story - Administrator (Trolley Fleet) |
|--------------------------|
| Story:
As an agency administrator, I want to manage the trolley fleet, their drivers, and schedules to optimize daily operations and avoid overbooking. |
| Description:
The system must have a panel where new trolley units can be registered, assigned a maximum passenger capacity, and a driver. It must also allow for the modification or cancellation of departure times in case of maintenance, sending automatic notifications to users who already had a reservation for that specific unit.
| * Priority: 100 |
| * Dependency: None |

| User Story - Customer Support |
| ------------------------------|
Story:
As a user, I want to receive real-time notifications about changes to my flight or trolley schedule so that I can stay informed and react to unforeseen events. |
| Description:
The system must send push alerts or emails if there are flight delays or changes to the trolley departure point. Additionally, it must allow the user to check the status of their reservation at any time from their personal profile.
| * Priority: 70 |
| * Dependency: 1, 2, 4 |

| Category | User Story & Acceptance Criteria: Flight & Tram Booking System |
| :--- | :--- |
| **User Story** | **As a traveler,** I want to search, select, and purchase flight tickets and reserve tram transfers **so that** I can organize my transportation efficiently. |
| **Acceptance Criteria (Flights)** | • **Search:** Allow input of origin, destination, dates, and passengers; results must include schedules, airline, duration, and prices. <br> • **Selection:** Display a detailed summary (flight, date, price) and require confirmation before payment. <br> • **Payment & Issuance:** Offer secure payment methods (Credit/Debit) and generate a digital receipt with a reservation code. <br> • **Seat Selection:** Enable choosing a specific seat with real-time availability. |
| **Acceptance Criteria (Tram)** | • **Routes:** Display a list of available trams, schedules, routes, and full itineraries with scheduled stops. <br> • **Availability:** Block reservations if the unit's maximum capacity is reached; show a "Not Available" message. <br> • **Booking:** Register the reservation in the database and generate a digital ticket for immediate download. |
| **Validations & Integration** | • **Integrated Cart:** Manage both flight and tram services in a single shopping cart; allow modifications/removals before checkout. <br> • **Date Sync:** System must verify that tram dates align with the flight stay; show error or adjustment suggestion if they don't. <br> • **Admin Management:** Allow admins to register units (ID and capacity) and manage schedules without overbooking. |
| **Status Inquiry** | • **User Profile:** Users must be able to access their profile to see updated status (Gate for flights, Meeting Point for trams). <br> • **Updates:** If no changes occur, display a "No modifications" message. |
