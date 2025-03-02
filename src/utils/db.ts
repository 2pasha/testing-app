import development from '../config/database';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  development.database,
  development.username,
  development.password,
  {
    host: development.host,
    dialect: "postgres",
    logging: false,
    define: {
      freezeTableName: true,
    }
  }
)

export default sequelize;