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
        <div>
            <h2>Student Dashboard</h2>
            <LogoutButton />

            <h3>Your Appointments</h3>
            <ul>
                {appointments.map((appt) => (
                    <li key={appt.id}>
                        With : {appt.teacher?.name || "Unknown Teacher"} |{" "}
                        {appt.date} {appt.time} | Status : {appt.status}
                    </li>
                ))}
            </ul>
            <NavLink to="/student/book">
                <button>Book Appointment</button>
            </NavLink>
        </div>
    );
};

export default StudentDashboard;
