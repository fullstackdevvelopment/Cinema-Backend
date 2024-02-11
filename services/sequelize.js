import { Sequelize } from 'sequelize';
import cls from 'cls-hooked';

const {
  MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD,
} = process.env;

const namespace = cls.createNamespace('sequelize-transaction-namespace');

Sequelize.useCLS(namespace);

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  dialect: 'mysql',
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  logging: false,
});

export default sequelize;
