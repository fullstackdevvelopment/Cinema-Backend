import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';

class MovieCategories extends Model {}

MovieCategories.init(
  {
    movieId: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'movieCategories',
    modelName: 'movieCategories',
  },
);

export default MovieCategories;
