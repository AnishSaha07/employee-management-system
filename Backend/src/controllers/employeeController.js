const bcrypt = require("bcryptjs");

const Employee =
    require("../models/Employee");


/* =========================================
        GET ALL EMPLOYEES
========================================= */

const getAllEmployees = async (req, res) => {

    try {

        const employees =
            await Employee.find()
                .sort({ createdAt: -1 });


        return res.status(200).json({

            success: true,

            count: employees.length,

            employees,

        });

    } catch (error) {

        console.error(
            "Get employees error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch employees.",

        });

    }

};


/* =========================================
        GET SINGLE EMPLOYEE
========================================= */

const getEmployeeById = async (req, res) => {

    try {

        const employee =
            await Employee.findById(
                req.params.id
            );


        if (!employee) {

            return res.status(404).json({

                success: false,

                message:
                    "Employee not found.",

            });

        }


        return res.status(200).json({

            success: true,

            employee,

        });

    } catch (error) {

        console.error(
            "Get employee error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to fetch employee.",

        });

    }

};


/* =========================================
        CREATE EMPLOYEE
========================================= */

const createEmployee = async (req, res) => {

    try {

        const {
            employeeId,
            name,
            email,
            password,
            role,
            department,
            designation,
            joiningDate,
            status,
            phone,
            basicSalary,
        } = req.body;


        /* =========================
                VALIDATION
        ========================= */

        if (
            !employeeId ||
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Employee ID, name, email and password are required.",

            });

        }


        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must contain at least 6 characters.",

            });

        }


        /* =========================
            CHECK EMPLOYEE ID
        ========================= */

        const existingEmployeeId =
            await Employee.findOne({
                employeeId:
                    employeeId.toUpperCase(),
            });


        if (existingEmployeeId) {

            return res.status(409).json({

                success: false,

                message:
                    "Employee ID already exists.",

            });

        }


        /* =========================
                CHECK EMAIL
        ========================= */

        const existingEmail =
            await Employee.findOne({
                email: email.toLowerCase(),
            });


        if (existingEmail) {

            return res.status(409).json({

                success: false,

                message:
                    "Email already exists.",

            });

        }


        /* =========================
              HASH PASSWORD
        ========================= */

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );


        /* =========================
              CREATE EMPLOYEE
        ========================= */

        const employee =
            await Employee.create({

                employeeId,

                name,

                email,

                password:
                    hashedPassword,

                role:
                    role || "employee",

                department,

                designation,

                joiningDate,

                status:
                    status || "Active",

                phone,

                basicSalary:
                    Number(basicSalary) || 0,

            });


        const createdEmployee =
            await Employee.findById(
                employee._id
            );


        return res.status(201).json({

            success: true,

            message:
                "Employee created successfully.",

            employee:
                createdEmployee,

        });

    } catch (error) {

        console.error(
            "Create employee error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to create employee.",

        });

    }

};


/* =========================================
        UPDATE EMPLOYEE
========================================= */

const updateEmployee = async (req, res) => {

    try {

        const employee =
            await Employee.findById(
                req.params.id
            );


        if (!employee) {

            return res.status(404).json({

                success: false,

                message:
                    "Employee not found.",

            });

        }


        /*
            Password should NOT be changed
            through normal employee editing.
        */

        delete req.body.password;


        Object.assign(
            employee,
            req.body
        );


        await employee.save();


        return res.status(200).json({

            success: true,

            message:
                "Employee updated successfully.",

            employee,

        });

    } catch (error) {

        console.error(
            "Update employee error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update employee.",

        });

    }

};


/* =========================================
        DELETE EMPLOYEE
========================================= */

const deleteEmployee = async (req, res) => {

    try {

        const employee =
            await Employee.findById(
                req.params.id
            );


        if (!employee) {

            return res.status(404).json({

                success: false,

                message:
                    "Employee not found.",

            });

        }


        /*
            Prevent admin from deleting
            their own logged-in account.
        */

        if (
            employee._id.toString() ===
            req.user._id.toString()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You cannot delete your own account.",

            });

        }


        await employee.deleteOne();


        return res.status(200).json({

            success: true,

            message:
                "Employee deleted successfully.",

        });

    } catch (error) {

        console.error(
            "Delete employee error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to delete employee.",

        });

    }

};


/* =========================================
        UPDATE SALARY
========================================= */

const updateEmployeeSalary = async (
    req,
    res
) => {

    try {

        const {
            basicSalary,
            allowances,
            deductions,
        } = req.body;


        const employee =
            await Employee.findById(
                req.params.id
            );


        if (!employee) {

            return res.status(404).json({

                success: false,

                message:
                    "Employee not found.",

            });

        }


        if (basicSalary !== undefined) {

            employee.basicSalary =
                Number(basicSalary);

        }


        if (allowances) {

            employee.allowances = {

                ...employee.allowances.toObject(),

                ...allowances,

            };

        }


        if (deductions) {

            employee.deductions = {

                ...employee.deductions.toObject(),

                ...deductions,

            };

        }


        await employee.save();


        return res.status(200).json({

            success: true,

            message:
                "Employee salary updated successfully.",

            employee,

        });

    } catch (error) {

        console.error(
            "Salary update error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update employee salary.",

        });

    }

};


/* =========================================
        CURRENT EMPLOYEE
========================================= */

const getCurrentEmployee = async (
    req,
    res
) => {

    return res.status(200).json({

        success: true,

        employee: req.user,

    });

};


/* =========================================
        UPDATE OWN PROFILE
========================================= */

const updateMyProfile = async (
    req,
    res
) => {

    try {

        const employee =
            await Employee.findById(
                req.user._id
            );


        if (!employee) {

            return res.status(404).json({

                success: false,

                message:
                    "Employee not found.",

            });

        }


        /* ==================================
           EMPLOYEE-EDITABLE FIELDS
        ================================== */

        const allowedFields = [

            "name",
            "phone",
            "dob",
            "dateOfBirth",
            "gender",
            "address",
            "city",
            "state",
            "pincode",
            "profileImage",
            "bankDetails",
            "emergencyContact",

        ];


        allowedFields.forEach(field => {

            if (
                req.body[field] !== undefined
            ) {

                employee[field] =
                    req.body[field];

            }

        });


        await employee.save();


        return res.status(200).json({

            success: true,

            message:
                "Profile updated successfully.",

            employee,

        });

    } catch (error) {

        console.error(
            "Profile update error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update profile.",

        });

    }
};


module.exports = {

    getAllEmployees,

    getEmployeeById,

    createEmployee,

    updateEmployee,

    deleteEmployee,

    updateEmployeeSalary,

    getCurrentEmployee,

    updateMyProfile,

};