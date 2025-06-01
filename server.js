// server.js

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3001;

// ── 1) MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── 2) SERVE STATIC FILES FROM ./frontend ────────────────────────────────────────
app.use(express.static(path.join(__dirname, "frontend")));

// ── 3) PRELOAD USERS ─────────────────────────────────────────────────────────────
let users = [
  { username: "tech_ali", password: "password123", role: "technician" },
  { username: "tech_beka", password: "password123", role: "technician" },
  { username: "admin", password: "adminpass", role: "admin" },
];

let requests = [];
let tasks = [];

// ── 4) REGISTER NEW USER ────────────────────────────────────────────────────────
// POST /api/register
app.post("/api/register", (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }
  const allowedRoles = ["individual", "business", "technician", "admin"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "Username already taken" });
  }
  users.push({ username, password, role });
  return res.json({ message: "Registered successfully" });
});

// ── 5) LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    return res.json({ success: true, role: user.role });
  }
  return res.status(401).json({ success: false });
});

// ── 6) SUBMIT SUPPORT REQUEST ────────────────────────────────────────────────────
// POST /api/submit-request
app.post("/api/submit-request", (req, res) => {
  const { username, message } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !["individual", "business"].includes(user.role)) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  const newReq = {
    id: requests.length + 1,
    username,
    message,
    status: "Pending",
    timestamp: new Date().toISOString(),
  };
  requests.push(newReq);
  return res.json({ message: "Request submitted" });
});

// ── 7) GET ALL SUPPORT REQUESTS (admin only) ────────────────────────────────────
// GET /api/requests
app.get("/api/requests", (req, res) => {
  return res.json(requests);
});

// ── 8) UPDATE REQUEST STATUS (admin only) ───────────────────────────────────────
// POST /api/update-request
app.post("/api/update-request", (req, res) => {
  const { id, status } = req.body;
  const reqItem = requests.find((r) => r.id === id);
  if (reqItem) {
    reqItem.status = status;
    return res.json({ message: "Request updated" });
  }
  return res.status(404).json({ error: "Request not found" });
});

// ── 9) GET TECHNICIANS ──────────────────────────────────────────────────────────
// GET /api/technicians
app.get("/api/technicians", (req, res) => {
  const techs = users
    .filter((u) => u.role === "technician")
    .map((u) => ({ username: u.username }));
  return res.json(techs);
});

// ── 10) ASSIGN TASK TO TECHNICIAN ───────────────────────────────────────────────
// POST /api/assign-task
app.post("/api/assign-task", (req, res) => {
  const { technician, description, date, priority } = req.body;
  if (!technician || !description || !date || !priority) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const techUser = users.find(
    (u) => u.username === technician && u.role === "technician"
  );
  if (!techUser) {
    return res.status(400).json({ error: "Technician not found or invalid" });
  }
  const newTask = {
    id: tasks.length + 1,
    technician,
    description,
    date,
    priority,
    status: "Assigned",
    timestamp: new Date().toISOString(),
  };
  tasks.push(newTask);
  return res.json({ message: "Task assigned" });
});

// ── 11) GET TASKS FOR A SPECIFIC TECHNICIAN ────────────────────────────────────
// GET /api/tasks?technician=<username>
app.get("/api/tasks", (req, res) => {
  const tech = req.query.technician;
  if (!tech) {
    return res.status(400).json({ error: "Missing technician query" });
  }
  const techTasks = tasks.filter((t) => t.technician === tech);
  return res.json(techTasks);
});

// ── 12) FALLBACK: SERVE home.html FOR ANY NON-API REQUEST ───────────────────────
// If no /api route matches, send the homepage from frontend/home.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "home.html"));
});

// ── 13) START THE SERVER ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
