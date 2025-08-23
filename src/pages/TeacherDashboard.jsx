import React, { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import { auth, db } from "../config/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc,
} from "firebase/firestore";

const TeacherDashboard = () => {
    const [slots, setSlots] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [appointments, setAppointments] = useState([]);
    const user = auth.currentUser;

    if (!user) {
        return (
            <div>
                <h2>Teacher Dashboard</h2>
                <p>Please log in as a teacher to view this page.</p>
            </div>
        );
    }

    // ✅ Load slots for this teacher
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "slots"),
            where("teacherId", "==", user.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // console.log(
            //     "Slots snapshot:",
            //     snapshot.docs.map((d) => d.data())
            // );
            const slotList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSlots(slotList);
        });

        return () => unsubscribe();
    }, [user]);

    // ✅ Load teacher’s appointments
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "appointments"),
            where("teacherId", "==", user.uid)
        );
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const apptList = [];

            for (const docSnap of snapshot.docs) {
                const apptData = { id: docSnap.id, ...docSnap.data() };

                // 🔹 fetch slot details
                if (apptData.slotId) {
                    const slotSnap = await getDocs(
                        query(
                            collection(db, "slots"),
                            where("__name__", "==", apptData.slotId)
                        )
                    );
                    if (!slotSnap.empty) {
                        const slot = slotSnap.docs[0].data();
                        apptData.date = slot.date;
                        apptData.time = slot.time;
                    }
                }

                // 🔹 fetch student name using uid field
                if (apptData.studentId) {
                    const studentQuery = query(
                        collection(db, "users"),
                        where("uid", "==", apptData.studentId)
                    );
                    const studentSnap = await getDocs(studentQuery);
                    if (!studentSnap.empty) {
                        apptData.student = studentSnap.docs[0].data();
                    }
                }

                apptList.push(apptData);
            }

            setAppointments(apptList);
        });

        return () => unsubscribe();
    }, [user]);

    // ✅ Add new slot
    const handleAddSlot = async (e) => {
        e.preventDefault();
        if (!date || !time) return alert("Select date and time");

        try {
            await addDoc(collection(db, "slots"), {
                teacherId: user.uid,
                date,
                time,
                available: true,
            });

            setDate("");
            setTime("");
        } catch (error) {
            console.error("Error adding slot:", error);
        }
    };

    // ✅ Approve appointment
    const handleApprove = async (apptId) => {
        const apptRef = doc(db, "appointments", apptId);
        await updateDoc(apptRef, { status: "approved" });
    };

    // ✅ Cancel appointment
    const handleCancel = async (apptId, slotId) => {
        const apptRef = doc(db, "appointments", apptId);
        await updateDoc(apptRef, { status: "cancelled" });

        // Mark slot back to available
        if (slotId) {
            const slotRef = doc(db, "slots", slotId);
            await updateDoc(slotRef, { available: true });
        }
    };
    return (
        <div>
            <h2>Teacher Dashboard</h2>
            <LogoutButton />

            <h3>Schedule Availability</h3>
            <form onSubmit={handleAddSlot}>
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
                            <strong>Student:</strong>{" "}
                            {appt.student?.name || appt.studentId} <br />
                            <strong>Date:</strong> {appt.date} <br />
                            <strong>Time:</strong> {appt.time} <br />
                            <strong>Message:</strong>{" "}
                            {appt.message || "No message"} <br />
                            <strong>Status:</strong> {appt.status} <br />
                            {appt.status === "pending" && (
                                <div>
                                    <button
                                        onClick={() => handleApprove(appt.id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleCancel(appt.id, appt.slotId)
                                        }
                                    >
                                        Cancel
                                    </button>
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
