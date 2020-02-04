import { Op } from 'sequelize';
import sequelize from './sequelize.js';
import { GuitarSeries, Guitar, GuitarColor, Image, MainGalleryImage } from './Models.js';
import seed from './seed.js';

export const init = async () => {
  try {
    console.log('Connection has been established successfully.');

    await sequelize.authenticate();

    await sequelize.sync();

    console.log('Models x Tables sync complete');

    await GuitarSeries.hasMany(Guitar, { foreignKey: 'seriesId' });
    await Guitar.belongsTo(GuitarSeries, { foreignKey: 'seriesId' });
    await Guitar.hasMany(GuitarColor, { foreignKey: 'guitarId' });
    await GuitarColor.belongsTo(Guitar, { foreignKey: 'guitarId' });
    await GuitarColor.belongsTo(Image, { foreignKey: 'guitarImageId', as: 'guitarImage' });
    await GuitarColor.belongsTo(Image, { foreignKey: 'tabImageId', as: 'tabImage' });
    await GuitarColor.belongsTo(Image, { foreignKey: 'dotImageId', as: 'dotImage' });
    await Image.hasOne(GuitarColor, { foreignKey: 'guitarImageId', as: 'guitarImage' });
    await Image.hasOne(GuitarColor, { foreignKey: 'tabImageId', as: 'tabImage' });
    await Image.hasOne(GuitarColor, { foreignKey: 'dotImageId', as: 'dotImage' });
    await Image.hasOne(MainGalleryImage, { foreignKey: 'imageId' });
    await MainGalleryImage.belongsTo(Image, { foreignKey: 'imageId' });

    console.log('Relationships established');

    // await sequelize.drop();
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

export const getMainGalleryImage = async (galleryImageId) => {
  const image = await MainGalleryImage.findOne({
    where: {
      id: galleryImageId,
    },
    include: [Image],
  });
  return image;
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
    },
  });
};

export const getImage = async (id) => {
  await Image.findOne({
    where: {
      id,
    }
  });
};

export const deleteImage = async (id) => {
  await Image.destroy({
    where: {
      id,
    }
  });
};

export const changeMainGalleryImageOrder = async (galleryImageId, order) => {
  const galleryImage = await MainGalleryImage
    .findOne({ where: { id: galleryImageId }});
  galleryImage.order = order;
  await galleryImage.save();
};