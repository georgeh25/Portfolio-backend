import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authenticateToken(req, res, next) {
  const authCookie = req.cookies["accessToken"];

  if (!authCookie) {
    return res.status(401).json({ message: "You must be logged in as a user" });
  }

  jwt.verify(authCookie, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .clearCookie("accessToken")
        .status(401)
        .json({ message: "You must be logged in as a user" });
    }
    req.jwtDecoded = user;
    next();
  });
}
