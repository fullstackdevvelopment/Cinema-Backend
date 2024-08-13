import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';
import Movies from './Movies.js';

class Schedule extends Model {}

Schedule.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    showTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'schedule',
    modelName: 'Schedule',
  },
);

Movies.hasMany(Schedule, {
  foreignKey: 'movieId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'schedules',
});
Schedule.belongsTo(Movies, {
  foreignKey: 'movieId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'movie',
});

export default Schedule;
