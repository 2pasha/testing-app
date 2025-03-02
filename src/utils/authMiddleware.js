import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export default async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token'});
  }
}