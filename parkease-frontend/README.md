🚗 ParkEase – Smart Parking Management System

A production-ready full-stack Smart Parking System designed to manage parking locations, slots, bookings, users, vehicles, and payments with a clean architecture and scalable design.
This project demonstrates real-world software engineering practices, including role-based access, slot management, booking lifecycle, and a gateway-ready payment module.

🌟 Key Features

👤 User & Admin Management
Secure authentication (Admin & User roles)
Role-based access control
User–vehicle mapping support

🅿️ Smart Parking Slot Management
Multiple parking locations (City-wise)
Floor-based slot organization
Slot types: SMALL / MEDIUM / LARGE
Real-time availability tracking
Automatic slot occupation & release

📖 Booking System
Unique booking number generation
Entry & exit time tracking
Hourly rate calculation
Booking status lifecycle (ACTIVE / COMPLETED)
Slot-to-booking linkage
💳 Payment Module (UPI – Simulation, Gateway Ready)
Supports:
Google Pay
PhonePe
Paytm
UPI ID–based manual payment simulation
Transaction ID validation
Booking-to-payment verification
Backend-ready design for future gateway integration
💡 The payment system is implemented as an abstraction layer, allowing seamless future integration with gateways like Razorpay or Stripe without changing business logic.
📊 Admin Dashboard
Manage parking locations
View and control slots
Monitor bookings and users
System-wide visibility
🎨 Clean & Professional UI
Responsive design
Pure CSS (no UI frameworks)
Clear UX for booking & payments
🛠️ Tech Stack
Backend
Java 17
Spring Boot 3.2
Spring Data JPA
RESTful APIs
Maven
H2 / MySQL (configurable)
Frontend
React 18
React Router DOM
Axios
React Icons
Pure CSS (No frameworks)
📁 Project Structure
Copy code

ParkEase-Smart-Parking-Spot-Finder/
│
├── backend/
│   └── parkease-backend/
│
├── parkease-frontend/
│
└── README.md
🚀 Quick Start
✅ Prerequisites
Java 17+
Node.js 16+
Maven 3.8+
▶️ Backend Setup
Copy code
Bash
cd backend/parkease-backend
mvn clean install
mvn spring-boot:run
Backend URL:
Copy code

http://localhost:8080
▶️ Frontend Setup
Copy code
Bash
cd parkease-frontend
npm install
npm start
Frontend URL:
Copy code

http://localhost:3000
🔐 Demo Credentials
Admin
Username: admin
Password: admin123
User
Username: user
Password: user123
🔗 API Overview
Authentication
POST /api/auth/login
POST /api/auth/register
GET /api/auth/users
Parking & Booking
GET /api/parking/locations
GET /api/parking/slots/{locationId}
POST /api/bookings/create
PUT /api/bookings/exit/{bookingId}
GET /api/bookings
Payments (Simulation)
Booking-linked payment verification
Transaction validation
Backend integration ready
💳 Payment Design (Current Implementation)
File:
Copy code

frontend/src/utils/paymentService.js
Supported Methods
GPay
PhonePe
Paytm
Capabilities
Amount validation
UPI ID selection
Transaction ID verification
Booking-payment mapping
Future backend API hook
Copy code
Js
// Backend-ready verification hook
// await api.post('/payments/verify', paymentData);
📈 Project Status
✅ 90% Completed
Core functionality implemented
Payment flow completed (simulation)
Backend & frontend integrated
GitHub repository structured and documented
🔜 Future Enhancements:
Real payment gateway integration
Live deployment
Analytics dashboard
Notification system
🤝 Contributing
Pull requests and suggestions are welcome.
📄 License
MIT License
👩‍💻 Developer
Developed by: Ramya
Project: ParkEase – Smart Parking Management System
If you want next, I can:
✉️ Finalize the Infosys email matching this README
🗣️ Give a 2-minute project explanation script
📊 Create a DB relationship explanation
🎯 Prepare mentor review Q&A
Just say next 👍