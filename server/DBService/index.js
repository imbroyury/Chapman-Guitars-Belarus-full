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
    // await Promise.all([
    //   GuitarSeries, Guitar, GuitarColor, Image,
    // ].map(model => model.sync()));

    console.log('Models x Tables sync complete');

    GuitarSeries.hasMany(Guitar, { foreignKey: 'series_id' });
    Guitar.belongsTo(GuitarSeries, { foreignKey: 'series_id' });

    Guitar.hasMany(GuitarColor, { foreignKey: 'guitar_id' });
    GuitarColor.belongsTo(Guitar, { foreignKey: 'guitar_id' });

    GuitarColor.belongsTo(Image, { foreignKey: 'guitar_image_id', as: 'guitar_image' });
    GuitarColor.belongsTo(Image, { foreignKey: 'tab_image_id', as: 'tab_image' });
    GuitarColor.belongsTo(Image, { foreignKey: 'dot_image_id', as: 'dot_image' });
    Image.hasOne(GuitarColor, { foreignKey: 'guitar_image_id', as: 'guitar_image' });
    Image.hasOne(GuitarColor, { foreignKey: 'tab_image_id', as: 'tab_image' });
    Image.hasOne(GuitarColor, { foreignKey: 'dot_image_id', as: 'dot_image' });

    Image.hasOne(MainGalleryImage, { foreignKey: 'image_id' });
    MainGalleryImage.belongsTo(Image, { foreignKey: 'image_id' });

    console.log('Relationships established');

    // await seed();

  } catch(e) {
    console.error('Unable to connect to the database:', e);
  }
};

export const saveImageMetaData = async (name) => {
  await Image.create({ name });
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
    ['priority', 'ASC'],
  ], });
  return images;
};