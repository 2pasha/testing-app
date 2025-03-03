import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../utils/db";
import bcrypt from "bcryptjs";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
}

class User extends Model<UserAttributes, Optional<UserAttributes, "id">> {}

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
    tableName: "Users",
    timestamps: true, // Adds createdAt & updatedAt
  }
);

User.beforeCreate(async (user) => {
  if (!user.getDataValue("password")) {
    throw new Error("Password is required");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.getDataValue("password"), salt);

  user.setDataValue("password", hashedPassword);
});

export default User;
