import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

dotenv.config();

const app = express();

// Body parsers — big enough for images/JSON
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// ---- CORS FIX ----
const allowlist = new Set([
  "https://client-dg0ysnjtx-tirath-singhs-projects.vercel.app",
  "https://admin-186ft4qex-tirath-singhs-projects.vercel.app",
]);

function isAllowedOrigin(origin) {
  if (!origin) return true; // allow Postman, curl, server-to-server
  try {
    const url = new URL(origin);
    // Allow all *.vercel.app previews
    if (url.hostname.endsWith(".vercel.app")) return true;
    return allowlist.has(origin);
  } catch {
    return false;
  }
}

const corsOptions = {
  origin: (origin, cb) => {
    if (isAllowedOrigin(origin)) cb(null, true);
    else cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // <- safer for some browsers than 204
};

// Enable CORS globally
app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS for all routes
app.options("*", cors(corsOptions));
// ---- END CORS FIX ----

// Static (if you ever keep local uploads; not required for Cloudinary)
app.use("/images", express.static("uploads"));

// DB
connectDB();

// Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Health
app.get("/", (req, res) => res.send("API Working"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
