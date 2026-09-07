import axios from "axios";


const api = axios.create({

      baseURL: import.meta.env.VITE_API_URL,

    headers: {
        "Content-Type": "application/json",
    },

});


/* ==========================================
            ATTACH JWT TO EVERY REQUEST
========================================== */

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


/* ==========================================
            HANDLE AUTH ERRORS
========================================== */

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        if (
            error.response?.status === 401
        ) {

            localStorage.removeItem("token");

            sessionStorage.removeItem("token");

            localStorage.removeItem("currentUser");

            sessionStorage.removeItem("currentUser");

        }


        return Promise.reject(error);

    }

);


export default api;