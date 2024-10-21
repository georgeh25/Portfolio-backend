import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/index.js";
import authenticateToken from "../middleware/validate-auth.js";

dotenv.config();

const router = express.Router();
const secretKey = process.env.JWT_SECRET_KEY;

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    status: true,
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ message: "Incorrect username or password" });
  }

  const payload = { username: user.username, fullname: user.fullname };
  const accessToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 3600000,
    secure: true,
  });
  const currentTime = new Date().toLocaleString();
  console.log(`Authenticated user: ${user.username} a las ${currentTime}`);

  res.json({ message: "Successful entry", user: payload });
});

router.get("/logout", async (req, res) => {
  res.clearCookie("accessToken").json({ message: "User session closed" });
});

router.get("/check", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Valid session",
    user: req.jwtDecoded,
  });
});

export default router;
