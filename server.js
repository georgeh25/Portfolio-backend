import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import users from "./routes/users.js";
import projectsRoutes from "./routes/projects.js";
import technologiesRoutes from "./routes/technologies.js";
import experiencesRoutes from "./routes/experiences.js";
import SocialNetworkRoutes from "./routes/socialNetworks.js";
import AboutMe from "./routes/aboutMe.js";
import authRoutes from "./routes/auth.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://portfolio-admin-site.vercel.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not authorized by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", users);
app.use("/api/v1/projects", projectsRoutes);
app.use("/api/v1/technologies", technologiesRoutes);
app.use("/api/v1/experiences", experiencesRoutes);
app.use("/api/v1/social-networks", SocialNetworkRoutes);
app.use("/api/v1/about-me", AboutMe);

app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
