import { DataTypes, Model } from 'sequelize';
import md5 from 'md5';
import sequelize from '../services/sequelize.js';

const { USER_PASSWORD_HASH } = process.env;

class Users extends Model {
  static async createAdmin() {
    const passwordHash = md5(md5('admin') + USER_PASSWORD_HASH);
    const admin = await this.create({
      firstName: 'Admin',
      lastName: 'Admin',
      userName: 'admin',
      email: 'admin@example.com',
      password: passwordHash,
      city: 'Admin City',
      country: 'Admin Country',
      address: 'Admin Address',
      phone: '1234567890',
      photo: null,
      status: 'active',
    });
    await admin.update({ isAdmin: true });
  }
}

Users.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
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
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'users',
    indexes: [
      {
        fields: ['userName'],
        unique: true,
      },
      {
        fields: ['email'],
        unique: true,
      },
    ],
  },
);

Users.afterSync(async () => {
  const adminExists = await Users.findOne({ where: { isAdmin: true } });
  if (!adminExists) {
    await Users.createAdmin();
  }
});

export default Users;
