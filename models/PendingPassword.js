import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';

class PendingPassword extends Model {
}

PendingPassword.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: DataTypes.STRING,
    verificationCode: DataTypes.STRING,
    expiresAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'pendingPassword',
    modelName: 'pendingPassword',
  },
);

export default PendingPassword;
