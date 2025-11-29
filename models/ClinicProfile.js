const mongoose = require("mongoose")

const clinicProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    clinicName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["clinic", "hospital"],
      required: true,
    },
    address: String,
    city: String,
    state: String,
    pincode: String,
    contactPersonName: String,
    contactNumber: String,
    email: String,
    website: String,
    description: String,
    numberOfChairsOrBeds: Number,
    specializations: [String],
    logoUrl: String,
  },
  { timestamps: true },
)

module.exports = mongoose.model("ClinicProfile", clinicProfileSchema)
