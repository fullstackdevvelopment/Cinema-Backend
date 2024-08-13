import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';

class PendingUsers extends Model {
}

PendingUsers.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    photo: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    verificationCode: DataTypes.STRING,
    expiresAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'pendingUsers',
    modelName: 'pendingUsers',
  },
);

export default PendingUsers;
