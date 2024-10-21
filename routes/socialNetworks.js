import express from "express";
import { SocialNetwork } from "../models/index.js";
import authenticateToken from "../middleware/validate-auth.js";
import refreshCookie from "../middleware/refresh-cookie.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const socialNetworks = await SocialNetwork.find({ status: true }).sort({
      createdAt: "desc",
    });
    res.json({ items: socialNetworks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving social networks" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const socialNetwork = await SocialNetwork.findById(req.params.id);
    if (!socialNetwork || socialNetwork.status === false) {
      return res.status(404).json({ message: "Social network not found" });
    }
    res.json(socialNetwork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving the social network" });
  }
});

router.post("/", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const { name, url, iconUrl } = req.body;

    const socialNetwork = new SocialNetwork({
      name,
      url,
      iconUrl,
    });

    await socialNetwork.save();
    res.json({
      message: "Social network created successfully",
      data: socialNetwork,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating the social network" });
  }
});

router.patch("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const socialNetwork = await SocialNetwork.findById(req.params.id);
    if (!socialNetwork || socialNetwork.status === false) {
      return res.status(404).json({ message: "Social network not found" });
    }

    socialNetwork.name = req.body.name || socialNetwork.name;
    socialNetwork.url = req.body.url || socialNetwork.url;
    socialNetwork.iconUrl = req.body.iconUrl || socialNetwork.iconUrl;

    await socialNetwork.save();
    res.json({
      message: "Social network updated successfully",
      data: socialNetwork,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating the social network" });
  }
});

router.delete("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const socialNetwork = await SocialNetwork.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );

    if (!socialNetwork) {
      return res.status(404).json({ message: "Social network not found" });
    }

    res.json({
      message: "Social network marked as inactive",
      data: socialNetwork,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error marking the social network as inactive" });
  }
});

export default router;
