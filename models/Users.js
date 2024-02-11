import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';

class Users extends Model {}

Users.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordRepeat: {
      type: DataTypes.VIRTUAL,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    photo: {
      type: DataTypes.STRING,
    },
    cardName: {
      type: DataTypes.STRING,
    },
    cardNumber: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'users',
    indexes: [
      { fields: ['email'], unique: true },
    ],
  },
);

export default Users;
