import sequelize from './sequelize.js';
import { Guitar, GuitarColor, Image } from './Models.js';

export const init = async () => {
  try {
    console.log('Connection has been established successfully.');
    await sequelize.authenticate();


    await Promise.all([
      Guitar, GuitarColor, Image,
    ].map(model => model.sync()));

    console.log('Models x Tables sync complete');

    // await Image.create({ name: 'arbitrary-image.png'});
    // console.log('Creating test guitar ... ');
    //
    // const guitar = await Models.Guitar.create({
    //   name: 'ML1 Modern Standard'
    // });
    // await Models.GuitarColor.create({
    //   name: 'Midnighy Sky',
    //   guitar_id: guitar.get('id'),
    //   tab_image_id: 2,
    //   dot_image_id: 3,
    //   guitar_image_id: 4,
    // });
    Guitar.hasMany(GuitarColor, { foreignKey: 'guitar_id' });
    GuitarColor.belongsTo(Guitar, { foreignKey: 'guitar_id' });

    GuitarColor.belongsTo(Image, { foreignKey: 'guitar_image_id', as: 'guitar_image' });
    GuitarColor.belongsTo(Image, { foreignKey: 'tab_image_id', as: 'tab_image' });
    GuitarColor.belongsTo(Image, { foreignKey: 'dot_image_id', as: 'dot_image' });
    Image.hasOne(GuitarColor, { foreignKey: 'guitar_image_id', as: 'guitar_image' });
    Image.hasOne(GuitarColor, { foreignKey: 'tab_image_id', as: 'tab_image' });
    Image.hasOne(GuitarColor, { foreignKey: 'dot_image_id', as: 'dot_image' });

    // const guitar = await Guitar.create({
    //   name: 'ML2 Modern Standard'
    // });
    // await GuitarColor.create({
    //   name: 'White Dove',
    //   guitar_id: guitar.get('id'),
    //   tab_image_id: 8,
    //   dot_image_id: 9,
    //   guitar_image_id: 10,
    // });
  } catch(e) {
    console.error('Unable to connect to the database:', e);
  }
};

export const saveImageMetaData = async (name) => {
  await Image.create({ name });
};

export const getAllGuitars = async () => {
  const guitars = await Guitar.findAll({ include: { all: true, nested: true }});
  return guitars;
};