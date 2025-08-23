import React, { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import { db, auth } from "../config/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink } from "react-router-dom";

const StudentDashboard = () => {
    const [user] = useAuthState(auth);
    const [appointments, setAppointments] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user) return;
            setDataLoading(true);
            try {
                const q = query(
                    collection(db, "appointments"),
                    where("studentId", "==", user.uid)
                );
                const snapshot = await getDocs(q);
                const apptList = [];

                for (const docSnap of snapshot.docs) {
                    const apptData = { id: docSnap.id, ...docSnap.data() };

                    // fetch teacher info
                    const teacherSnap = await getDocs(
                        query(
                            collection(db, "users"),
                            where("uid", "==", apptData.teacherId)
                        )
                    );

                    if (!teacherSnap.empty) {
                        apptData.teacher = teacherSnap.docs[0].data();
                    }

                    // 🔹 fetch slot info (date + time)
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

                    apptList.push(apptData);
                }

                setAppointments(apptList);
            } catch (err) {
                console.error("Error fetching appointments:", err);
            } finally {
                setDataLoading(false);
            }
        };
        fetchAppointments();
    }, [user]);

    if (dataLoading) {
        return <div>Loading user...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Student Dashboard
                    </h2>
                    <LogoutButton />
                </div>

                {/* Appointments */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">
                        Your Appointments
                    </h3>
                    <ul className="space-y-3">
                        {appointments.length === 0 ? (
                            <li className="text-gray-500">
                                No appointments booked yet.
                            </li>
                        ) : (
                            appointments.map((appt) => (
                                <li
                                    key={appt.id}
                                    className="p-4 border rounded-lg bg-gray-50"
                                >
                                    <p>
                                        <strong>With:</strong>{" "}
                                        {appt.teacher?.name ||
                                            "Unknown Teacher"}
                                    </p>
                                    <p>
                                        <strong>Date:</strong> {appt.date}
                                    </p>
                                    <p>
                                        <strong>Time:</strong> {appt.time}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        <span
                                            className={`font-medium ${
                                                appt.status === "pending"
                                                    ? "text-yellow-600"
                                                    : appt.status === "approved"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {appt.status}
                                        </span>
                                    </p>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Book Button */}
                <div className="flex justify-end">
                    <NavLink to="/student/book">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                            Book Appointment
                        </button>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
