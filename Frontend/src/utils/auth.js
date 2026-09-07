import api from "../services/api";


/* =========================================================
   LOGIN
========================================================= */

export const login = async (
    identifier,
    password,
    rememberMe = false
) => {

    try {

        const response = await api.post(
            "/auth/login",
            {
                email: identifier,
                password,
            }
        );

        const data = response.data;

        if (!data.success) {

            throw new Error(
                data.message || "Login failed."
            );

        }


        /* =========================================
           SELECT STORAGE
        ========================================= */

        const storage = rememberMe
            ? localStorage
            : sessionStorage;


        /* =========================================
           CLEAR OLD AUTH DATA
        ========================================= */

        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("currentUser");


        /* =========================================
           SAVE JWT
        ========================================= */

        storage.setItem(
            "token",
            data.token
        );


        /* =========================================
           SAVE USER
        ========================================= */

        storage.setItem(
            "currentUser",
            JSON.stringify(data.user)
        );


        return {

            success: true,

            token: data.token,

            user: data.user,

            message:
                data.message || "Login successful.",

        };

    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        throw new Error(

            error.response?.data?.message ||

            error.message ||

            "Unable to login."

        );

    }

};


/* =========================================================
   LOGOUT
========================================================= */

export const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("currentUser");

};


/* =========================================================
   GET CURRENT USER
========================================================= */

export const getCurrentUser = () => {

    try {

        const storedUser =
            localStorage.getItem("currentUser") ||
            sessionStorage.getItem("currentUser");

        if (!storedUser) {
            return null;
        }

        return JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "Get current user error:",
            error
        );

        return null;

    }

};


/* =========================================================
   GET TOKEN
========================================================= */

export const getToken = () => {

    return (
        localStorage.getItem("token") ||
        sessionStorage.getItem("token")
    );

};


/* =========================================================
   CHECK AUTHENTICATION
========================================================= */

export const isAuthenticated = () => {

    return Boolean(getToken());

};


/* =========================================================
   CHECK ROLE
========================================================= */

export const hasRole = (role) => {

    const user = getCurrentUser();

    if (!user) {
        return false;
    }

    return user.role === role;

};