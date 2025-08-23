import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    collection,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";

const BookAppointmentPage = () => {
    const [teachers, setTeachers] = useState([]);

    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const navigate = useNavigate();

    // Load all teachers from Firestore
    useEffect(() => {
        const fetchTeachers = async () => {
            const teacherQuery = query(
                collection(db, "users"),
                where("role", "==", "teacher")
            );
            const snapshot = await getDocs(teacherQuery);
            const teacherList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTeachers(teacherList);
        };
        fetchTeachers();
    }, []);

    // Load slots when teacher is selected
    useEffect(() => {
        if (!selectedTeacher) return;

        const fetchSlots = async () => {
            const slotQuery = query(
                collection(db, "slots"),
                where("teacherId", "==", selectedTeacher),
                where("available", "==", true)
            );
            const snapshot = await getDocs(slotQuery);
            const slotList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSlots(slotList);
        };
        fetchSlots();
    }, [selectedTeacher]);

    // Handle appointment booking
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot) return alert("Please select a slot");

        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in as a student to book an appointment");
            return;
        }

        try {
            // Save appointment
            await addDoc(collection(db, "appointments"), {
                studentId: user.uid,
                teacherId: selectedTeacher,
                slotId: selectedSlot,
                message,
                status: "pending",
            });

            // Mark slot as booked
            const slotRef = doc(db, "slots", selectedSlot);
            await updateDoc(slotRef, { available: false });

            alert("Appointment booked successfully!");
            navigate("/student"); // go back to student dashboard
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert("Something went wrong. Try again.");
        }
    };

    return (
        <div>
            <h2>Book new Appointment</h2>
            <form onSubmit={handleSubmit}>
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
                            <option key={slot.id} value={slot.id}>
                                {slot.date} {slot.time}
                            </option>
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
