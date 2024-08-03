import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';
import Rows from './Rows.js';

class Seats extends Model {}

Seats.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    seatNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Available', 'Booked'),
      allowNull: false,
      defaultValue: 'Available',
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'seats',
    modelName: 'Seat',
  },
);

Rows.hasMany(Seats, {
  foreignKey: 'rowId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'seats',
});
Seats.belongsTo(Rows, {
  foreignKey: 'rowId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'rows',
});

export default Seats;
