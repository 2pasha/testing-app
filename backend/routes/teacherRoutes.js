import e from "express";
import { allowTeachersOnly, authenticate } from "../middleware/authMiddleware";

const router = e.Router();

router.get("/teacher-tab", authenticate, allowTeachersOnly, (req, res) => {
  res.json({ message: 'welcome, teacher!' });
})

export default router;
