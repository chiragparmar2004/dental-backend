const express = require("express")
const ClinicProfile = require("../models/ClinicProfile")
const { protect, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Get clinic profile
router.get("/me", protect, authorizeRoles("clinic"), async (req, res) => {
  try {
    const profile = await ClinicProfile.findOne({ userId: req.user._id })
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update clinic profile
router.put("/me", protect, authorizeRoles("clinic"), async (req, res) => {
  try {
    const profile = await ClinicProfile.findOneAndUpdate({ userId: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    })
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
