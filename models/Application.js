const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "hired"],
      default: "applied",
    },
    noteFromDoctor: String,
    internalNotes: String,
  },
  { timestamps: true },
)

// Compound index to prevent duplicate applications
applicationSchema.index({ jobId: 1, doctorId: 1 }, { unique: true })

module.exports = mongoose.model("Application", applicationSchema)
