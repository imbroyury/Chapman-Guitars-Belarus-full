import { Sequelize } from 'sequelize';

export default new Sequelize(
  'chapman',
  'root',
  'root',
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
