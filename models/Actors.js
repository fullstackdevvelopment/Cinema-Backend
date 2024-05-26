import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';
import Movies from './Movies.js';

class Actors extends Model {}

Actors.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'actors',
    modelName: 'actors',
  },
);

Actors.belongsTo(Movies, {
  foreignKey: 'movieId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'movie',
});

Movies.hasMany(Actors, {
  foreignKey: 'movieId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'actors',
});

export default Actors;
