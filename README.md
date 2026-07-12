# 🚌 TransitOps — Fleet & Transport Management Platform

A full-stack web application for managing fleet operations, drivers, trips, fuel expenses, and maintenance — with role-based access control for Admins, Dispatchers, and Drivers.

---

## ✨ Features

| Module | Description |
|---|---|
| 🔐 Auth & RBAC | JWT-based login with role guards (Admin / Dispatcher / Driver) |
| 📊 Dashboard | Real-time KPIs and activity overview per role |
| 🚗 Vehicle Management | Track and manage fleet vehicles |
| 🧑‍✈️ Driver Management | Onboard and manage driver profiles |
| 🗺️ Trip Dispatcher | Assign and monitor trips in real time |
| ⛽ Fuel & Expenses | Log and analyze fuel consumption and costs |
| 🔧 Vehicle Maintenance | Schedule and track maintenance records |
| 📈 Reports & Analytics | Charts and insights across fleet operations |
| ⚙️ Settings | System-wide RBAC and configuration |

---

## 🧰 Tech Stack

**Frontend** — React + Vite, React Router, Context API, CSS Variables (dark/light theme)

**Backend** — Node.js, Express.js, MongoDB + Mongoose, JWT, Bcrypt, Multer

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/transitops.git
cd transitops
```

### 2. Configure environment
```bash
cp backend/.env.example backend/.env
# Fill in your MongoDB URI, JWT secret, and other values
```

### 3. Install & run backend
```bash
cd backend
npm install
npm run dev
```

### 4. Install & run frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

---

## 🔑 Default Roles

| Role | Access |
|---|---|
| **Admin** | Full system access — users, vehicles, reports, settings |
| **Dispatcher** | Trip assignment and driver coordination |
| **Driver** | Personal dashboard — assigned trips and profile |

---

## 📁 Project Structure

```
transitops/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/       # Auth & error middleware
│   └── server.js
└── frontend/
    └── src/
        ├── pages/       # Dashboard, Login, Management pages
        ├── components/  # Shared UI components
        └── context/     # Auth & theme context
```

---

## 📄 License

MIT © 2026 TransitOps
