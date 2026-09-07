
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import React from "react";
import Toast from "../common/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {

    const [toast, setToast] = useState({

        show: false,

        type: "success",

        title: "",

        message: "",

    });

    const showToast = (type, title, message) => {

        setToast({

            show: true,

            type,

            title,

            message,

        });

        setTimeout(() => {

            setToast((prev) => ({
                ...prev,
                show: false,
            }));

        }, 3000);

    };

    return (

        <ToastContext.Provider value={{ showToast }}>

            {children}

            <Toast toast={toast} />

        </ToastContext.Provider>

    );

};

export const useToast = () => useContext(ToastContext);