# Dental Recruit Platform - Backend

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Environment Configuration
Create a `.env` file in the backend directory:

\`\`\`
MONGO_URI=mongodb://localhost:27017/dental-recruit
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
\`\`\`

### 3. Start MongoDB
Ensure MongoDB is running locally or update `MONGO_URI` with your remote connection string.

### 4. Seed Superadmin User
\`\`\`bash
npm run seed
\`\`\`

This creates a superadmin user:
- Email: `admin@dentalrecruit.com`
- Password: `Admin@123`

### 5. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

The server will start on `http://localhost:5000`

## API Routes

### Auth
- `POST /api/auth/register-doctor` - Register as doctor
- `POST /api/auth/register-clinic` - Register as clinic
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Doctor
- `GET /api/doctors/me` - Get doctor profile
- `PUT /api/doctors/me` - Update doctor profile

### Clinic
- `GET /api/clinics/me` - Get clinic profile
- `PUT /api/clinics/me` - Update clinic profile

### Jobs
- `GET /api/jobs` - List all active jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (clinic only)
- `GET /api/jobs/my-jobs` - List clinic's jobs
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `PATCH /api/jobs/:id/toggle` - Toggle job active/inactive

### Applications
- `POST /api/applications` - Apply to job (doctor)
- `GET /api/applications/my-applications` - Get doctor's applications
- `GET /api/applications/job/:jobId/applications` - Get job's applicants (clinic)
- `PATCH /api/applications/:id/status` - Update application status (clinic)

### Admin (Superadmin only)
- `GET /api/admin/stats/overview` - Get platform stats
- `GET /api/admin/stats/jobs-by-city` - Jobs breakdown by city
- `GET /api/admin/stats/applications-by-status` - Applications by status
- `GET /api/admin/users/doctors` - List all doctors
- `GET /api/admin/users/clinics` - List all clinics
- `GET /api/admin/jobs` - List all jobs
- `GET /api/admin/applications` - List all applications
- `GET /api/admin/export/users` - Export users as CSV
- `GET /api/admin/export/jobs` - Export jobs as CSV
- `GET /api/admin/export/applications` - Export applications as CSV
