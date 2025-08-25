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

// CORS — allowed deployed frontends
const allowedOrigins = [
  "https://client-1myinw1im-tirath-singhs-projects.vercel.app/",
  "https://admin-kvk0fl7sq-tirath-singhs-projects.vercel.app",
  
];
app.use(
  cors({
    origin: (origin, cb) => {
      // allow REST clients / curl with no origin
      if (!origin) return cb(null, true);
      return allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

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
