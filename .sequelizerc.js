import path from "path";

module.exports = {
  config: path.resolve("./src/config/database.js"),
  modelsPath: path.resolve("./src/models"),
  migrationsPath: path.resolve("./src/migrations"),
  seedersPath: path.resolve("./src/seeders"),
};
