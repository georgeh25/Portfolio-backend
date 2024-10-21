import express from "express";
import { User } from "../models/index.js";
import authenticateToken from "../middleware/validate-auth.js";
import refreshCookie from "../middleware/refresh-cookie.js";
import bcryptjs from "bcryptjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find({ status: true }).sort({ createdAt: "desc" });
    res.json({ items: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

router.get("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.status === false) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving the user" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, password, fullname, email } = req.body;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      fullname,
      email,
    });

    await user.save();
    res.json({ message: "User created successfully", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

router.patch("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.status === false) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = req.body.username || user.username;
    user.fullname = req.body.fullname || user.fullname;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = await bcryptjs.hash(req.body.password, 10);
    }

    await user.save();
    res.json({ message: "User updated successfully", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user" });
  }
});

router.delete("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const activeUsersCount = await User.countDocuments({ status: true });

    if (activeUsersCount <= 1) {
      return res.status(400).json({
        message: "There must be at least one active user in the system",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User marked as inactive", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marking user as inactive" });
  }
});

export default router;
