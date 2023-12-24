const mongoose = require("mongoose");

//Model for Event
//Schema for an event
const eventSchema = mongoose.Schema(
    {
        title: { type: String, required: true},
        description: {type: String, required: true },
        location: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        isOnline: { type: Boolean, default: false },
        registrationLink: { type: String },
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
);
//Allows other files to access this schema
module.exports = mongoose.model("Event", eventSchema);
