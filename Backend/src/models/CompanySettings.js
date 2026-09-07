const mongoose = require("mongoose");

const companySettingsSchema = new mongoose.Schema(
    {
        officeLocation: {
            latitude: {
                type: Number,
                required: true,
            },

            longitude: {
                type: Number,
                required: true,
            },

            radius: {
                type: Number,
                required: true,
                default: 200,
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "CompanySettings",
    companySettingsSchema
);