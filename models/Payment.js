import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';
import Users from './Users.js';

class Payment extends Model {}

Payment.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stripePaymentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'payments',
    modelName: 'payments',
    indexes: [
      { fields: ['stripePaymentId'], unique: true },
    ],
  },
);

Payment.belongsTo(Users, {
  foreignKey: 'userId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'users',
});

Users.hasMany(Payment, {
  foreignKey: 'userId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'payments',
});

export default Payment;
