import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';
import Users from './Users.js';
import Movies from './Movies.js';

class Bookings extends Model {}

Bookings.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    bookingRow: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seatNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticketPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'bookings',
    modelName: 'bookings',
  },
);

Bookings.belongsTo(Users, {
  foreignKey: 'userId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'users',
});

Bookings.belongsTo(Movies, {
  foreignKey: 'movieId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'movies',
});

Users.hasMany(Bookings, {
  foreignKey: 'userId',
  as: 'bookings',
});

export default Bookings;
