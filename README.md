🚗**ParkEase – Smart Parking Management System**
ParkEase is a full-stack Smart Parking Management System built using modern backend and frontend technologies.
It manages parking locations, slots, bookings, vehicles, users, and payments in a clean and scalable way.
This project follows real-world software engineering practices and is suitable for academic presentations and interviews.
🌟 Features
👤 User & Admin Management
Secure login and registration
Role-based access (Admin / User)
User–vehicle mapping
🅿️ Parking Slot Management
Multiple parking locations
Floor-based slot organization
Slot types:
SMALL
MEDIUM
LARGE
Real-time availability tracking
Automatic slot occupancy handling
📖 Booking System
Unique booking number generation
Entry and exit time tracking
Hourly rate calculation
Booking status management (ACTIVE / COMPLETED)
Slot ↔ Booking linkage
💳 Payment System (UPI – Simulation)
Supported methods:
Google Pay
PhonePe
Paytm
UPI ID–based payment simulation
Transaction ID validation
Booking-linked payment verification
Backend-ready for real payment gateway integration
⚠️ Note: Payment gateway is simulated for demo purposes and designed for easy future integration.
📊 Admin Dashboard
View and manage parking locations
Monitor parking slots
Track bookings and users
🎨 UI & UX
Clean and professional UI
Responsive design
Built using pure CSS
No UI frameworks used
🛠️ Tech Stack
Backend
Java 17
Spring Boot 3.2
Spring Data JPA
REST APIs
Maven
H2 / MySQL (configurable)
Frontend
React 18
React Router DOM
Axios
React Icons
Pure CSS
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
🚀 Getting Started
✅ Prerequisites
Java 17 or higher
Node.js 16 or higher
Maven 3.8 or higher
▶️ Backend Setup
Copy code
Bash
cd backend/parkease-backend
mvn clean install
mvn spring-boot:run
Backend will run at:
Copy code

http://localhost:8080
▶️ Frontend Setup
Copy code
Bash
cd parkease-frontend
npm install
npm start
Frontend will run at:
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
💳 Payment Module (Frontend)
File Location:
Copy code

frontend/src/utils/paymentService.js
Payment Capabilities
Amount validation
UPI ID generation
Transaction verification
Booking-payment mapping
Backend integration ready
📈 Project Status
✅ Core functionality completed
✅ Backend & frontend integrated
✅ Slot and booking logic working
✅ Payment simulation implemented
Completion Status: ~90%
🔮 Future Enhancements
Real payment gateway integration
Live cloud deployment
Reports & analytics dashboard
Notification system
🤝 Contributing
Contributions, issues, and feature requests are welcome.
📄 License
MIT License
👩‍💻 Developer
Developed by: Ramya
Project: ParkEase – Smart Parking Management System
If you want next, I can:
✉️ Rewrite the Infosys email perfectly matching this README
🎤 Give a short presentation explanation
📊 Explain database relationships clearly
Just say next buddy 💪
