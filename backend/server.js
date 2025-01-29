import express from 'express';
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import sequelize from './config/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('server is working');
})

app.use('/api/auth', authRoutes);

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ Database connected!");
    
    await sequelize.sync(); // Sync models with DB
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})