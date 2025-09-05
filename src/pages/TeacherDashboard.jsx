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
import Spinner from "../components/Spinner";

const TeacherDashboard = () => {
    const [slots, setSlots] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [appointments, setAppointments] = useState([]);
    // const [spinner, setSpinner] = useState(false);
    const [loadinSlots, setLoadingSlots] = useState(true);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const spinner = loadinSlots || loadingAppointments;
    const user = auth.currentUser;

    // ✅ Load slots for this teacher
    useEffect(() => {
        if (!user) return;
        setLoadingSlots(true);

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
            setLoadingSlots(false);
        });

        return () => unsubscribe();
    }, [user]);

    // ✅ Load teacher’s appointments
    useEffect(() => {
        if (!user) return;
        setLoadingAppointments(true);

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
            setLoadingAppointments(false);
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
        <div className="min-h-screen bg-gray-100 p-6">
            {spinner ? (
                <Spinner />
            ) : (
                <>
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">
                                Teacher Dashboard
                            </h2>
                            <LogoutButton />
                        </div>

                        {/* Schedule Availability */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">
                                Schedule Availability
                            </h3>
                            <form
                                onSubmit={handleAddSlot}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    Add Slot
                                </button>
                            </form>
                        </div>

                        {/* Slots */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">
                                Your Available Slots
                            </h3>
                            <ul className="space-y-2">
                                {slots.length === 0 ? (
                                    <li className="text-gray-500">
                                        No slots scheduled yet.
                                    </li>
                                ) : (
                                    slots.map((slot) => (
                                        <li
                                            key={slot.id}
                                            className="p-3 border rounded-lg flex justify-between items-center"
                                        >
                                            <span>
                                                {slot.date} {slot.time}
                                            </span>
                                            <span
                                                className={`px-3 py-1 text-sm font-medium rounded-full ${
                                                    slot.available
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {slot.available
                                                    ? "Available"
                                                    : "Booked"}
                                            </span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>

                        {/* Appointments */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">
                                Appointments
                            </h3>
                            <ul className="space-y-4">
                                {appointments.length === 0 ? (
                                    <li className="text-gray-500">
                                        No appointments yet.
                                    </li>
                                ) : (
                                    appointments.map((appt) => (
                                        <li
                                            key={appt.id}
                                            className="p-4 border rounded-lg bg-gray-50"
                                        >
                                            <p>
                                                <strong>Student:</strong>{" "}
                                                {appt.student?.name ||
                                                    appt.studentId}
                                            </p>
                                            <p>
                                                <strong>Date:</strong>{" "}
                                                {appt.date}
                                            </p>
                                            <p>
                                                <strong>Time:</strong>{" "}
                                                {appt.time}
                                            </p>
                                            <p>
                                                <strong>Message:</strong>{" "}
                                                {appt.message || "No message"}
                                            </p>
                                            <p>
                                                <strong>Status:</strong>{" "}
                                                <span
                                                    className={`font-medium ${
                                                        appt.status ===
                                                        "pending"
                                                            ? "text-yellow-600"
                                                            : appt.status ===
                                                              "approved"
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {appt.status}
                                                </span>
                                            </p>

                                            {appt.status === "pending" && (
                                                <div className="flex gap-3 mt-3">
                                                    <button
                                                        onClick={() =>
                                                            handleApprove(
                                                                appt.id
                                                            )
                                                        }
                                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleCancel(
                                                                appt.id,
                                                                appt.slotId
                                                            )
                                                        }
                                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
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
                    </div>
                </>
            )}
        </div>
    );
};

export default TeacherDashboard;
