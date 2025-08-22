import React, { useState } from "react";
import LogoutButton from "../components/LogoutButton";

const TeacherDashboard = () => {
    const [slots, setSlots] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [appointments, setAppointments] = useState([]);

    return (
        <div>
            <h2>Teacher Dashboard</h2>
            <LogoutButton />

            <h3>Schedule Availability</h3>
            <form>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />
                <button type="submit">Add Slot</button>
            </form>

            <h3>Your Available Slots</h3>
            <ul>
                {slots.length === 0 ? (
                    <li>No slots scheduled yet.</li>
                ) : (
                    slots.map((slot) => (
                        <li key={slot.id}>
                            {slot.date} {slot.time} →{" "}
                            {slot.available ? "Available" : "Booked"}
                        </li>
                    ))
                )}
            </ul>

            <h3>Appointsments</h3>
            <ul>
                {appointments.length === 0 ? (
                    <li>No appointments yet.</li>
                ) : (
                    appointments.map((appt) => (
                        <li key={appt.id}>
                            <strong>Student:</strong> {appt.studentId} <br />
                            <strong>Date:</strong> {appt.date} <br />
                            <strong>Time:</strong> {appt.time} <br />
                            <strong>Message:</strong>{" "}
                            {appt.message || "No message"} <br />
                            <strong>Status:</strong> {appt.status} <br />
                            {appt.stats === "pending" && (
                                <div>
                                    <button>Approve</button>
                                    <button>Cancel</button>
                                </div>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TeacherDashboard;
