const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
require("express-async-errors")

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Import routes
const authRoutes = require("./routes/auth")
const doctorRoutes = require("./routes/doctor")
const clinicRoutes = require("./routes/clinic")
const jobRoutes = require("./routes/job")
const applicationRoutes = require("./routes/application")
const adminRoutes = require("./routes/admin")

// Use routes
app.use("/api/auth", authRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/clinics", clinicRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationRoutes)
app.use("/api/admin", adminRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
