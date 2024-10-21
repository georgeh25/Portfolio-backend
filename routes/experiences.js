import express from "express";
import { Experience } from "../models/index.js";
import authenticateToken from "../middleware/validate-auth.js";
import refreshCookie from "../middleware/refresh-cookie.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find({ status: true }).sort({
      startDate: "desc",
    });
    res.json({ items: experiences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving experiences" });
  }
});

router.get("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience || experience.status === false) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json(experience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving the experience" });
  }
});

router.post("/", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const { company, role, description, startDate, endDate } = req.body;

    const experience = new Experience({
      company,
      role,
      description,
      startDate,
      endDate,
    });

    await experience.save();
    res.json({ message: "Experience created successfully", data: experience });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating the experience" });
  }
});

router.patch("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience || experience.status === false) {
      return res.status(404).json({ message: "Experience not found" });
    }

    experience.company = req.body.company || experience.company;
    experience.role = req.body.role || experience.role;
    experience.description = req.body.description || experience.description;
    experience.startDate = req.body.startDate || experience.startDate;
    experience.endDate = req.body.endDate || experience.endDate;

    await experience.save();
    res.json({
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating the experience" });
  }
});

router.delete("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json({
      message: "Experience marked as inactive",
      data: experience,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error marking the experience as inactive" });
  }
});

export default router;
