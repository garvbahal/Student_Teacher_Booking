import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button>Logout</button>
        </div>
    );
};

export default LogoutButton;
