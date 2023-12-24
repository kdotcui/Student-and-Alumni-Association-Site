const mongoose = require("mongoose");

//Defines the Job Schema
const jobSchema = mongoose.Schema(
  {
    title: { type: String, required: true},
    company: {type: String, required: true },
    location: { type: String, required: true },
    description: {type: String, required: true },
    requirements: { type: String, required: true },
    salary: { type: Number, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    postDate: { type: Date, default: Date.now },
    deadlineDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  },
  {
    timestamps: true,
  }
);

//Allows other files to access this schema
module.exports = mongoose.model("Job", jobSchema);
