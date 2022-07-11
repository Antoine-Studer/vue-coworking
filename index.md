<h1> Business case </h1>

The business case is a coworking business gestion's application.

The application has one backend user interface which is based on the standard Simplicité® user interface. This user interface is only used by internal users to manage reference data (buildings info, rooms, seats...) and to enter and manage customer bookings and requests.

It also has various public frontend user interfaces which allow customers to book rooms or request seat.

Some business rules, including right rules, applies on all business objects some of which depends on the user profile.

The 2 back office business user profiles are administrator and plain user. Administrators manages all reference data, enters and/or validate requests and bookings. Plain users are only responsible for booking rooms or requesting seats.

<h2>Business data </h2>

<img src="./ModelCoworking.png"/>

The data model consists of 9 business objects: 
<ul>
  <li>Customers who can create bookings and requests for seats</li>
  <li>Requets which are created by customers and are linked to one seat in a workspace</li>
  <li>Worspaces which can be either public or private, they are in one building and requests can be made for them</li>
  <li>Buildings which have rooms and workspaces</li>
  <li>Rooms which are in a building. They have eligible options</li>
  <li>Eligible options are linked to one option and one room and can be found in options line </li>
  <li>Options which are only linked to eligible options </li>
  <li>Options line which designate the options found in a booking for the room which has eligible options </li>
  <li>Bookings which are linked to one customer, one room and have options</li>

  <h2>User profiles</h2>
  
  The <strong>Administator</strong> profile is a back office profile. He has full acces to all the application. He can manage all data and he's the only one reponsible of the confirmations of requests or bookings.
  
  The <strong>Plain user</strong> is also a back office profile. He has read only access to reference data like buildings or rooms and has the write access on his own orders and requests, which includes options lines.
  
  The <strong>Customer</strong> is a front office profile. He has only access to dedicated custom user interfarces. He is only allowed to requests seats, book a room or see his informations and cancel his bookings or workspace places.
  
<h2>Business workflows</h2>
    
<h3>Booking states</h3>
  <img src="./bookingstate.png"/>

  
  <h3>Request states</h3>
  <img src="./requestsate.png"/>
