🚗 PARK EASE – SMART PARKING MANAGEMENT SYSTEM

ParkEase is a full-stack Smart Parking Management System designed to manage parking locations, slots, bookings, vehicles, users, and payments efficiently.

This project is built following real-world software engineering standards and is suitable for college presentations, demos, and interviews.

🌟 FEATURES

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

Real-time slot availability

Automatic slot occupancy handling

📖 Booking System

Unique booking number generation

Entry and exit time tracking

Hourly rate calculation

Booking status management (ACTIVE / COMPLETED)

Slot ↔ Booking relationship

💳 Payment System (UPI – Simulation)

Supported methods:

Google Pay

PhonePe

Paytm

UPI-based payment simulation

Transaction ID validation

Booking-linked payment verification

Backend-ready for real payment gateway

⚠️ Note: Payment flow is simulated for demo purposes.

📊 Admin Dashboard

Manage parking locations

Monitor slots and occupancy

View bookings and users

🎨 User Interface

Clean and professional UI

Responsive layout

Built using Pure CSS

No UI frameworks used

🛠️ TECH STACK

Backend

Java 17

Spring Boot 3.2

Spring Data JPA

REST APIs

Maven

H2 / MySQL

Frontend

React 18

React Router DOM

Axios

React Icons

Pure CSS

📁 PROJECT STRUCTURE


ParkEase-Smart-Parking-Spot-Finder/
│

├── backend/

│   └── parkease-backend/

│

├── parkease-frontend/

│

└── README.md


🚀 GETTING STARTED

✅ Prerequisites

Java 17+

Node.js 16+

Maven 3.8+

▶️ Backend Setup

Bash

cd backend/parkease-backend

mvn clean install

mvn spring-boot:run

Backend URL:

http://localhost:8080

▶️ Frontend Setup

Bash

cd parkease-frontend

npm install

npm start

Frontend URL:

http://localhost:3000

🔐 DEMO CREDENTIALS

Admin

Username: admin

Password: admin123

User

Username: user

Password: user123

🔗 API OVERVIEW

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

💳 PAYMENT MODULE (FRONTEND)

File Location

frontend/src/utils/paymentService.js

Capabilities

Amount validation

UPI ID generation

Transaction verification

Booking–payment mapping

Backend integration ready

📈 PROJECT STATUS

✅ Backend completed

✅ Frontend completed

✅ Slot & booking logic implemented

✅ Payment simulation working

Completion: ~90%

🔮 Future Enhancements

Real payment gateway integration

Cloud deployment

Analytics dashboard

Notification system

🤝 CONTRIBUTING

Pull requests and suggestions are welcome.

📄 LICENSE

MIT License

👩‍💻 DEVELOPER

Developed by: Ramya Ruba

Project: ParkEase – Smart Parking Management System
