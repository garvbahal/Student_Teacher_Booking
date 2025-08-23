import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { query, collection, where, getDocs } from "firebase/firestore";

function ProtectedRoute({ children, role }) {
    const [user, loading] = useAuthState(auth);
    const [userRole, setUserRole] = useState(null);
    const [checkingRole, setCheckingRole] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            if (user) {
                const q = query(
                    collection(db, "users"),
                    where("uid", "==", user.uid)
                );
                const snap = await getDocs(q);
                if (!snap.empty) {
                    const data = snap.docs[0].data();
                    console.log("Fetched role:", data.role);
                    setUserRole(data.role);
                } else {
                    console.warn("No user document found for UID:", user.uid);
                    setUserRole(null); // or "guest"
                }
            }
            setCheckingRole(false);
        };
        fetchRole();
    }, [user]);

    // 🔹 Wait until both Firebase auth + Firestore role are ready
    if (loading || checkingRole) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    // 🔹 User not logged in
    if (!user) return <Navigate to="/" replace />;

    // 🔹 Wrong role
    if (role && userRole !== role) return <Navigate to="/" replace />;

    // 🔹 Access allowed
    return children;
}

export default ProtectedRoute;
