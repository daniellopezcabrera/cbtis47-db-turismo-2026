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

| Category | Acceptance Criteria |
| :--- | :--- |
| **Flight Search & Selection** | • **Search:** Allow input of origin, destination, dates, and number of passengers. <br> • **Results:** Must display updated schedules, airline, duration, and current prices. <br> • **Summary:** Show a full summary (route, date, price, pax) and require user confirmation before payment. |
| **Tram Services** | • **Routes:** Display a list of available trams with full itineraries and scheduled stops. <br> • **Availability:** Show a clear "Not Available" message if the date/time is full or unavailable. <br> • **Booking:** Register the reservation in the DB and generate a digital ticket with a reserved seat. |
| **Seats & Cart** | • **Seat Selection:** Users must be able to pick a specific seat and see real-time availability. <br> • **Integrated Cart:** Manage both flight and tram services in a single cart; allow modifying or deleting items before checkout. |
| **Payment & Issuance** | • **Secure Payment:** Offer Credit/Debit card options and other secure methods. <br> • **Confirmation:** Issue a digital receipt/boarding pass immediately after payment. <br> • **Details:** Documents must include reservation code, flight/tram data, and payment details. |
| **Admin & Management** | • **Units:** Admin can register new trams with ID and maximum capacity. <br> • **Schedules:** Admin can create, modify, or cancel departure times. <br> • **Overbooking:** System must block new reservations if capacity is reached or if a unit is in maintenance. |
| **Validations & Status** | • **Date Sync:** System must verify that tram dates match the flight stay; otherwise, show an error or suggestion. <br> • **User Profile:** Users can check real-time status (Gate for flights, Meeting Point for trams) in their profile. |

