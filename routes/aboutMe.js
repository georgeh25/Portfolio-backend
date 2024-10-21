import express from "express";
import { AboutMe } from "../models/index.js";
import authenticateToken from "../middleware/validate-auth.js";
import refreshCookie from "../middleware/refresh-cookie.js";
import upload from "../middleware/multer-config.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const aboutMe = await AboutMe.findOne();
    if (!aboutMe) {
      return res.status(404).json({ message: "Profile information not found" });
    }
    res.json(aboutMe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obtaining profile" });
  }
});

router.patch(
  "/",
  authenticateToken,
  refreshCookie,
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      let aboutMe = await AboutMe.findOne();

      if (!aboutMe) {
        aboutMe = new AboutMe();
      }

      if (req.body.aboutMe) {
        aboutMe.aboutMe = req.body.aboutMe;
      }

      if (req.file) {
        aboutMe.profilePhotoUrl = `/uploads/${req.file.filename}`;
      }

      await aboutMe.save();
      res.json({ message: "Profile successfully updated", data: aboutMe });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating profile" });
    }
  }
);

export default router;
