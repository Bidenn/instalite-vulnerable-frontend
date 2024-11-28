import React, { useEffect, useRef, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const IDLE_TIMEOUT = 50 * 60 * 1000; // 5 minutes in milliseconds

// Define the type for props, including the children prop
interface IdleTimerProps {
    children: ReactNode; // ReactNode is the type for any valid React child (string, number, element, etc.)
}

const IdleTimer: React.FC<IdleTimerProps> = ({ children }) => {
    const navigate = useNavigate();
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetIdleTimer = () => {
        // Clear existing timer
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }

        // Set new timer
        idleTimerRef.current = setTimeout(() => {
            // Remove userId and navigate to login after timeout
            localStorage.removeItem("userId");
            navigate("/login");
        }, IDLE_TIMEOUT);
    };

    useEffect(() => {
        // Reset timer on any activity
        const activityHandler = () => resetIdleTimer();

        window.addEventListener("mousemove", activityHandler);
        window.addEventListener("keydown", activityHandler);
        window.addEventListener("click", activityHandler);

        // Initialize timer on mount
        resetIdleTimer();

        // Cleanup on component unmount
        return () => {
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
            window.removeEventListener("mousemove", activityHandler);
            window.removeEventListener("keydown", activityHandler);
            window.removeEventListener("click", activityHandler);
        };
    }, [navigate]);

    return <>{children}</>;
};

export default IdleTimer;
