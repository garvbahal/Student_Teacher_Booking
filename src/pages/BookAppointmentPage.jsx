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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Book New Appointment
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Teacher Dropdown */}
                    <select
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">-- Select Teacher --</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name} ({teacher.department} -{" "}
                                {teacher.subject})
                            </option>
                        ))}
                    </select>

                    {/* Slot Dropdown */}
                    {selectedTeacher && (
                        <select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">
                                -- Select Available Slot --
                            </option>
                            {slots.map((slot) => (
                                <option key={slot.id} value={slot.id}>
                                    {slot.date} {slot.time}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Message */}
                    <textarea
                        placeholder="Message (optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        rows="3"
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookAppointmentPage;
