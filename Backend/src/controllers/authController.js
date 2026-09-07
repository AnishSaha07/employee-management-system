const bcrypt = require("bcryptjs");

const Employee = require("../models/Employee");

const generateToken =
    require("../utils/generateToken");


/* =================================
        LOGIN
================================= */

const login = async (req, res) => {

    try {

        const {
    email,
    password,
} = req.body || {};


        /* =========================
                VALIDATION
        ========================= */

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email/Employee ID and password are required.",

            });

        }


        /* =========================
                NORMALIZE INPUT
        ========================= */

        const identifier =
            email.trim();


        /* =========================
                FIND USER
                EMAIL OR EMPLOYEE ID
        ========================= */

        const employee =
            await Employee.findOne({

                $or: [

                    {
                        email:
                            identifier.toLowerCase(),
                    },

                    {
                        employeeId:
                            identifier.toUpperCase(),
                    },

                ],

            }).select("+password");


        /* =========================
                USER NOT FOUND
        ========================= */

        if (!employee) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid Employee ID / Email or Password.",

            });

        }


        /* =========================
                PASSWORD
        ========================= */

        const passwordMatch =
            await bcrypt.compare(
                password,
                employee.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid Employee ID / Email or Password.",

            });

        }


        /* =========================
                STATUS
        ========================= */

        if (employee.status !== "Active") {

            return res.status(403).json({

                success: false,

                message:
                    "Your account is inactive.",

            });

        }


        /* =========================
                TOKEN
        ========================= */

        const token =
            generateToken(employee);


        /* =========================
                RESPONSE
        ========================= */

        return res.status(200).json({

            success: true,

            message: "Login successful.",

            token,

            user: {

                id:
                    employee._id,

                employeeId:
                    employee.employeeId,

                name:
                    employee.name,

                email:
                    employee.email,

                role:
                    employee.role,

                department:
                    employee.department,

                designation:
                    employee.designation,

            },

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error during login.",

        });

    }

};


module.exports = {
    login,
};