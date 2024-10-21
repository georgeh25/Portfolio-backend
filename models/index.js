import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
  },
  technologies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technology",
    },
  ],
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const TechnologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  iconUrl: {
    type: String,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SocialNetworkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  iconUrl: { type: String },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const AboutMeSchema = new mongoose.Schema({
  profilePhotoUrl: { type: String }, // URL de la foto de perfil
  aboutMe: { type: String }, // Texto "sobre mí"
  createdAt: { type: Date, default: Date.now },
});

const ExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", UserSchema);
export const Project = mongoose.model("Project", ProjectSchema);
export const Technology = mongoose.model("Technology", TechnologySchema);
export const SocialNetwork = mongoose.model(
  "SocialNetwork",
  SocialNetworkSchema
);
export const AboutMe = mongoose.model("AboutMe", AboutMeSchema);
export const Experience = mongoose.model("Experience", ExperienceSchema);
