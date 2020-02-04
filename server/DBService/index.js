import { Op } from 'sequelize';
import sequelize from './sequelize.js';
import { GuitarSeries, Guitar, GuitarColor, Image, MainGalleryImage } from './Models.js';
import seed from './seed.js';

export const init = async () => {
  try {
    console.log('Connection has been established successfully.');

    await sequelize.authenticate();

    // await sequelize.drop();

    await sequelize.sync();

    console.log('Models x Tables sync complete');

    GuitarSeries.hasMany(Guitar, { foreignKey: 'seriesId' });
    Guitar.belongsTo(GuitarSeries, { foreignKey: 'seriesId' });

    Guitar.hasMany(GuitarColor, { foreignKey: 'guitarId' });
    GuitarColor.belongsTo(Guitar, { foreignKey: 'guitarId' });

    GuitarColor.belongsTo(Image, { foreignKey: 'guitarImageId', as: 'guitarImage' });
    GuitarColor.belongsTo(Image, { foreignKey: 'tabImageId', as: 'tabImage' });
    GuitarColor.belongsTo(Image, { foreignKey: 'dotImageId', as: 'dotImage' });
    Image.hasOne(GuitarColor, { foreignKey: 'guitarImageId', as: 'guitarImage' });
    Image.hasOne(GuitarColor, { foreignKey: 'tabImageId', as: 'tabImage' });
    Image.hasOne(GuitarColor, { foreignKey: 'dotImageId', as: 'dotImage' });

    Image.hasOne(MainGalleryImage, { foreignKey: 'imageId' });
    MainGalleryImage.belongsTo(Image, { foreignKey: 'imageId' });

    console.log('Relationships established');

    // await seed();

  } catch(e) {
    console.error('Unable to connect to the database:', e);
  }
};

export const saveImageMetaData = async (name) => {
  const image = await Image.create({ name });
  return image;
};

export const getAllGuitars = async () => {
  const guitars = await Guitar.findAll({ include: { all: true, nested: true } });
  return guitars;
};

export const getAllGuitarsGroupedBySeries = async () => {
  const guitarSeries = await GuitarSeries.findAll({ include: { all: true, nested: true } });
  return guitarSeries;
};

export const getGuitarByUri = async (uri) => {
  const guitar = await Guitar.findOne({
    where: { uri: { [Op.eq]: uri } },
    include: { all: true, nested: true }
  });
  return guitar;
};

export const getMainGalleryImages = async () => {
  const images = await MainGalleryImage.findAll({ include: [Image], order: [
    ['order', 'ASC'],
  ], });
  return images;
};

export const putMainGalleryImage = async (imageId, order) => {
  await MainGalleryImage.create({
    imageId: imageId,
    order
  });
};

export const deleteMainGalleryImage = async (galleryImageId) => {
  await MainGalleryImage.destroy({
    where: {
      id: galleryImageId,
    }
  });
};

export const changeMainGalleryImageOrder = async (galleryImageId, order) => {
  const image = await MainGalleryImage
    .findOne({ where: { id: galleryImageId }});
  image.order = order;
  await image.save();
};