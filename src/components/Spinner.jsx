import React from "react";
import "./Spinner.css";

const Spinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
            <span class="loader"></span>
        </div>
    );
};

export default Spinner;
