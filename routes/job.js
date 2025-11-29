const express = require("express")
const Job = require("../models/Job")
const { protect, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Get all active jobs with filters (public)
router.get("/", async (req, res) => {
  try {
    const { city, state, qualificationRequired, jobType, minExperienceYears, q } = req.query

    const filter = { isActive: true }

    if (city) filter.city = city
    if (state) filter.state = state
    if (qualificationRequired) filter.qualificationRequired = qualificationRequired
    if (jobType) filter.jobType = jobType
    if (minExperienceYears) filter.minExperienceYears = { $lte: minExperienceYears }

    if (q) {
      filter.$or = [{ title: { $regex: q, $options: "i" } }]
    }

    const jobs = await Job.find(filter).populate("clinicId", "name email").sort({ createdAt: -1 })

    res.json(jobs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get job detail
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("clinicId", "name email")

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    res.json(job)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create job (clinic only)
router.post("/", protect, authorizeRoles("clinic"), async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      clinicId: req.user._id,
    })
    await job.save()
    res.status(201).json(job)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get clinic's jobs
router.get("/my-jobs", protect, authorizeRoles("clinic"), async (req, res) => {
  try {
    const jobs = await Job.find({ clinicId: req.user._id }).sort({ createdAt: -1 })
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update job
router.put("/:id", protect, authorizeRoles("clinic"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    if (job.clinicId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" })
    }

    Object.assign(job, req.body)
    await job.save()
    res.json(job)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete job
router.delete("/:id", protect, authorizeRoles("clinic"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    if (job.clinicId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" })
    }

    await Job.deleteOne({ _id: req.params.id })
    res.json({ message: "Job deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Toggle job active/inactive
router.patch("/:id/toggle", protect, authorizeRoles("clinic"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    if (job.clinicId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" })
    }

    job.isActive = !job.isActive
    await job.save()
    res.json(job)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
