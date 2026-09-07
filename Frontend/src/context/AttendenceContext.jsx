/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useState,
    useCallback,
} from "react";

import api from "../services/api";


const AttendanceContext = createContext();


export const AttendanceProvider = ({ children }) => {

    const [attendance, setAttendance] = useState([]);

    const [adminAttendance, setAdminAttendance] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    /* ==========================================
                GET MY ATTENDANCE
    ========================================== */

    const fetchMyAttendance = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/attendance/my");

            setAttendance(
                response.data.attendance || []
            );

        } catch (error) {

            console.error(
                "Fetch attendance error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to load attendance.";

            setError(message);

        } finally {

            setLoading(false);

        }

    }, []);


    /* ==========================================
                ADMIN - ALL ATTENDANCE
    ========================================== */

    const fetchAllAttendance = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/attendance");

            const records =
                response.data.attendance || [];

            setAdminAttendance(records);

            return {
                success: true,
                attendance: records,
            };

        } catch (error) {

            console.error(
                "Fetch all attendance error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to load attendance records.";

            setError(message);

            return {
                success: false,
                message,
            };

        } finally {

            setLoading(false);

        }

    }, []);


    /* ==========================================
                ADMIN - TODAY
    ========================================== */

    const fetchTodayAttendance = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/attendance/today");

            const records =
                response.data.attendance || [];

            setAdminAttendance(records);

            return {
                success: true,
                attendance: records,
            };

        } catch (error) {

            console.error(
                "Fetch today's attendance error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to load today's attendance.";

            setError(message);

            return {
                success: false,
                message,
            };

        } finally {

            setLoading(false);

        }

    }, []);


    /* ==========================================
                GET CURRENT LOCATION
    ========================================== */

    const getCurrentLocation = () => {

        return new Promise((resolve, reject) => {

            if (!navigator.geolocation) {

                reject(
                    new Error(
                        "Geolocation is not supported by your browser."
                    )
                );

                return;
            }


            navigator.geolocation.getCurrentPosition(

                (position) => {

                    resolve({

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude,

                        accuracy:
                            position.coords.accuracy,

                    });

                },

                (error) => {

                    let message =
                        "Unable to get your location.";

                    switch (error.code) {

                        case error.PERMISSION_DENIED:

                            message =
                                "Location permission was denied. Please allow location access to mark attendance.";

                            break;

                        case error.POSITION_UNAVAILABLE:

                            message =
                                "Your current location is unavailable.";

                            break;

                        case error.TIMEOUT:

                            message =
                                "Location request timed out. Please try again.";

                            break;

                        default:

                            message =
                                "Unable to get your current location.";

                    }

                    reject(
                        new Error(message)
                    );

                },

                {
                    enableHighAccuracy: true,

                    timeout: 10000,

                    maximumAge: 0,
                }

            );

        });

    };


    /* ==========================================
                    CHECK IN
    ========================================== */

    const checkIn = async (
        status = "Present"
    ) => {

        try {

            setLoading(true);
            setError("");


            /* ----------------------------------
                    GET GPS LOCATION
            ---------------------------------- */

            const location =
                await getCurrentLocation();


            /* ----------------------------------
                    SEND TO BACKEND
            ---------------------------------- */

            const response =
                await api.post(
                    "/attendance/check-in",
                    {
                        latitude:
                            location.latitude,

                        longitude:
                            location.longitude,

                        status,
                    }
                );


            const newAttendance =
                response.data.attendance;


            /* ----------------------------------
                    UPDATE STATE
            ---------------------------------- */

            setAttendance(prev => {

                const exists =
                    prev.some(
                        record =>
                            record._id ===
                            newAttendance._id
                    );

                if (exists) {

                    return prev;

                }

                return [
                    newAttendance,
                    ...prev,
                ];

            });


            return {

                success: true,

                attendance:
                    newAttendance,

            };

        } catch (error) {

            console.error(
                "Check-in error:",
                error
            );


            const message =
                error.response?.data?.message ||
                error.message ||
                "Unable to check in.";


            setError(message);


            return {

                success: false,

                message,

            };

        } finally {

            setLoading(false);

        }

    };


    /* ==========================================
                    CHECK OUT
    ========================================== */

    const checkOut = async () => {

        try {

            setLoading(true);
            setError("");


            /* ----------------------------------
                    GET GPS LOCATION
            ---------------------------------- */

            const location =
                await getCurrentLocation();


            /* ----------------------------------
                    SEND TO BACKEND
            ---------------------------------- */

            const response =
                await api.post(
                    "/attendance/check-out",
                    {

                        latitude:
                            location.latitude,

                        longitude:
                            location.longitude,

                    }
                );


            const updatedAttendance =
                response.data.attendance;


            /* ----------------------------------
                    UPDATE STATE
            ---------------------------------- */

            setAttendance(prev =>

                prev.map(record =>

                    record._id ===
                    updatedAttendance._id

                        ? updatedAttendance

                        : record

                )

            );


            return {

                success: true,

                attendance:
                    updatedAttendance,

            };

        } catch (error) {

            console.error(
                "Check-out error:",
                error
            );


            const message =
                error.response?.data?.message ||
                error.message ||
                "Unable to check out.";


            setError(message);


            return {

                success: false,

                message,

            };

        } finally {

            setLoading(false);

        }

    };


    /* ==========================================
                TODAY EMPLOYEE RECORD
    ========================================== */

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayAttendance =
        attendance.find(
            record =>
                record.date === today
        );


    /* ==========================================
                    PROVIDER
    ========================================== */

    return (

        <AttendanceContext.Provider
            value={{

                /* Employee */

                attendance,

                todayAttendance,

                fetchMyAttendance,

                checkIn,

                checkOut,


                /* Admin */

                adminAttendance,

                fetchAllAttendance,

                fetchTodayAttendance,


                /* Common */

                loading,

                error,

            }}
        >

            {children}

        </AttendanceContext.Provider>

    );

};


export const useAttendance = () =>
    useContext(AttendanceContext);