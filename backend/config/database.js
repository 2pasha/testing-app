import { Sequelize } from "sequelize";
import config from "./config.json" assert { type: "json" }; // ✅ Load JSON file

const env = process.env.NODE_ENV || "development"; // Get current environment
const dbConfig = config[env]; // Select DB config based on environment

// ✅ Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false, // Disable logging (optional)
  }
);

export default sequelize;
