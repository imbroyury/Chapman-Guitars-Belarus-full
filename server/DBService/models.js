import { Model, DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

export class Image extends Model {}
Image.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'image',
  timestamps: false
});

export class Guitar extends Model {}
Guitar.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'guitar',
  timestamps: false
});

export class GuitarColor extends Model {}
GuitarColor.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: DataTypes.STRING,
  guitar_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Guitar,
      key: 'id',
    }
  },
  tab_image_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Image,
      key: 'id',
    },
  },
  dot_image_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Image,
      key: 'id',
    },
  },
  guitar_image_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Image,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'guitar_color',
  timestamps: false
});
