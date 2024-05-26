import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize.js';
import Movies from './Movies.js';

class Categories extends Model {}

Categories.init(
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
  },
  {
    sequelize,
    tableName: 'categories',
    modelName: 'categories',
  },
);

Categories.belongsToMany(Movies, {
  through: 'movieCategories',
  foreignKey: 'categoryId',
  otherKey: 'movieId',
  as: 'movies',
});

Movies.belongsToMany(Categories, {
  through: 'movieCategories',
  foreignKey: 'movieId',
  otherKey: 'categoryId',
  as: 'categories',
});

export default Categories;
