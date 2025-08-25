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
const allowlist = new Set([
  "https://admin-186ft4qex-tirath-singhs-projects.vercel.app",
  "https://client-dg0ysnjtx-tirath-singhs-projects.vercel.app",
]);

function isAllowedOrigin(origin) {
  if (!origin) return true; // server-to-server, curl, Postman
  try {
    const url = new URL(origin);

    // ✅ allow ALL Vercel preview subdomains
    if (url.hostname.endsWith(".vercel.app")) return true;

    return allowlist.has(origin);
  } catch {
    return false;
  }
}

const corsOptions = {
  origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Use cors middleware
app.use(cors(corsOptions));

// ✅ Explicitly handle OPTIONS everywhere with 200
app.options("*", cors(corsOptions), (req, res) => {
  res.sendStatus(200);
});
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
