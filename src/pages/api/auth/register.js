import { User } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  
  try {
    const { name, email, password, role = "student" } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const newUser = await User.create({ name, email, password, role });
    
    res.status(201).json({ message: "User created successfully", user: { id: newUser.id, name, email, role } });
  } catch (error) {
    res.status(500).json({ message: "Error register user", error: error.message });
  }
}
