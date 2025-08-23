import React, { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import { db } from "../config/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc,
} from "firebase/firestore";

const AdminDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);

    // ✅ Fetch Teachers
    const fetchTeachers = async () => {
        const q = query(
            collection(db, "users"),
            where("role", "==", "teacher")
        );
        const snapshot = await getDocs(q);
        const teacherList = snapshot.docs.map((docSnap) => ({
            id: docSnap.id, // Firestore doc ID
            ...docSnap.data(),
        }));
        setTeachers(teacherList);
    };

    // ✅ Fetch Students
    const fetchStudents = async () => {
        const q = query(
            collection(db, "users"),
            where("role", "==", "student")
        );
        const snapshot = await getDocs(q);
        const studentList = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
        }));
        setStudents(studentList);
    };

    // ✅ Remove user (teacher or student)
    const handleRemove = async (id) => {
        try {
            await deleteDoc(doc(db, "users", id));
            setTeachers((prev) => prev.filter((t) => t.id !== id));
            setStudents((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Error removing user:", err);
        }
    };

    useEffect(() => {
        fetchTeachers();
        fetchStudents();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <LogoutButton />

            {/* Teachers Section */}
            <h3 className="text-xl font-semibold mt-6 mb-2">All Teachers</h3>
            <ul className="space-y-2">
                {teachers.length === 0 ? (
                    <li>No teachers found</li>
                ) : (
                    teachers.map((teacher) => (
                        <li
                            key={teacher.id}
                            className="flex justify-between items-center p-2 border rounded"
                        >
                            {teacher.name} ({teacher.department} -{" "}
                            {teacher.subject})
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => handleRemove(teacher.id)}
                            >
                                Remove
                            </button>
                        </li>
                    ))
                )}
            </ul>

            {/* Students Section */}
            <h3 className="text-xl font-semibold mt-6 mb-2">All Students</h3>
            <ul className="space-y-2">
                {students.length === 0 ? (
                    <li>No students found</li>
                ) : (
                    students.map((student) => (
                        <li
                            key={student.id}
                            className="flex justify-between items-center p-2 border rounded"
                        >
                            {student.name} ({student.email})
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={() => handleRemove(student.id)}
                            >
                                Remove
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default AdminDashboard;
