# Student-Teacher Appointment Booking System

A React web application for booking appointments between students and teachers with role-based authentication.

## Features

-   **Students**: Book appointments with teachers, view appointment status
-   **Teachers**: Create time slots, approve/cancel appointments
-   **Admins**: Manage users and system oversight
-   Real-time updates with Firebase

## Tech Stack

-   React + Vite
-   Firebase (Auth + Firestore)
-   Tailwind CSS
-   React Router

## Demo

[Live Demo](https://student-teacher-booking-a9d25.web.app/)

## Installation

1. Clone the repository

```bash
git clone https://github.com/garvbahal/Student_Teacher_Booking
cd student-teacher-booking
```

2. Install dependencies

```bash
npm install
```

3. Create `.env.local` with Firebase config

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Deploy Firestore security rules

5. Run development server

```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── config/        # Firebase configuration
└── App.jsx        # Main app component
```

## Database Collections

-   **users**: User profiles with roles (student/teacher/admin)
-   **slots**: Teacher availability slots
-   **appointments**: Booking records with status tracking

## Usage

1. Register as student or teacher
2. Teachers create available time slots
3. Students book appointments from available slots
4. Teachers approve/cancel appointment requests
5. Real-time status updates for all users

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

## Deployment

Build and deploy the `dist` folder to any static hosting service (Vercel, Netlify, Firebase Hosting).

## License

MIT
