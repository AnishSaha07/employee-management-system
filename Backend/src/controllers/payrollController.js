const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");


/* ==========================================
                HELPER
        CALCULATE PAYROLL TOTALS
========================================== */

const calculatePayroll = ({
    basic,
    hra = 0,
    medical = 0,
    travel = 0,
    special = 0,
    bonus = 0,
    pf = 0,
    tax = 0,
    other = 0,
}) => {

    const basicSalary = Number(basic) || 0;

    const allowances = {
        hra: Number(hra) || 0,
        medical: Number(medical) || 0,
        travel: Number(travel) || 0,
        special: Number(special) || 0,
        bonus: Number(bonus) || 0,
    };

    const deductions = {
        pf: Number(pf) || 0,
        tax: Number(tax) || 0,
        other: Number(other) || 0,
    };


    const totalAllowances =
        allowances.hra +
        allowances.medical +
        allowances.travel +
        allowances.special +
        allowances.bonus;


    const totalDeductions =
        deductions.pf +
        deductions.tax +
        deductions.other;


    const grossSalary =
        basicSalary +
        totalAllowances;


    const netSalary =
        grossSalary -
        totalDeductions;


    return {
        basic: basicSalary,

        allowances,

        totalAllowances,

        deductions,

        totalDeductions,

        grossSalary,

        netSalary,
    };
};


/* ==========================================
                GENERATE PAYROLL
                    ADMIN ONLY
========================================== */

const generatePayroll = async (req, res) => {

    try {

        const {
            employeeId,
            month,
            hra = 0,
            medical = 0,
            travel = 0,
            special = 0,
            bonus = 0,
            pf = 0,
            tax = 0,
            other = 0,
        } = req.body;


        /* ==========================================
                    VALIDATION
        ========================================== */

        if (!employeeId) {

            return res.status(400).json({
                success: false,
                message: "Employee ID is required.",
            });

        }


        if (!month) {

            return res.status(400).json({
                success: false,
                message: "Payroll month is required.",
            });

        }


        /* ==========================================
                    MONTH VALIDATION
        ========================================== */

        const monthRegex =
            /^\d{4}-(0[1-9]|1[0-2])$/;

        if (!monthRegex.test(month)) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid payroll month. Use YYYY-MM format.",
            });

        }


        /* ==========================================
                FIND EMPLOYEE
        ========================================== */

        const employee =
            await Employee.findOne({
                employeeId: employeeId.toUpperCase(),
            });


        if (!employee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found.",
            });

        }


        /* ==========================================
                EMPLOYEE ROLE CHECK
        ========================================== */

        if (employee.role !== "employee") {

            return res.status(400).json({
                success: false,
                message:
                    "Payroll can only be generated for an employee.",
            });

        }


        /* ==========================================
                DUPLICATE CHECK
        ========================================== */

        const existingPayroll =
            await Payroll.findOne({
                employee: employee._id,
                month,
            });


        if (existingPayroll) {

            return res.status(409).json({
                success: false,
                message:
                    `Payroll for ${employee.name} for ${month} already exists.`,
                payroll: existingPayroll,
            });

        }


        /* ==========================================
                GET BASIC SALARY
        ========================================== */

        const basicSalary =
            Number(employee.basicSalary) ||
            Number(employee.salary) ||
            0;


        if (basicSalary <= 0) {

            return res.status(400).json({
                success: false,
                message:
                    "Employee does not have a valid basic salary.",
            });

        }


        /* ==========================================
                VALIDATE MONEY VALUES
        ========================================== */

        const moneyValues = {
            hra,
            medical,
            travel,
            special,
            bonus,
            pf,
            tax,
            other,
        };


        for (
            const [field, value]
            of Object.entries(moneyValues)
        ) {

            const numberValue =
                Number(value);


            if (
                Number.isNaN(numberValue) ||
                numberValue < 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `${field} must be a valid non-negative number.`,
                });

            }

        }


        /* ==========================================
                CALCULATE PAYROLL
        ========================================== */

        const calculated =
            calculatePayroll({
                basic: basicSalary,
                hra,
                medical,
                travel,
                special,
                bonus,
                pf,
                tax,
                other,
            });


        /* ==========================================
                PREVENT NEGATIVE NET SALARY
        ========================================== */

        if (calculated.netSalary < 0) {

            return res.status(400).json({
                success: false,
                message:
                    "Total deductions cannot be greater than gross salary.",
            });

        }


        /* ==========================================
                CREATE PAYROLL
        ========================================== */

        const payroll =
            await Payroll.create({

                employee:
                    employee._id,

                employeeId:
                    employee.employeeId,

                employeeName:
                    employee.name,

                month,

                basic:
                    calculated.basic,

                allowances:
                    calculated.allowances,

                totalAllowances:
                    calculated.totalAllowances,

                deductions:
                    calculated.deductions,

                totalDeductions:
                    calculated.totalDeductions,

                grossSalary:
                    calculated.grossSalary,

                netSalary:
                    calculated.netSalary,

                status: "Paid",

                paidOn:
                    new Date(),

                generatedAt:
                    new Date(),
            });


        /* ==========================================
                    RESPONSE
        ========================================== */

        return res.status(201).json({

            success: true,

            message:
                "Payroll generated successfully.",

            payroll,

        });

    } catch (error) {

        console.error(
            "Generate payroll error:",
            error
        );


        /* ==========================================
                DUPLICATE KEY ERROR
        ========================================== */

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "Payroll for this employee and month already exists.",

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Server error while generating payroll.",

        });

    }

};


/* ==========================================
                MY PAYROLL
            EMPLOYEE ONLY
========================================== */

const getMyPayroll = async (req, res) => {

    try {

        const employee =
            req.user;


        const payrolls =
            await Payroll.find({
                employee: employee._id,
            })
                .sort({
                    month: -1,
                    createdAt: -1,
                });


        return res.status(200).json({

            success: true,

            count:
                payrolls.length,

            payrolls,

        });

    } catch (error) {

        console.error(
            "Get my payroll error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch your payroll records.",

        });

    }

};


/* ==========================================
                ALL PAYROLL
                ADMIN ONLY
========================================== */

const getAllPayroll = async (req, res) => {

    try {

        const payrolls =
            await Payroll.find()
                .sort({
                    month: -1,
                    createdAt: -1,
                });


        return res.status(200).json({

            success: true,

            count:
                payrolls.length,

            payrolls,

        });

    } catch (error) {

        console.error(
            "Get all payroll error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch payroll records.",

        });

    }

};


/* ==========================================
                GET PAYROLL BY ID
            EMPLOYEE / ADMIN
========================================== */

const getPayrollById = async (req, res) => {

    try {

        const payroll =
            await Payroll.findById(
                req.params.id
            );


        if (!payroll) {

            return res.status(404).json({

                success: false,

                message:
                    "Payroll record not found.",

            });

        }


        /* ==========================================
                EMPLOYEE OWNERSHIP CHECK
        ========================================== */

        if (
            req.user.role !== "admin" &&
            payroll.employee.toString() !==
                req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You do not have permission to view this payroll record.",

            });

        }


        return res.status(200).json({

            success: true,

            payroll,

        });

    } catch (error) {

        console.error(
            "Get payroll error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch payroll record.",

        });

    }

};


/* ==========================================
                    EXPORTS
========================================== */

module.exports = {

    generatePayroll,

    getMyPayroll,

    getAllPayroll,

    getPayrollById,

};