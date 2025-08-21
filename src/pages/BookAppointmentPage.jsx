import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookAppointmentPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    return (
        <div>
            <h2>Book new Appointment</h2>
            <form>
                <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    required
                >
                    <option value="">--Select Teacher--</option>
                    {teachers.map((teacher) => {
                        <option key={teacher.id} value={teacher.id}>
                            {teacher.name} ({teacher.department} -{" "}
                            {teacher.subject})
                        </option>;
                    })}
                </select>

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

                <textarea
                    placeholder="Message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button type="submit">Confirm Booking</button>
            </form>
        </div>
    );
};

export default BookAppointmentPage;
