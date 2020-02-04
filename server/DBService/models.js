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
  timestamps: false
});

export class MainGalleryImage extends Model {}
MainGalleryImage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Image,
      key: 'id',
    },
  }
}, {
  sequelize,
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
  seriesId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: GuitarSeries,
      key: 'id',
    },
  },
}, {
  sequelize,
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
  guitarId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Guitar,
      key: 'id',
    }
  },
  tabImageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Image,
      key: 'id',
    },
  },
  dotImageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Image,
      key: 'id',
    },
  },
  guitarImageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Image,
      key: 'id',
    },
  },
}, {
  sequelize,
  timestamps: false
});

export class Artist extends Model {}
Artist.init({
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
  description: {
    type: DataTypes.TEXT,
  },
  photoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Image,
      key: 'id',
    }
  }
}, {
  sequelize,
  timestamps: false
});
