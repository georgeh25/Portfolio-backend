import express from "express";
import { Technology } from "../models/index.js";
import authenticateToken from "../middleware/validate-auth.js";
import refreshCookie from "../middleware/refresh-cookie.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const technologies = await Technology.find({ status: true }).sort({
      createdAt: "desc",
    });
    res.json({ items: technologies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving technologies" });
  }
});

router.get("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const technology = await Technology.findById(req.params.id);
    if (!technology || technology.status === false) {
      return res.status(404).json({ message: "Technology not found" });
    }
    res.json(technology);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving the technology" });
  }
});

router.post("/", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const { name, iconUrl } = req.body;

    const technology = new Technology({
      name,
      iconUrl,
    });

    await technology.save();
    res.json({ message: "Technology created successfully", data: technology });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating technology" });
  }
});

router.patch("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const technology = await Technology.findById(req.params.id);
    if (!technology || technology.status === false) {
      return res.status(404).json({ message: "Technology not found" });
    }

    technology.name = req.body.name || technology.name;
    technology.iconUrl = req.body.iconUrl || technology.iconUrl;

    await technology.save();
    res.json({
      message: "Technology updated successfully",
      data: technology,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating technology" });
  }
});

router.delete("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const technology = await Technology.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );

    if (!technology) {
      return res.status(404).json({ message: "Technology not found" });
    }

    res.json({ message: "Technology marked as inactive", data: technology });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marking technology as inactive" });
  }
});

export default router;
