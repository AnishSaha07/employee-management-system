const jwt = require("jsonwebtoken");

const Employee = require("../models/Employee");


const protect = async (req, res, next) => {

    try {

        let token;


        /* =========================
                GET TOKEN
        ========================= */

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {

            token =
                req.headers.authorization.split(" ")[1];

        }


        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Not authorized. Please login.",

            });

        }


        /* =========================
                VERIFY TOKEN
        ========================= */

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        /* =========================
                FIND USER
        ========================= */

        const employee =
            await Employee.findById(
                decoded.id
            ).select("-password");


        if (!employee) {

            return res.status(401).json({

                success: false,

                message:
                    "User no longer exists.",

            });

        }


        /* =========================
                CHECK STATUS
        ========================= */

        if (employee.status !== "Active") {

            return res.status(403).json({

                success: false,

                message:
                    "Your account is inactive.",

            });

        }


        /* =========================
                ATTACH USER
        ========================= */

        req.user = employee;


        next();

    } catch (error) {

        console.error(
            "Auth middleware error:",
            error.message
        );


        if (
            error.name === "JsonWebTokenError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token.",

            });

        }


        if (
            error.name === "TokenExpiredError"
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication token expired.",

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Authentication failed.",

        });

    }

};


/* =================================
        ROLE MIDDLEWARE
================================= */

const authorize = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message:
                    "Not authenticated.",

            });

        }


        if (
            !roles.includes(req.user.role)
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You do not have permission to access this resource.",

            });

        }


        next();

    };

};


module.exports = {
    protect,
    authorize,
};