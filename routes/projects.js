import express from "express";
import { Project } from "../models/index.js";
import authenticateToken from "../middleware/validate-auth.js";
import refreshCookie from "../middleware/refresh-cookie.js";
import upload from "../middleware/multer-config.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ status: true })
      .populate("technologies")
      .sort({ createdAt: "desc" });
    res.json({ items: projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving projects" });
  }
});

router.get("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "technologies"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving the project" });
  }
});

router.post(
  "/",
  authenticateToken,
  refreshCookie,
  upload.single("image"),
  async (req, res) => {
    try {
      let technologies = [];
      if (req.body.technologies) {
        try {
          technologies = JSON.parse(req.body.technologies);
          if (!Array.isArray(technologies)) {
            throw new Error("Technologies must be an array");
          }
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Invalid technologies format" });
        }
      }

      const newProject = new Project({
        title: req.body.title,
        description: req.body.description,
        technologies: technologies,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      });

      await newProject.save();
      res
        .status(201)
        .json({ message: "Project created successfully", data: newProject });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Error creating project" });
    }
  }
);

router.patch(
  "/:id",
  authenticateToken,
  refreshCookie,
  upload.single("image"),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      project.title = req.body.title || project.title;
      project.description = req.body.description || project.description;

      if (req.body.technologies) {
        try {
          project.technologies = JSON.parse(req.body.technologies);
        } catch (error) {
          return res
            .status(400)
            .json({ message: "Invalid technologies format" });
        }
      }

      if (req.file) {
        project.imageUrl = `/uploads/${req.file.filename}`;
      }

      await project.save();
      res.json({ message: "Project updated successfully", data: project });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Error updating project" });
    }
  }
);

router.delete("/:id", authenticateToken, refreshCookie, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project marked as inactive", data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marking the project as inactive" });
  }
});

export default router;
