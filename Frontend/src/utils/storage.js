import { defaultEmployees } from "../data/defautData";

/* ===========================
      INITIALIZE DATABASE
=========================== */

export const initializeStorage = () => {

    if (!localStorage.getItem("employees")) {

        localStorage.setItem(
            "employees",
            JSON.stringify(defaultEmployees)
        );

    }

};

/* ===========================
      EMPLOYEES
=========================== */

export const getEmployees = () => {

    return JSON.parse(
        localStorage.getItem("employees")
    ) || [];

};

export const saveEmployees = (employees) => {

    localStorage.setItem(
        "employees",
        JSON.stringify(employees)
    );

};

/* ===========================
      CURRENT USER
=========================== */

export const getCurrentUser = () => {

    return JSON.parse(
        localStorage.getItem("currentUser")
    );

};