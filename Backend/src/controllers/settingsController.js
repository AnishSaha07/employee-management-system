const CompanySettings = require("../models/CompanySettings");


/* ==========================================
        GET ATTENDANCE SETTINGS
        ADMIN ONLY
========================================== */

const getAttendanceSettings = async (req, res) => {

    try {

        const settings =
            await CompanySettings.findOne();

        if (!settings) {

            return res.status(404).json({

                success: false,

                message:
                    "Attendance location has not been configured yet.",

            });

        }

        return res.status(200).json({

            success: true,

            settings,

        });

    } catch (error) {

        console.error(
            "Get attendance settings error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch attendance settings.",

        });

    }

};


/* ==========================================
        UPDATE ATTENDANCE SETTINGS
        ADMIN ONLY
========================================== */

const updateAttendanceSettings = async (req, res) => {

    try {

        const {
            latitude,
            longitude,
            radius,
        } = req.body;


        /* ==========================================
                    VALIDATION
        ========================================== */

        if (
            latitude === undefined ||
            longitude === undefined ||
            radius === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Latitude, longitude and radius are required.",

            });

        }


        const parsedLatitude =
            Number(latitude);

        const parsedLongitude =
            Number(longitude);

        const parsedRadius =
            Number(radius);


        if (
            !Number.isFinite(parsedLatitude) ||
            !Number.isFinite(parsedLongitude) ||
            !Number.isFinite(parsedRadius)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Latitude, longitude and radius must be valid numbers.",

            });

        }


        /* ==========================================
                LATITUDE VALIDATION
        ========================================== */

        if (
            parsedLatitude < -90 ||
            parsedLatitude > 90
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Latitude must be between -90 and 90.",

            });

        }


        /* ==========================================
                LONGITUDE VALIDATION
        ========================================== */

        if (
            parsedLongitude < -180 ||
            parsedLongitude > 180
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Longitude must be between -180 and 180.",

            });

        }


        /* ==========================================
                    RADIUS VALIDATION
        ========================================== */

        if (parsedRadius <= 0) {

            return res.status(400).json({

                success: false,

                message:
                    "Attendance radius must be greater than 0 meters.",

            });

        }


        /* ==========================================
                CREATE OR UPDATE SETTINGS
        ========================================== */

        let settings =
            await CompanySettings.findOne();


        if (!settings) {

            settings =
                await CompanySettings.create({

                    officeLocation: {

                        latitude:
                            parsedLatitude,

                        longitude:
                            parsedLongitude,

                        radius:
                            parsedRadius,

                    },

                });

        } else {

            settings.officeLocation = {

                latitude:
                    parsedLatitude,

                longitude:
                    parsedLongitude,

                radius:
                    parsedRadius,

            };

            await settings.save();

        }


        /* ==========================================
                    RESPONSE
        ========================================== */

        return res.status(200).json({

            success: true,

            message:
                "Attendance location updated successfully.",

            settings,

        });

    } catch (error) {

        console.error(
            "Update attendance settings error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to update attendance settings.",

        });

    }

};


module.exports = {

    getAttendanceSettings,

    updateAttendanceSettings,

};