import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookAppointmentPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
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
                        return (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name} ({teacher.department} -{" "}
                                {teacher.subject})
                            </option>
                        );
                    })}
                </select>

                {selectedTeacher && (
                    <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        required
                    >
                        <option value="">--Select Available Slot</option>
                        {slots.map((slot) => (
                            <opion key={slot.id} value={slot.id}>
                                {slot.date} {slot.time}
                            </opion>
                        ))}
                    </select>
                )}

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
