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
      allowNull: true,
    },
    name1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actorPhoto1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actorPhoto2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actorPhoto3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name4: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actorPhoto4: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name5: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actorPhoto5: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name6: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actorPhoto6: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name7: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actorPhoto7: {
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
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'movies',
});

Movies.hasMany(Actors, {
  foreignKey: 'movieId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'actors',
});

Movies.hasOne(Actors, {
  foreignKey: 'movieId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'actor',
});

export default Actors;
