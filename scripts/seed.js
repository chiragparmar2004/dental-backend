const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const User = require("../models/User")

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    // Check if admin exists
    const adminExists = await User.findOne({ email: "admin@dentalrecruit.com" })
    if (adminExists) {
      console.log("Admin user already exists")
      process.exit(0)
    }

    // Create admin user
    const admin = new User({
      name: "Admin",
      email: "admin@dentalrecruit.com",
      password: "Admin@123",
      role: "superadmin",
      isActive: true,
    })

    await admin.save()
    console.log("Superadmin user created successfully")
    console.log("Email: admin@dentalrecruit.com")
    console.log("Password: Admin@123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedAdmin()
