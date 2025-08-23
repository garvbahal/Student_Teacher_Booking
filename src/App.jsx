import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/student"
                    element={
                        <ProtectedRoute role="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/book"
                    element={
                        <ProtectedRoute role="student">
                            <BookAppointmentPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/teacher"
                    element={
                        <ProtectedRoute role="teacher">
                            <TeacherDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
