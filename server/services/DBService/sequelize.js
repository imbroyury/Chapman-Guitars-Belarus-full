import { Sequelize } from 'sequelize';
import { mysql } from '../../configuration.json';

export default new Sequelize(
  'chapman',
  mysql.user,
  mysql.password,
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
