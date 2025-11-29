const mongoose = require("mongoose")

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      enum: ["BDS", "MDS", "Other"],
      required: true,
    },
    specialization: String,
    experienceYears: {
      type: Number,
      default: 0,
    },
    currentLocation: {
      city: String,
      state: String,
    },
    preferredLocations: [String],
    expectedSalaryMin: Number,
    expectedSalaryMax: Number,
    isOpenToRelocate: {
      type: Boolean,
      default: false,
    },
    registrationNumber: String,
    cvUrl: String,
    profilePhotoUrl: String,
  },
  { timestamps: true },
)

module.exports = mongoose.model("DoctorProfile", doctorProfileSchema)
