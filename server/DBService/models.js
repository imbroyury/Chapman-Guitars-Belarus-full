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
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'image',
  timestamps: false
});

export class MainGalleryImage extends Model {}
MainGalleryImage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  image_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Image,
      key: 'id',
    },
  }
}, {
  sequelize,
  modelName: 'main_gallery_image',
  timestamps: false
});

export class GuitarSeries extends Model {}
GuitarSeries.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  uri: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'guitar_series',
  timestamps: false
});

export class Guitar extends Model {}
Guitar.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  uri: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  series_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: GuitarSeries,
      key: 'id',
    },
  },
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
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
