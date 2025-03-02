import sequelize from '../utils/db.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from '../models/user.model.js';

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    await sequelize.sync({ alter: true }); // Use { force: true } to drop & recreate tables
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to sync database:", error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
