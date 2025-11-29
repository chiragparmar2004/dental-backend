const express = require("express")
const DoctorProfile = require("../models/DoctorProfile")
const { protect, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Get doctor profile
router.get("/me", protect, authorizeRoles("doctor"), async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ userId: req.user._id })
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update doctor profile
router.put("/me", protect, authorizeRoles("doctor"), async (req, res) => {
  try {
    const profile = await DoctorProfile.findOneAndUpdate({ userId: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    })
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
