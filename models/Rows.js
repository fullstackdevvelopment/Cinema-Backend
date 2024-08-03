import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';
import Schedule from './Schedule.js';

class Rows extends Model {}

Rows.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    rowName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seatCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'rows',
    modelName: 'rows',
  },
);

Schedule.hasMany(Rows, {
  foreignKey: 'scheduleId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'rows',
});
Rows.belongsTo(Schedule, {
  foreignKey: 'scheduleId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'schedule',
});

export default Rows;
