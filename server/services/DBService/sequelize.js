import { Sequelize } from 'sequelize';
import credentials from './mysql-credentials.json';

export default new Sequelize(
  'chapman',
  credentials.user,
  credentials.password,
  {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT0'
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  },
);
