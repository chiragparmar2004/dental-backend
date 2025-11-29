const express = require("express")
const User = require("../models/User")
const Job = require("../models/Job")
const Application = require("../models/Application")
const DoctorProfile = require("../models/DoctorProfile")
const ClinicProfile = require("../models/ClinicProfile")
const { protect, authorizeRoles } = require("../middleware/auth")
const { json2csv } = require("../utils/csv")

const router = express.Router()

// Admin only middleware
const adminOnly = [protect, authorizeRoles("superadmin")]

// Get overview stats
router.get("/stats/overview", adminOnly, async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" })
    const totalClinics = await User.countDocuments({ role: "clinic" })
    const totalJobs = await Job.countDocuments()
    const totalApplications = await Application.countDocuments()

    res.json({
      totalDoctors,
      totalClinics,
      totalJobs,
      totalApplications,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get jobs by city
router.get("/stats/jobs-by-city", adminOnly, async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get applications by status
router.get("/stats/applications-by-status", adminOnly, async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all doctors
router.get("/users/doctors", adminOnly, async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password")
    const docsWithProfiles = await Promise.all(
      doctors.map(async (doc) => {
        const profile = await DoctorProfile.findOne({ userId: doc._id })
        return {
          user: doc,
          profile,
        }
      }),
    )
    res.json(docsWithProfiles)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all clinics
router.get("/users/clinics", adminOnly, async (req, res) => {
  try {
    const clinics = await User.find({ role: "clinic" }).select("-password")
    const clinicsWithProfiles = await Promise.all(
      clinics.map(async (clinic) => {
        const profile = await ClinicProfile.findOne({ userId: clinic._id })
        return {
          user: clinic,
          profile,
        }
      }),
    )
    res.json(clinicsWithProfiles)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all jobs
router.get("/jobs", adminOnly, async (req, res) => {
  try {
    const jobs = await Job.find().populate("clinicId", "name email").sort({ createdAt: -1 })
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all applications
router.get("/applications", adminOnly, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId")
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 })

    res.json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Export users as CSV
router.get("/export/users", adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password")
    const csv = json2csv(users, ["_id", "name", "email", "role", "isActive", "createdAt"])

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", 'attachment; filename="users.csv"')
    res.send(csv)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Export jobs as CSV
router.get("/export/jobs", adminOnly, async (req, res) => {
  try {
    const jobs = await Job.find().populate("clinicId", "name")
    const csv = json2csv(
      jobs.map((j) => ({
        _id: j._id,
        title: j.title,
        clinic: j.clinicId?.name,
        city: j.city,
        state: j.state,
        jobType: j.jobType,
        isActive: j.isActive,
        createdAt: j.createdAt,
      })),
      ["_id", "title", "clinic", "city", "state", "jobType", "isActive", "createdAt"],
    )

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", 'attachment; filename="jobs.csv"')
    res.send(csv)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Export applications as CSV
router.get("/export/applications", adminOnly, async (req, res) => {
  try {
    const apps = await Application.find().populate("jobId", "title").populate("doctorId", "name email")

    const csv = json2csv(
      apps.map((a) => ({
        _id: a._id,
        job: a.jobId?.title,
        doctor: a.doctorId?.name,
        email: a.doctorId?.email,
        status: a.status,
        createdAt: a.createdAt,
      })),
      ["_id", "job", "doctor", "email", "status", "createdAt"],
    )

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", 'attachment; filename="applications.csv"')
    res.send(csv)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
