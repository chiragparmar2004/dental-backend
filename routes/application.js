const express = require("express")
const Application = require("../models/Application")
const Job = require("../models/Job")
const DoctorProfile = require("../models/DoctorProfile")
const { protect, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Doctor: Apply to job
router.post("/", protect, authorizeRoles("doctor"), async (req, res) => {
  try {
    const { jobId, noteFromDoctor } = req.body

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    // Check if already applied
    const existing = await Application.findOne({
      jobId,
      doctorId: req.user._id,
    })
    if (existing) {
      return res.status(400).json({ error: "Already applied to this job" })
    }

    const application = new Application({
      jobId,
      doctorId: req.user._id,
      noteFromDoctor,
    })
    await application.save()

    res.status(201).json(application)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Doctor: Get their applications
router.get("/my-applications", protect, authorizeRoles("doctor"), async (req, res) => {
  try {
    const applications = await Application.find({ doctorId: req.user._id }).populate("jobId").sort({ createdAt: -1 })

    res.json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Clinic: Get applications for a job
router.get("/job/:jobId/applications", protect, authorizeRoles("clinic"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    if (job.clinicId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" })
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("doctorId", "name email")
      .populate({
        path: "doctorId",
        model: "User",
        select: "name email",
      })
      .sort({ createdAt: -1 })

    // Fetch doctor profiles for full details
    const appWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const profile = await DoctorProfile.findOne({ userId: app.doctorId._id })
        return {
          ...app.toObject(),
          doctorProfile: profile,
        }
      }),
    )

    res.json(appWithProfiles)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Clinic: Update application status
router.patch("/:id/status", protect, authorizeRoles("clinic"), async (req, res) => {
  try {
    const { status, internalNotes } = req.body

    const application = await Application.findById(req.params.id).populate("jobId")

    if (!application) {
      return res.status(404).json({ error: "Application not found" })
    }

    if (application.jobId.clinicId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" })
    }

    if (status) application.status = status
    if (internalNotes !== undefined) application.internalNotes = internalNotes

    await application.save()
    res.json(application)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
