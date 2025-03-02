import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/db';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
}

class User extends Model<UserAttributes, Optional<UserAttributes, "id">> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "student" | "teacher";
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("student", "teacher"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true, // Adds createdAt & updatedAt
  }
);

export default User;