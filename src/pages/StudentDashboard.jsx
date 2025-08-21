import React, { useState } from "react";
import LogoutButton from "../components/LogoutButton";

const StudentDashboard = () => {
    const [appointments, setAppointments] = useState([]);

    return (
        <div>
            <h2>Student Dashboard</h2>
            <LogoutButton />

            <h3>Your Appointments</h3>
            <ul>
                {appointments.map((appt) => {
                    const teacher = teacher.find(
                        (t) => t.id === appt.teacherId
                    );
                    return (
                        <li key={appt.id}>
                            With : {teacher.name} | {appt.date} {appt.time} |{" "}
                            Status : {appt.status}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default StudentDashboard;
