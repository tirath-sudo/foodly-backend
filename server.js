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

// Body parsers
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// ---- CORS FIX ----
const allowlist = [
  "https://admin-186ft4qex-tirath-singhs-projects.vercel.app",
  "https://client-dg0ysnjtx-tirath-singhs-projects.vercel.app",
];

function isAllowedOrigin(origin) {
  if (!origin) return true; // server-to-server, curl, Postman
  try {
    const url = new URL(origin);
    if (url.hostname.endsWith(".vercel.app")) return true; // allow all vercel subdomains
    return allowlist.includes(origin);
  } catch {
    return false;
  }
}

const corsOptionsDelegate = (req, cb) => {
  const origin = req.header("Origin");
  if (isAllowedOrigin(origin)) {
    cb(null, {
      origin: origin || "*",
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      allowedHeaders: ["Content-Type", "Authorization"],
    });
  } else {
    cb(new Error("Not allowed by CORS"));
  }
};

// Apply cors globally
app.use(cors(corsOptionsDelegate));

// Explicit OPTIONS for all routes
app.options("*", cors(corsOptionsDelegate));
// ---- END CORS FIX ----

// Static
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
