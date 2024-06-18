import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';
import Movies from './Movies.js';

class MovieStills extends Model {}

MovieStills.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    stillPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'movieStills',
    modelName: 'movieStills',
  },
);

Movies.hasMany(MovieStills, {
  foreignKey: 'movieId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'stills',
});

MovieStills.belongsTo(Movies, {
  foreignKey: 'movieId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'movie',
});

export default MovieStills;
