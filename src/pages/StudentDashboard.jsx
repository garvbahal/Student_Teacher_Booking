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

const StudentDashboard = () => {
    const [user] = useAuthState(auth);
    const [appointments, setAppointments] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    // 🔹 Fetch Student Appointments from Firestore
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
                const apptList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
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
