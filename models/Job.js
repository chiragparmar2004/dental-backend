const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    qualificationRequired: {
      type: String,
      enum: ["BDS", "MDS", "Any"],
      default: "Any",
    },
    specializationRequired: String,
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "locum", "consultant"],
      required: true,
    },
    minExperienceYears: {
      type: Number,
      default: 0,
    },
    salaryRange: {
      min: Number,
      max: Number,
    },
    city: String,
    state: String,
    description: String,
    shifts: String,
    workingDays: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Job", jobSchema)
