import React, { useState } from "react";
import LogoutButton from "../components/LogoutButton";

const AdminDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <LogoutButton />

            {/* Teacher Section */}
            <h3>All Teachers</h3>
            <ul>
                {teachers.map((teacher) => (
                    <li key={teacher.id}>
                        {teacher.name} ({teacher.department} - {teacher.subject}
                        )<button>Remove</button>
                    </li>
                ))}
            </ul>

            <h3>All Students</h3>
            <ul>
                {students.map((student) => (
                    <li key={student.id}>
                        {student.name} ({student.email})<button>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
