import { parse } from "cookie";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export default async function authMiddleware(req, res, next) {
  try {
    const cookie = parse(req.headers.cookie || "");
    const token = cookie.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
