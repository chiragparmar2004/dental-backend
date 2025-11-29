const express = require("express")
const User = require("../models/User")
const DoctorProfile = require("../models/DoctorProfile")
const ClinicProfile = require("../models/ClinicProfile")
const { generateToken } = require("../utils/jwt")
const { protect } = require("../middleware/auth")

const router = express.Router()

// Register as Doctor
router.post("/register-doctor", async (req, res) => {
  try {
    const { email, password, name, fullName, qualification } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" })
    }

    // Create user
    const user = new User({
      name: name || email.split("@")[0],
      email,
      password,
      role: "doctor",
    })
    await user.save()

    // Create doctor profile
    const doctorProfile = new DoctorProfile({
      userId: user._id,
      fullName: fullName || name,
      qualification,
    })
    await doctorProfile.save()

    const token = generateToken(user._id)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Register as Clinic
router.post("/register-clinic", async (req, res) => {
  try {
    const { email, password, name, clinicName, type } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" })
    }

    // Create user
    const user = new User({
      name: name || clinicName,
      email,
      password,
      role: "clinic",
    })
    await user.save()

    // Create clinic profile
    const clinicProfile = new ClinicProfile({
      userId: user._id,
      clinicName,
      type,
      email,
    })
    await clinicProfile.save()

    const token = generateToken(user._id)
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = generateToken(user._id)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get current user
router.get("/me", protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  })
})

module.exports = router
