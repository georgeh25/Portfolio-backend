import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

export default function refreshCookie(req, res, next) {
  const { jwtDecoded } = req;

  if (jwtDecoded.exp * 1000 - Date.now() < 30 * 1000) {
    const payload = {
      username: jwtDecoded.username,
      fullname: jwtDecoded.fullname,
    };
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
    });
  }

  next();
}
