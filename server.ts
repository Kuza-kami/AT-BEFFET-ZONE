import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize state store folders
const DATA_DIR = path.join(process.cwd(), "data");
const RESERVATIONS_FILE = path.join(DATA_DIR, "reservations.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial mock data
const initialReviews = [
  {
    id: "rev-1",
    name: "Lerato Mokoena",
    rating: 5,
    text: "The absolute best Mogodu and Samp in Pretoria Central! Perfectly clean, quick service during my lunch break, and very affordable.",
    date: "2026-06-20",
    verified: true,
    isUserCreated: false
  },
  {
    id: "rev-2",
    name: "Sipho Sithole",
    rating: 5,
    text: "Excellent traditional African buffet. Their beef stew and dumplings taste exactly like home. Extremely neat and well managed.",
    date: "2026-06-24",
    verified: true,
    isUserCreated: false
  },
  {
    id: "rev-3",
    name: "Naledi Ndlovu",
    rating: 4,
    text: "At Buffet Zone is our team's go-to spot for Friday office lunches. The buffet stations are kept clean, and the food is always fresh and hot.",
    date: "2026-06-18",
    verified: true,
    isUserCreated: false
  },
  {
    id: "rev-4",
    name: "Francois du Toit",
    rating: 5,
    text: "Incredibly delicious, great variety, and extremely affordable. A Pretoria gem for anyone wanting to taste authentic African cuisine.",
    date: "2026-06-22",
    verified: true,
    isUserCreated: false
  }
];

const initialReservations = [
  {
    id: "res-101",
    name: "Thabo Cele",
    email: "thabo.cele@gov.za",
    phone: "+27 82 555 1234",
    date: "2026-06-26",
    time: "12:30",
    guests: 6,
    occasion: "Business Lunch",
    notes: "Departmental lunch meeting, require a quiet table if possible.",
    status: "confirmed",
    createdAt: new Date().toISOString()
  }
];

// Helper to load data
const loadJSON = (filePath: string, fallback: any) => {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error(`Error loading file ${filePath}:`, e);
  }
  return fallback;
};

// Helper to save data
const saveJSON = (filePath: string, data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`Error saving file ${filePath}:`, e);
  }
};

// State caches
let reviews = loadJSON(REVIEWS_FILE, initialReviews);
let reservations = loadJSON(RESERVATIONS_FILE, initialReservations);

// Initialize files if they don't exist
if (!fs.existsSync(REVIEWS_FILE)) saveJSON(REVIEWS_FILE, reviews);
if (!fs.existsSync(RESERVATIONS_FILE)) saveJSON(RESERVATIONS_FILE, reservations);

/* ==========================================================
   API ROUTES
   ========================================================== */

// 1. Get Reviews
app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});

// 2. Add Review
app.post("/api/reviews", (req, res) => {
  const { name, rating, text, foodImage } = req.body;
  if (!name || !rating || !text) {
    return res.status(400).json({ error: "Name, rating, and review text are required." });
  }

  if (!foodImage) {
    return res.status(400).json({ error: "A verified food photo is required to submit and verify your review." });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    name,
    rating: Number(rating),
    text,
    foodImage,
    date: new Date().toISOString().split("T")[0],
    verified: true,
    isUserCreated: true
  };

  reviews.unshift(newReview);
  saveJSON(REVIEWS_FILE, reviews);
  res.status(201).json(newReview);
});

// 3. Get Reservations
app.get("/api/reservations", (req, res) => {
  res.json(reservations);
});

// 4. Create Reservation
app.post("/api/reservations", (req, res) => {
  const { name, email, phone, date, time, guests, occasion, notes } = req.body;
  if (!name || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: "Required reservation fields are missing." });
  }

  const newReservation = {
    id: `res-${Math.floor(100000 + Math.random() * 900000)}`,
    name,
    email,
    phone,
    date,
    time,
    guests: Number(guests),
    occasion: occasion || "None",
    notes: notes || "",
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  reservations.unshift(newReservation);
  saveJSON(RESERVATIONS_FILE, reservations);
  res.status(201).json(newReservation);
});


/* ==========================================================
   VITE DEVELOPER VS PRODUCTION STATIC SERVING
   ========================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Buffet Zone Server] Full-stack server actively listening on http://localhost:${PORT}`);
  });
}

startServer();
